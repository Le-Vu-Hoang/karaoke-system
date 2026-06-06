import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryLogService } from '../../services/inventory-log/inventory-log.service';
import { QueryInventoryLogDto } from '../../dto/inventory-log/query-inventory-log.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../common/guards/role.guard';
import { Roles } from '../../../../common/decorations/role.decorator';

@ApiTags('Inventory Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('ADMIN')
@Controller('inventory/logs')
export class InventoryLogController {
	constructor(private readonly inventoryLogService: InventoryLogService) {}

	@Get()
	@ApiOperation({ summary: 'Lấy danh sách lịch sử biến động kho' })
	@ApiResponse({ status: 200, description: 'Thành công' })
	findAll(@Query() query: QueryInventoryLogDto) {
		return this.inventoryLogService.findAll(query);
	}
}
