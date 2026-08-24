import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { QueryInventoryLogDto } from '../../dto/inventory-log/query-inventory-log.dto';

@Injectable()
export class InventoryLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryInventoryLogDto) {
    const { serviceId, changeType } = query;

    const where: any = {};
    if (serviceId) where.serviceId = serviceId;
    if (changeType) where.changeType = changeType;

    return this.prisma.inventoryLog.findMany({
      where,
      include: {
        service: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
