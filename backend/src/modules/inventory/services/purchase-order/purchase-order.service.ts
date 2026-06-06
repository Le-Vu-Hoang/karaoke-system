import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CreatePurchaseOrderDto } from '../../dto/purchase-order/create-purchase-order.dto';

@Injectable()
export class PurchaseOrderService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createPurchaseOrderDto: CreatePurchaseOrderDto, staffId: string) {
		const { supplierId, items } = createPurchaseOrderDto;

		// Kiểm tra nhà cung cấp
		const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
		if (!supplier) {
			throw new NotFoundException('Không tìm thấy nhà cung cấp');
		}

		// Tính tổng tiền
		const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

		// Dùng Transaction để đảm bảo tính toàn vẹn dữ liệu
		return this.prisma.$transaction(async (tx) => {
			// 1. Tạo đơn nhập hàng
			const purchaseOrder = await tx.purchaseOrder.create({
				data: {
					supplierId,
					staffId,
					totalAmount,
					items: {
						create: items.map(item => ({
							serviceId: item.serviceId,
							quantity: item.quantity,
							unitPrice: item.unitPrice,
						})),
					},
				},
				include: {
					items: true,
				},
			});

			// 2. Cập nhật tồn kho và ghi log cho từng mặt hàng
			for (const item of items) {
				// Cập nhật stockQuantity
				await tx.service.update({
					where: { id: item.serviceId },
					data: {
						stockQuantity: {
							increment: item.quantity,
						},
					},
				});

				// Ghi log vào InventoryLog
				await tx.inventoryLog.create({
					data: {
						serviceId: item.serviceId,
						changeType: 'IMPORT',
						quantityChanged: item.quantity,
						referenceId: purchaseOrder.id,
					},
				});
			}

			return purchaseOrder;
		});
	}

	async findAll() {
		return this.prisma.purchaseOrder.findMany({
			include: {
				supplier: true,
				staff: {
					select: { id: true, fullName: true },
				},
				items: {
					include: { service: true },
				},
			},
			orderBy: { orderDate: 'desc' },
		});
	}

	async findOne(id: string) {
		const po = await this.prisma.purchaseOrder.findUnique({
			where: { id },
			include: {
				supplier: true,
				staff: {
					select: { id: true, fullName: true },
				},
				items: {
					include: { service: true },
				},
			},
		});
		if (!po) {
			throw new NotFoundException('Không tìm thấy đơn nhập hàng');
		}
		return po;
	}
}
