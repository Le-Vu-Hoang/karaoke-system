import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { RoomTypeResponseDto } from './dto/room-type-response.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { Prisma, RoomStatus } from '@prisma/client';
import { RoomResponseDto } from './dto/room-response.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
	constructor(private readonly prisma: PrismaService) {}

	async createNewType(body: CreateRoomTypeDto): Promise<RoomTypeResponseDto> {
		const newRoomType = await this.prisma.roomType.create({
			data: body,
		});

		return {
			...newRoomType,
			basePricePerHour: newRoomType.basePricePerHour.toNumber(),
		};
	}

	async getAllRoomTypes(
		query: PaginationQueryDto,
	): Promise<PaginatedResponseDto<RoomTypeResponseDto>> {
		const page = query.page ?? 1;
		const limit = query.limit ?? 12;
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

		const lastPage = Math.ceil(total / page);
		return {
			data: data.map((room) => ({
				...room,
				basePricePerHour: room.basePricePerHour.toNumber(),
			})),
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

	async updateRoomTypeInfo(body: UpdateRoomTypeDto, id: string): Promise<RoomTypeResponseDto> {
		const existingRoomType = await this.prisma.roomType.findUnique({
			where: { id },
		});

		if (!existingRoomType) {
			throw new NotFoundException(`Không tìm thấy loại phòng với ID: ${id}`);
		}

		if (body.name && body.name !== existingRoomType.name) {
			const nameExists = await this.prisma.roomType.findFirst({
				where: { name: body.name },
			});
			if (nameExists) {
				throw new ConflictException('Tên loại phòng này đã tồn tại trong hệ thống!');
			}
		}

		const updatedRoomType = await this.prisma.roomType.update({
			where: { id },
			data: {
				...body,
			},
		});

		return {
			...updatedRoomType,
			basePricePerHour: updatedRoomType.basePricePerHour.toNumber(),
		};
	}

	async addNewRoom(dto: CreateRoomDto): Promise<RoomResponseDto> {
		if (dto.roomTypeId) {
			const roomTypeExists = await this.prisma.roomType.findUnique({
				where: { id: dto.roomTypeId },
			});

			if (!roomTypeExists) {
				throw new NotFoundException(`Không tìm thấy loại phòng với ID: ${dto.roomTypeId}`);
			}
		}

		try {
			return this.prisma.room.create({
				data: {
					...dto,
				},
			});
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException('Dữ liệu đã tồn tại trong hệ thống!');
				}

				if (error.code === 'P2003') {
					throw new ConflictException('Không thể xóa vì dữ liệu đang được sử dụng!');
				}
			}

			throw error;
		}
	}

	async getAllRooms(query: PaginationQueryDto): Promise<PaginatedResponseDto<RoomResponseDto>> {
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

		const mappedData = data.map((room) => {
			return {
				...room,
				roomType: room.roomType
					? {
							...room.roomType,
							basePricePerHour: room.roomType.basePricePerHour.toNumber(),
						}
					: undefined,
			};
		});

		return {
			data: mappedData,
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

	async getRoomInfo(id: string): Promise<RoomResponseDto> {
		const room = await this.prisma.room.findUnique({
			where: { id },
			include: {
				roomType: true,
			},
		});

		if (!room) {
			throw new NotFoundException(`Không tìm thấy chi tiết phòng với ID: ${id}`);
		}

		return {
			...room,
			roomType: room.roomType
				? {
						...room.roomType,
						basePricePerHour: room.roomType.basePricePerHour.toNumber(),
					}
				: undefined,
		};
	}

	async updateRoomInfo(dto: UpdateRoomDto, id: string): Promise<RoomResponseDto> {
		const existingRoom = await this.prisma.room.findUnique({
			where: { id },
		});

		if (!existingRoom) {
			throw new NotFoundException(`Không tìm thấy phòng hát với ID: ${id}`);
		}

		if (dto.roomTypeId) {
			const roomTypeExists = await this.prisma.roomType.findUnique({
				where: { id: dto.roomTypeId },
			});

			if (!roomTypeExists) {
				throw new NotFoundException(`Không tìm thấy loại phòng với ID: ${dto.roomTypeId}`);
			}
		}

		try {
			const updatedRoom = await this.prisma.room.update({
				where: { id },
				data: {
					...dto,
				},
				include: {
					roomType: true,
				},
			});

			return {
				...updatedRoom,
				roomType: updatedRoom.roomType
					? {
							...updatedRoom.roomType,
							basePricePerHour: updatedRoom.roomType.basePricePerHour.toNumber(),
						}
					: undefined,
			};
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ConflictException(
						`Tên hoặc số phòng "${dto.roomNumber}" đã tồn tại. Vui lòng chọn tên khác!`,
					);
				}
			}
			throw error;
		}
	}

	async updateRoomStatus(id: string, status: RoomStatus): Promise<string> {
		const existingRoom = await this.prisma.room.findUnique({
			where: { id },
		});

		if (!existingRoom) {
			throw new NotFoundException(`Không tìm thấy phòng hát với ID: ${id}`);
		}

		await this.prisma.room.update({
			where: { id },
			data: {
				status: status,
			},
		});

		return 'Cập nhật trạng thái phòng thành công!';
	}

	async disableRoom(id: string): Promise<string> {
		const existingRoom = await this.prisma.room.findUnique({
			where: { id },
		});

		if (!existingRoom) {
			throw new NotFoundException(`Không tìm thấy phòng hát với ID: ${id}`);
		}

		if (existingRoom.status === 'IN_USE') {
			throw new ConflictException('Không thể vô hiệu hóa phòng đang có khách hát!');
		}

		await this.prisma.room.update({
			where: { id },
			data: {
				isDeleted: true,
			},
		});

		return 'Vô hiệu hóa phòng hát thành công!';
	}
}
