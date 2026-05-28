import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
	constructor(private readonly prisma: PrismaService) {}

	async createService(dto: CreateServiceDto) {
		const categoryExists = await this.prisma.serviceCategory.findUnique({
			where: { id: dto.categoryId },
		});

		if (!categoryExists) {
			throw new NotFoundException('Danh mục không tồn tại!');
		}
		const newService = await this.prisma.service.create({
			data: dto,
			include: { category: true },
		});

		return {
			...newService,
			price: newService.price.toNumber(),
		};
	}

	async getAllServices(query: PaginationQueryDto) {
		const page = query.page ? Number(query.page) : 1;
		const limit = query.limit ? Number(query.limit) : undefined;
		const skip = limit ? (page - 1) * limit : undefined;

		const [data, total] = await Promise.all([
			this.prisma.service.findMany({
				skip,
				take: limit,
				where: { isActive: true },
				orderBy: { name: 'asc' },
				include: { category: true },
			}),
			this.prisma.service.count({ where: { isActive: true } }),
		]);

		const effectiveLimit = limit || total || 1;
		const lastPage = Math.ceil(total / effectiveLimit);

		const mappedData = data.map((service) => ({
			...service,
			price: service.price.toNumber(),
		}));

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

	async updateService(id: string, dto: UpdateServiceDto) {
		await this.checkServiceExist(id);

		if (dto.categoryId) {
			const categoryExists = await this.prisma.serviceCategory.findUnique({
				where: { id: dto.categoryId },
			});
			if (!categoryExists) throw new NotFoundException('Danh mục không tồn tại!');
		}

		const updatedService = await this.prisma.service.update({
			where: { id },
			data: dto,
			include: { category: true },
		});

		return {
			...updatedService,
			price: updatedService.price.toNumber(),
		};
	}

	async deleteService(id: string): Promise<string> {
		await this.checkServiceExist(id);

		// Dùng Soft Delete thay vì xóa vật lý để bảo toàn InventoryLog và InvoiceItem
		await this.prisma.service.update({
			where: { id },
			data: { isActive: false },
		});

		return 'Vô hiệu hóa dịch vụ thành công!';
	}

	// --- Hàm Helper ---
	private async checkServiceExist(id: string) {
		const service = await this.prisma.service.findUnique({
			where: { id },
		});
		if (!service || !service.isActive) {
			throw new NotFoundException(`Không tìm thấy dịch vụ với ID: ${id}`);
		}
		return service;
	}
}
