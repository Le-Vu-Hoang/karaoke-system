import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePriceRuleDto } from './dto/create-price-rule.dto';
import { UpdatePriceRuleDto } from './dto/update-price-rule.dto';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PricingService {
  constructor(private readonly prisma: PrismaService) {}

  private parseTimeStringToDate(timeStr: string): Date {
    const [hours, minutes, seconds = '00'] = timeStr.split(':');
    const date = new Date('1970-01-01T00:00:00Z');
    date.setUTCHours(parseInt(hours, 10));
    date.setUTCMinutes(parseInt(minutes, 10));
    date.setUTCSeconds(parseInt(seconds, 10));
    return date;
  }

  async createRule(dto: CreatePriceRuleDto) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: dto.roomTypeId },
    });

    if (!roomType) {
      throw new NotFoundException(`Not found room type with ID: ${dto.roomTypeId}`);
    }

    return await this.prisma.priceRule.create({
      data: {
        roomTypeId: dto.roomTypeId,
        dayOfWeek: dto.dayOfWeek,
        startTime: this.parseTimeStringToDate(dto.startTime),
        endTime: this.parseTimeStringToDate(dto.endTime),
        pricePerHour: dto.pricePerHour,
      },
    });
  }

  async findAllRules(roomTypeId?: string) {
    const where = roomTypeId ? { roomTypeId } : {};
    return await this.prisma.priceRule.findMany({
      where,
      orderBy: [{ roomTypeId: 'asc' }, { dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findRuleById(id: string) {
    const rule = await this.prisma.priceRule.findUnique({
      where: { id },
    });

    if (!rule) {
      throw new NotFoundException(`Không tìm thấy luật giá với ID: ${id}`);
    }
    return rule;
  }

  async updateRule(id: string, dto: UpdatePriceRuleDto) {
    await this.findRuleById(id);
    const data: Prisma.PriceRuleUpdateInput = {};
    if (dto.dayOfWeek !== undefined) data.dayOfWeek = dto.dayOfWeek;
    if (dto.pricePerHour !== undefined) data.pricePerHour = dto.pricePerHour;
    if (dto.startTime !== undefined) data.startTime = this.parseTimeStringToDate(dto.startTime);
    if (dto.endTime !== undefined) data.endTime = this.parseTimeStringToDate(dto.endTime);

    if (dto.roomTypeId) {
      const roomType = await this.prisma.roomType.findUnique({
        where: { id: dto.roomTypeId },
      });
      if (!roomType) {
        throw new NotFoundException(`Not found room type with ID: ${dto.roomTypeId}`);
      }
      data.roomType = { connect: { id: dto.roomTypeId } };
    }

    return await this.prisma.priceRule.update({
      where: { id },
      data,
    });
  }

  async deleteRule(id: string) {
    await this.findRuleById(id);
    await this.prisma.priceRule.delete({
      where: { id },
    });
    return { message: 'Xóa luật giá thành công!' };
  }

  async calculatePrice(dto: CalculatePriceDto) {
    const roomType = await this.prisma.roomType.findUnique({
      where: { id: dto.roomTypeId },
    });

    if (!roomType) {
      throw new NotFoundException(`Not found room type with ID: ${dto.roomTypeId}`);
    }

    const rules = await this.prisma.priceRule.findMany({
      where: { roomTypeId: dto.roomTypeId },
    });

    const basePrice = roomType.basePricePerHour.toNumber();
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (startTime >= endTime) {
      throw new ConflictException('Start time must be before end time');
    }

    let totalAmount = 0;
    let currentStart = new Date(startTime.getTime());

    while (currentStart < endTime) {
      const endOfDay = new Date(currentStart);
      endOfDay.setHours(23, 59, 59, 999);

      const currentEnd = endOfDay < endTime ? endOfDay : endTime;

      const chunkMins = Math.round((currentEnd.getTime() - currentStart.getTime()) / 60000);

      const currentDayOfWeek = currentStart.getDay();
      const startMins = currentStart.getHours() * 60 + currentStart.getMinutes();
      const endMins = startMins + chunkMins;

      let ruleAmount = 0;
      let accountedMins = 0;

      for (const rule of rules) {
        if (rule.dayOfWeek === currentDayOfWeek) {
          const ruleStartMins = rule.startTime.getUTCHours() * 60 + rule.startTime.getUTCMinutes();
          const ruleEndMins = rule.endTime.getUTCHours() * 60 + rule.endTime.getUTCMinutes();

          const overlapStart = Math.max(startMins, ruleStartMins);
          const overlapEnd = Math.min(endMins, ruleEndMins);

          if (overlapStart < overlapEnd) {
            const overlapMins = overlapEnd - overlapStart;

            ruleAmount += (overlapMins * rule.pricePerHour.toNumber()) / 60;
            accountedMins += overlapMins;
          }
        }
      }

      const remainingMins = chunkMins - accountedMins;
      const baseAmount = (remainingMins * basePrice) / 60;

      totalAmount += ruleAmount + baseAmount;

      currentStart = new Date(endOfDay.getTime() + 1);
    }

    return {
      roomTypeId: dto.roomTypeId,
      totalPrice: Math.round(totalAmount),
    };
  }
}
