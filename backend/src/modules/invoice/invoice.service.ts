import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PricingService } from '../pricing/pricing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { AddServiceDto } from './dto/add-service.dto';
import { InvoiceStatus } from '@prisma/client';

import { CheckoutInvoiceDto } from './dto/checkout-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
  ) {}

  async createInvoice(dto: CreateInvoiceDto) {
    const room = await this.prisma.room.findUnique({
      where: { id: dto.roomId },
    });
    if (!room) throw new NotFoundException('Room not found');

    const staff = await this.prisma.user.findUnique({
      where: { id: dto.staffId },
    });
    if (!staff) throw new NotFoundException('Staff not found');

    // Nếu có booking, kiểm tra
    if (dto.bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: dto.bookingId },
      });
      if (!booking) throw new NotFoundException('Booking not found');
    }

    return await this.prisma.invoice.create({
      data: {
        roomId: dto.roomId,
        staffId: dto.staffId,
        bookingId: dto.bookingId,
        status: InvoiceStatus.UNPAID,
        startTime: new Date(),
      },
    });
  }

  async findAll() {
    return await this.prisma.invoice.findMany({
      where: { isDeleted: false },
      include: { room: true, staff: true, booking: true },
      orderBy: { startTime: 'desc' },
    });
  }

  async findById(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { invoiceItems: { include: { service: true } }, room: true },
    });
    if (!invoice || invoice.isDeleted) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async addService(invoiceId: string, dto: AddServiceDto) {
    const invoice = await this.findById(invoiceId);
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice already paid, cannot add services');
    }

    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service) throw new NotFoundException('Service not found');

    // Tạo InvoiceService với priceAtTime
    const priceAtTime = service.price;
    const invoiceItem = await this.prisma.invoiceService.create({
      data: {
        invoiceId,
        serviceId: dto.serviceId,
        quantity: dto.quantity,
        priceAtTime,
      },
    });

    // Cập nhật servicesTotal trong hóa đơn chính
    const totalAdded = priceAtTime.toNumber() * dto.quantity;
    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        servicesTotal: { increment: totalAdded },
      },
    });

    return invoiceItem;
  }

  async checkout(id: string, dto: CheckoutInvoiceDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        invoiceItems: { include: { service: true } },
        room: true,
        user: { include: { membershipTier: true } },
      },
    });

    if (!invoice || invoice.isDeleted) throw new NotFoundException('Invoice not found');

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice already paid');
    }

    const endTime = new Date();

    // Sử dụng PricingModule để tính tiền phòng
    const calculated = await this.pricingService.calculatePrice({
      roomTypeId: invoice.room.roomTypeId,
      startTime: invoice.startTime,
      endTime: endTime,
    });

    const roomTotal = calculated.totalPrice;
    const servicesTotal = invoice.servicesTotal.toNumber();
    const subTotal = roomTotal + servicesTotal;
    let tierDiscountAmount = 0;
    let voucherDiscountAmount = 0;

    // 1. Áp dụng Membership Tier Discount
    if (invoice.user && invoice.user.membershipTier) {
      tierDiscountAmount = (subTotal * invoice.user.membershipTier.discountPercent.toNumber()) / 100;
    }

    // 2. Áp dụng Voucher
    if (dto.appliedVoucherCode && invoice.userId) {
      const userVoucher = await this.prisma.userVoucher.findFirst({
        where: {
          userId: invoice.userId,
          voucher: { code: dto.appliedVoucherCode },
        },
        include: { voucher: true },
      });

      if (!userVoucher || userVoucher.status !== 'UNUSED') {
        throw new BadRequestException('Voucher không hợp lệ hoặc đã được sử dụng');
      }

      if (userVoucher.voucher.validTo < new Date() || !userVoucher.voucher.isActive) {
        throw new BadRequestException('Voucher đã hết hạn hoặc bị khóa');
      }

      if (userVoucher.voucher.minOrderValue && subTotal < userVoucher.voucher.minOrderValue.toNumber()) {
        throw new BadRequestException('Đơn hàng chưa đạt giá trị tối thiểu để áp dụng voucher');
      }

      // Calculate voucher discount
      const v = userVoucher.voucher;
      let discountBase = subTotal;
      if (v.scope === 'ROOM_ONLY') discountBase = roomTotal;
      else if (v.scope === 'SERVICE_ONLY') discountBase = servicesTotal;

      if (v.discountType === 'FIXED_AMOUNT') {
        voucherDiscountAmount = v.discountValue.toNumber();
      } else if (v.discountType === 'PERCENTAGE') {
        voucherDiscountAmount = (discountBase * v.discountValue.toNumber()) / 100;
        if (v.maxDiscount && voucherDiscountAmount > v.maxDiscount.toNumber()) {
          voucherDiscountAmount = v.maxDiscount.toNumber();
        }
      }

      // Đánh dấu userVoucher thành USED
      await this.prisma.userVoucher.update({
        where: { id: userVoucher.id },
        data: { status: 'USED', usedAt: new Date(), invoiceId: id },
      });
    }

    const finalTotal = subTotal - tierDiscountAmount - voucherDiscountAmount;

    return await this.prisma.invoice.update({
      where: { id },
      data: {
        endTime,
        roomTotal,
        tierDiscountAmount,
        voucherDiscountAmount,
        finalTotal: finalTotal < 0 ? 0 : finalTotal,
        appliedVoucherCode: dto.appliedVoucherCode || null,
      },
      include: {
        invoiceItems: { include: { service: true } },
      },
    });
  }

  async cancelInvoice(id: string, reason: string) {
    const invoice = await this.findById(id);
    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException('Invoice already paid, cannot be cancelled');
    }

    return await this.prisma.invoice.update({
      where: { id },
      data: { isDeleted: true, reason },
    });
  }
}
