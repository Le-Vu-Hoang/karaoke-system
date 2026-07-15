import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { BookingStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

import { PricingService } from '../pricing/pricing.service';
import { PaymentService, PaymentProvider } from '../payment/payment.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricingService: PricingService,
    private readonly paymentService: PaymentService,
  ) {}

  //# Create new booking for user
  async create(createBookingDto: CreateBookingDto) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: createBookingDto.roomTypeId },
    });
    if (!roomType) throw new NotFoundException('Room type not found.');

    // Tính tiền cọc = Giá 1 giờ của phòng
    const startTime = new Date(createBookingDto.startTime);
    const oneHourLater = new Date(startTime.getTime() + 60 * 60 * 1000);

    const priceResult = await this.pricingService.calculatePrice({
      roomTypeId: createBookingDto.roomTypeId,
      startTime: startTime,
      endTime: oneHourLater,
    });

    const minDeposit = priceResult.totalPrice;
    const finalDeposit =
      createBookingDto.deposit && createBookingDto.deposit > minDeposit ? createBookingDto.deposit : minDeposit;

    const booking = await this.prisma.booking.create({
      data: {
        customerId: createBookingDto.customerId || null,
        guestName: createBookingDto.guestName || null,
        guestPhone: createBookingDto.guestPhone || null,
        roomTypeId: createBookingDto.roomTypeId,
        startTime: startTime,
        endTime: new Date(createBookingDto.endTime),
        deposit: finalDeposit,
        status: BookingStatus.PENDING,
      },
      include: { roomType: true, room: true },
    });

    let paymentIntent: any = null;
    if (finalDeposit > 0) {
      const provider = (createBookingDto.paymentProvider as PaymentProvider) || 'STRIPE';
      paymentIntent = await this.paymentService.createTransaction(
        Number(finalDeposit),
        provider,
        { bookingId: booking.id }
      );
    }

    return {
      booking,
      payment: paymentIntent,
    };
  }

  //# Find all booking query
  async findAll(query: BookingQueryDto) {
    const { search, status, fromDate, toDate, roomTypeId } = query;
    const whereClause: Prisma.BookingWhereInput = {};

    if (status) whereClause.status = status;
    if (roomTypeId) whereClause.roomTypeId = roomTypeId;

    if (search) {
      whereClause.OR = [
        { guestName: { contains: search, mode: 'insensitive' } },
        { guestPhone: { contains: search } },
        { customer: { fullName: { contains: search, mode: 'insensitive' } } },
        { customer: { phoneNumber: { contains: search } } },
      ];
    }

    if (fromDate || toDate) {
      whereClause.startTime = {};
      if (fromDate) whereClause.startTime.gte = new Date(fromDate);
      if (toDate) whereClause.startTime.lte = new Date(toDate);
    }

    return this.prisma.booking.findMany({
      where: whereClause,
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            imageUrl: true,
          },
        },
        roomType: true,
        room: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  //# Find detail of booking
  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { customer: true, roomType: true, room: true },
    });
    if (!booking) throw new NotFoundException(`Booking not found with ID: ${id}`);
    return booking;
  }

  //# Update booking
  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const existingBooking = await this.findOne(id);

    if (existingBooking.status === 'ARRIVED' || existingBooking.status === 'CANCELLED') {
      throw new BadRequestException('Cannot edit an arrived or cancelled booking.');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        ...updateBookingDto,
      },
    });
  }

  //# Check in booking for customer
  async checkIn(bookingId: string, staffId: string, assignedRoomId?: string) {
    //< 1. Get current booking
    const booking = await this.findOne(bookingId);

    //< 2. Validation
    if (booking.status === BookingStatus.ARRIVED) {
      throw new BadRequestException('Customer has already checked in.');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('This booking has been cancelled.');
    }

    const finalRoomId = assignedRoomId || booking.roomId;
    if (!finalRoomId) {
      throw new BadRequestException('Please specify a room to proceed with check-in.');
    }

    //< 3. EXECUTION via Transaction
    return this.prisma.$transaction(async (tx) => {
      // 3.1. Update booking status to ARRIVED
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.ARRIVED,
          roomId: finalRoomId,
        },
      });

      // 3.2. Update room status to IN_USE
      await tx.room.update({
        where: { id: finalRoomId },
        data: {
          status: 'IN_USE',
        },
      });

      // 3.3. Create UNPAID Invoice
      const newInvoice = await tx.invoice.create({
        data: {
          bookingId: bookingId,
          roomId: finalRoomId,
          staffId: staffId,
          status: 'UNPAID',
          finalTotal: 0,
        },
      });

      return {
        message: 'Checked in and invoice created successfully!',
        booking: updatedBooking,
        invoice: newInvoice,
      };
    });
  }

  //# Cancel booking
  async cancel(id: string) {
    const booking = await this.findOne(id);

    //< 1. Validation
    if (booking.status === BookingStatus.ARRIVED) {
      throw new BadRequestException('Cannot cancel a booking after check-in.');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('This booking has already been cancelled.');
    }

    //< 2. Transaction for canceling and releasing room
    return this.prisma.$transaction(async (tx) => {
      // 2.1 Update booking to CANCELLED
      const cancelledBooking = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.CANCELLED },
      });

      // 2.2 Revert room to AVAILABLE
      if (booking.roomId) {
        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: 'AVAILABLE' },
        });
      }

      return cancelledBooking;
    });
  }
}
