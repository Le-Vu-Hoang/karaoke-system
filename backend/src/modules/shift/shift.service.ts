import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { CloseShiftDto } from './dto/close-shift.dto';
import { ShiftQueryDto } from './dto/shift-query.dto';
import { ShiftStatus, Prisma } from '@prisma/client';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async openShift(staffId: string, dto: CreateShiftDto) {
    const existingShift = await this.prisma.shift.findFirst({
      where: { staffId, status: ShiftStatus.OPEN },
    });
    if (existingShift) {
      throw new BadRequestException('You currently have an open shift. Please close it before opening a new one.');
    }

    return this.prisma.shift.create({
      data: {
        staffId,
        startingCash: dto.startingCash,
        status: ShiftStatus.OPEN,
      },
      include: { staff: { select: { id: true, fullName: true } } },
    });
  }

  async closeShift(id: string, staffId: string, dto: CloseShiftDto) {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!shift) throw new NotFoundException('Shift not found.');
    if (shift.status === ShiftStatus.CLOSED) {
      throw new BadRequestException('This shift is already closed.');
    }

    const endTime = new Date();

    const invoices = await this.prisma.invoice.findMany({
      where: {
        staffId: shift.staffId,
        status: 'PAID',
        endTime: {
          gte: shift.startTime,
          lte: endTime,
        },
      },
    });

    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.finalTotal), 0);
    const expectedCash = Number(shift.startingCash) + totalRevenue;

    return this.prisma.shift.update({
      where: { id },
      data: {
        endTime,
        status: ShiftStatus.CLOSED,
        endingCash: dto.endingCash,
        expectedCash,
      },
      include: { staff: { select: { id: true, fullName: true } } },
    });
  }

  async findAll(query: ShiftQueryDto, userRole: string, currentStaffId: string) {
    const { status, staffId, fromDate, toDate } = query;
    const whereClause: Prisma.ShiftWhereInput = {};

    if (status) whereClause.status = status;

    if (userRole === 'STAFF') {
      whereClause.staffId = currentStaffId;
    } else if (staffId) {
      whereClause.staffId = staffId;
    }

    if (fromDate || toDate) {
      whereClause.startTime = {};
      if (fromDate) whereClause.startTime.gte = new Date(fromDate);
      if (toDate) whereClause.startTime.lte = new Date(toDate);
    }

    return this.prisma.shift.findMany({
      where: whereClause,
      include: { staff: { select: { id: true, fullName: true } } },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: string, userRole: string, currentStaffId: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
      include: { staff: { select: { id: true, fullName: true } } },
    });

    if (!shift) throw new NotFoundException('Shift not found.');

    if (userRole === 'STAFF' && shift.staffId !== currentStaffId) {
      throw new BadRequestException("You do not have permission to view another staff's shift.");
    }

    return shift;
  }
}
