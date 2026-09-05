import { RoomGateway } from './gateways/room.gateway';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Prisma, RoomStatus, RoomType } from '@prisma/client';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomGateway: RoomGateway,
  ) {}

  async createNewType(body: CreateRoomTypeDto) {
    return await this.prisma.roomType.create({
      data: body,
    });
  }

  async getAllRoomTypes(): Promise<RoomType[]> {
    return await this.prisma.roomType.findMany({
      orderBy: { name: 'desc' },
      select: {
        id: true,
        name: true,
        capacity: true,
        description: true,
        imageUrl: true,
        basePricePerHour: true,
        tags: true,
      },
    });
  }

  async updateRoomTypeInfo(body: UpdateRoomTypeDto, id: string) {
    const existingRoomType = await this.prisma.roomType.findUnique({
      where: { id },
    });

    if (!existingRoomType) {
      throw new NotFoundException(`Room type not found with ID: ${id}`);
    }

    if (body.name && body.name !== existingRoomType.name) {
      const nameExists = await this.prisma.roomType.findFirst({
        where: { name: body.name },
      });
      if (nameExists) {
        throw new ConflictException('Room type name already exists in the system!');
      }
    }

    return await this.prisma.roomType.update({
      where: { id },
      data: {
        ...body,
      },
    });
  }

  async getRoomTypeAvailability(id: string, dateStr: string) {
    // 1. Get total active physical rooms for this type
    const totalRooms = await this.prisma.room.count({
      where: {
        roomTypeId: id,
        isDeleted: false,
        status: { not: 'MAINTENANCE' },
      },
    });

    if (totalRooms === 0) {
      return { bookedSlots: [{ start: 0, end: 36 }] };
    }

    // 2. Parse base date (00:00 of the requested date)
    const baseDate = new Date(dateStr);
    baseDate.setHours(0, 0, 0, 0);

    // KTV day starts at 09:00 AM today and ends at 03:00 AM next day.
    const queryStartTime = new Date(baseDate.getTime() + 9 * 60 * 60 * 1000); // 09:00 AM
    const queryEndTime = new Date(baseDate.getTime() + 27 * 60 * 60 * 1000); // 03:00 AM next day

    // 3. Find active bookings overlapping with this KTV day
    const bookings = await this.prisma.booking.findMany({
      where: {
        roomTypeId: id,
        status: { in: ['PENDING', 'CONFIRMED', 'ARRIVED'] },
        startTime: { lt: queryEndTime },
        endTime: { gt: queryStartTime },
      },
      select: { startTime: true, endTime: true },
    });

    // 4. Calculate blocks (36 blocks of 30 mins)
    const blocks = new Array(36).fill(0);

    const getValFromDate = (d: Date) => {
      const diffMs = d.getTime() - baseDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      const totalHalfHours = Math.floor(diffHours * 2);
      return totalHalfHours - 18; // 18 is 09:00 AM
    };

    bookings.forEach((booking) => {
      let startVal = getValFromDate(new Date(booking.startTime));
      let endVal = getValFromDate(new Date(booking.endTime));

      startVal = Math.max(0, startVal);
      endVal = Math.min(36, endVal);

      for (let i = startVal; i < endVal; i++) {
        blocks[i]++;
      }
    });

    // 5. Group booked slots
    const bookedSlots: { start: number; end: number }[] = [];
    let currentStart: number | null = null;

    for (let i = 0; i < 36; i++) {
      if (blocks[i] >= totalRooms) {
        if (currentStart === null) currentStart = i;
      } else {
        if (currentStart !== null) {
          bookedSlots.push({ start: currentStart, end: i });
          currentStart = null;
        }
      }
    }

    if (currentStart !== null) {
      bookedSlots.push({ start: currentStart, end: 36 });
    }

    return { bookedSlots };
  }

  async addNewRoom(dto: CreateRoomDto) {
    if (dto.roomTypeId) {
      const roomTypeExists = await this.prisma.roomType.findUnique({
        where: { id: dto.roomTypeId },
      });

      if (!roomTypeExists) {
        throw new NotFoundException(`Room type not found with ID: ${dto.roomTypeId}`);
      }
    }

    try {
      return await this.prisma.room.create({
        data: {
          ...dto,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Data already exists in the system!');
        }

        if (error.code === 'P2003') {
          throw new ConflictException('Cannot delete/create because the data is currently in use or referenced!');
        }
      }

      throw error;
    }
  }

  async getAllRooms() {
    return await this.prisma.room.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: { roomNumber: 'asc' },
      include: {
        roomType: true,
        invoices: {
          where: {
            endTime: null,
            status: 'UNPAID',
            isDeleted: false,
          },
          include: {
            invoiceItems: {
              include: {
                service: true,
              },
            },
            booking: {
              include: {
                customer: true,
              },
            },
          },
        },
      },
    });
  }

  async getRoomInfo(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        roomType: true,
      },
    });

    if (!room) {
      throw new NotFoundException(`Room details not found with ID: ${id}`);
    }

    return room;
  }

  async updateRoomInfo(dto: UpdateRoomDto, id: string) {
    const existingRoom = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      throw new NotFoundException(`Room not found with ID: ${id}`);
    }

    if (dto.roomTypeId) {
      const roomTypeExists = await this.prisma.roomType.findUnique({
        where: { id: dto.roomTypeId },
      });

      if (!roomTypeExists) {
        throw new NotFoundException(`Room type not found with ID: ${dto.roomTypeId}`);
      }
    }

    try {
      return await this.prisma.room.update({
        where: { id },
        data: {
          ...dto,
        },
        include: {
          roomType: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(`Room number "${dto.roomNumber}" already exists. Please choose another one!`);
        }
      }
      throw error;
    }
  }

  async updateRoomStatus(id: string, status: RoomStatus) {
    const existingRoom = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      throw new NotFoundException(`Room not found with ID: ${id}`);
    }

    await this.prisma.room.update({
      where: { id },
      data: {
        status: status,
      },
    });

    return { message: 'Room status updated successfully!' };
  }

  async disableRoom(id: string) {
    const existingRoom = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      throw new NotFoundException(`Room not found with ID: ${id}`);
    }

    if (existingRoom.status === 'IN_USE') {
      throw new ConflictException('Cannot disable a room that is currently in use!');
    }

    await this.prisma.room.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    return { message: 'Room disabled successfully!' };
  }
}
