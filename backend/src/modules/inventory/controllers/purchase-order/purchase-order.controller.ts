import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PurchaseOrderService } from '../../services/purchase-order/purchase-order.service';
import { CreatePurchaseOrderDto } from '../../dto/purchase-order/create-purchase-order.dto';
import { RoleGuard } from '../../../../common/guards/role.guard';
import { Roles } from '../../../../common/decorations/role.decorator';
import { GetUser } from '../../../../common/decorations/get-user.decorator';

@ApiTags('Purchase Orders')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@Roles('ADMIN')
@Controller('inventory/purchase-orders')
export class PurchaseOrderController {
	constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

	@Post()
	@ApiOperation({ summary: 'Tạo đơn nhập hàng mới' })
	@ApiResponse({ status: 201, description: 'Tạo thành công' })
	create(@Body() createPurchaseOrderDto: CreatePurchaseOrderDto, @GetUser() user: any) {
		return this.purchaseOrderService.create(createPurchaseOrderDto, user.id || user.sub);
	}

	@Get()
	@ApiOperation({ summary: 'Lấy danh sách đơn nhập hàng' })
	@ApiResponse({ status: 200, description: 'Thành công' })
	findAll() {
		return this.purchaseOrderService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Lấy thông tin đơn nhập hàng theo ID' })
	@ApiResponse({ status: 200, description: 'Thành công' })
	findOne(@Param('id') id: string) {
		return this.purchaseOrderService.findOne(id);
	}
}
