import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Prisma, RoomStatus } from '@prisma/client';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomType, Room } from '@prisma/client';

@Injectable()
export class RoomService {
	constructor(private readonly prisma: PrismaService) {}

	async createNewType(body: CreateRoomTypeDto) {
		return await this.prisma.roomType.create({
			data: body,
		});
	}

	async getAllRoomTypes(query: PaginationQueryDto): Promise<PaginatedResponseDto<RoomType>> {
		const page = query.page ? Number(query.page) : 1;
		const limit = query.limit ? Number(query.limit) : 12;
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			this.prisma.roomType.findMany({
				skip,
				take: limit,
				orderBy: { name: 'desc' },
				select: {
					id: true,
					name: true,
					capacity: true,
					description: true,
					basePricePerHour: true,
				},
			}),
			this.prisma.roomType.count(),
		]);

		const safeLimit = Math.max(limit, 1);
		const lastPage = Math.ceil(total / safeLimit);
		return {
			data: data,
			meta: {
				total,
				page,
				limit,
				lastPage,
				hasNextPage: page < lastPage,
				hasPreviousPage: page > 1,
			},
		};
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
					throw new ConflictException(
						'Cannot delete/create because the data is currently in use or referenced!',
					);
				}
			}

			throw error;
		}
	}

	async getAllRooms(query: PaginationQueryDto): Promise<PaginatedResponseDto<Room>> {
		const page = query.page ? Number(query.page) : 1;
		const limit = query.limit ? Number(query.limit) : undefined;

		const skip = limit ? (page - 1) * limit : undefined;
		const take = limit ? limit : undefined;

		const [data, total] = await Promise.all([
			this.prisma.room.findMany({
				skip,
				take,
				where: {
					isDeleted: false,
				},
				orderBy: { roomNumber: 'asc' },
				include: {
					roomType: true,
				},
			}),
			this.prisma.room.count({
				where: {
					isDeleted: false,
				},
			}),
		]);

		const effectiveLimit = limit || total || 1;
		const lastPage = Math.ceil(total / effectiveLimit);

		return {
			data: data,
			meta: {
				total,
				page,
				limit: limit || total,
				lastPage,
				hasNextPage: page < lastPage,
				hasPreviousPage: page > 1,
			},
		};
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
					throw new ConflictException(
						`Room number "${dto.roomNumber}" already exists. Please choose another one!`,
					);
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
