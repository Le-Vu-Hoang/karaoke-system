import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VouchersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserVouchers(userId: string) {
    return this.prisma.userVoucher.findMany({
      where: { userId },
      include: {
        voucher: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getPublicVouchers() {
    return this.prisma.voucher.findMany({
      where: {
        isActive: true,
        validTo: { gte: new Date() },
      },
      orderBy: {
        pointsCost: 'asc',
      },
    });
  }

  async redeemVoucher(userId: string, voucherCode: string) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { code: voucherCode },
    });

    if (!voucher) {
      throw new NotFoundException('Voucher không tồn tại');
    }

    if (!voucher.isActive || voucher.validTo < new Date()) {
      throw new BadRequestException('Voucher đã hết hạn hoặc bị khóa');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    if (user.loyaltyPoints < voucher.pointsCost) {
      throw new BadRequestException('Không đủ điểm để đổi voucher này');
    }

    const existingUserVoucher = await this.prisma.userVoucher.findFirst({
      where: { userId, voucherId: voucher.id },
    });

    if (existingUserVoucher) {
      throw new BadRequestException('Bạn đã sở hữu voucher này rồi');
    }

    // Transaction to deduct points and add voucher
    return this.prisma.$transaction(async (tx) => {
      if (voucher.pointsCost > 0) {
        await tx.user.update({
          where: { id: userId },
          data: { loyaltyPoints: { decrement: voucher.pointsCost } },
        });
      }

      return await tx.userVoucher.create({
        data: {
          userId,
          voucherId: voucher.id,
        },
        include: {
          voucher: true,
        },
      });
    });
  }
}
