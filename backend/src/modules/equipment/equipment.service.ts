import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentQueryDto } from './dto/equipment-query.dto';
import { CreateMaintenanceLogDto } from './dto/create-maintenance-log.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    const { roomId, serialNumber } = createEquipmentDto;

    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room not found with ID: ${roomId}`);
    }

    if (serialNumber) {
      const existingSerial = await this.prisma.equipment.findUnique({
        where: { serialNumber },
      });
      if (existingSerial) {
        throw new ConflictException(`Serial number ${serialNumber} already exists!`);
      }
    }

    return this.prisma.equipment.create({
      data: createEquipmentDto,
    });
  }

  async findAll(query: EquipmentQueryDto) {
    const { search, roomId, status } = query;

    const whereClause: Prisma.EquipmentWhereInput = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (roomId) {
      whereClause.roomId = roomId;
    }
    if (status) {
      whereClause.status = status;
    }

    return this.prisma.equipment.findMany({
      where: whereClause,
      include: {
        room: {
          select: { roomNumber: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
      include: {
        room: true,
        maintenances: {
          orderBy: { maintenanceDate: 'desc' },
        },
      },
    });

    if (!equipment) {
      throw new NotFoundException(`Equipment not found with ID: ${id}`);
    }

    return equipment;
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment not found with ID: ${id}`);
    }

    if (updateEquipmentDto.serialNumber && updateEquipmentDto.serialNumber !== equipment.serialNumber) {
      const existingSerial = await this.prisma.equipment.findUnique({
        where: { serialNumber: updateEquipmentDto.serialNumber },
      });
      if (existingSerial) {
        throw new ConflictException(`Serial number ${updateEquipmentDto.serialNumber} already exists!`);
      }
    }

    if (updateEquipmentDto.roomId && updateEquipmentDto.roomId !== equipment.roomId) {
      const room = await this.prisma.room.findUnique({
        where: { id: updateEquipmentDto.roomId },
      });
      if (!room) {
        throw new NotFoundException(`Room not found with ID: ${updateEquipmentDto.roomId}`);
      }
    }

    return this.prisma.equipment.update({
      where: { id },
      data: updateEquipmentDto,
    });
  }

  async remove(id: string) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment not found with ID: ${id}`);
    }

    return this.prisma.equipment.delete({
      where: { id },
    });
  }

  async createMaintenanceLog(equipmentId: string, createLogDto: CreateMaintenanceLogDto) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id: equipmentId },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment not found with ID: ${equipmentId}`);
    }

    return await this.prisma.maintenanceLog.create({
      data: {
        equipmentId,
        description: createLogDto.description,
        cost: createLogDto.cost,
        maintenanceDate: createLogDto.maintenanceDate ? new Date(createLogDto.maintenanceDate) : new Date(),
      },
    });
  }

  async getMaintenanceLogsByEquipment(equipmentId: string) {
    const equipment = await this.prisma.equipment.findUnique({
      where: { id: equipmentId },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment not found with ID: ${equipmentId}`);
    }

    return this.prisma.maintenanceLog.findMany({
      where: { equipmentId },
      orderBy: { maintenanceDate: 'desc' },
    });
  }
}
