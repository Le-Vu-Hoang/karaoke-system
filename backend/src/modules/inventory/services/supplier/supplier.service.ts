import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreateSupplierDto } from '../../dto/supplier/create-supplier.dto';
import { UpdateSupplierDto } from '../../dto/supplier/update-supplier.dto';

@Injectable()
export class SupplierService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createSupplierDto: CreateSupplierDto) {
		const existing = await this.prisma.supplier.findFirst({
			where: { phoneNumber: createSupplierDto.phoneNumber },
		});
		if (existing) {
			throw new ConflictException('Nhà cung cấp với số điện thoại này đã tồn tại');
		}

		return this.prisma.supplier.create({
			data: createSupplierDto,
		});
	}

	async findAll() {
		return this.prisma.supplier.findMany({
			orderBy: { name: 'asc' },
		});
	}

	async findOne(id: string) {
		const supplier = await this.prisma.supplier.findUnique({
			where: { id },
		});
		if (!supplier) {
			throw new NotFoundException('Không tìm thấy nhà cung cấp');
		}
		return supplier;
	}

	async update(id: string, updateSupplierDto: UpdateSupplierDto) {
		await this.findOne(id); // Ensure exists

		if (updateSupplierDto.phoneNumber) {
			const existing = await this.prisma.supplier.findFirst({
				where: { phoneNumber: updateSupplierDto.phoneNumber },
			});
			if (existing && existing.id !== id) {
				throw new ConflictException('Nhà cung cấp với số điện thoại này đã tồn tại');
			}
		}

		return this.prisma.supplier.update({
			where: { id },
			data: updateSupplierDto,
		});
	}

	async remove(id: string) {
		await this.findOne(id);
		return this.prisma.supplier.delete({
			where: { id },
		});
	}
}
