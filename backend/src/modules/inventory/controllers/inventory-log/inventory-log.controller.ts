import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryLogService } from '../../services/inventory-log/inventory-log.service';
import { QueryInventoryLogDto } from '../../dto/inventory-log/query-inventory-log.dto';
import { RoleGuard } from '../../../../common/guards/role.guard';
import { AuthRoles } from '../../../../common/decorations/auth-roles.decorator';

@ApiTags('Inventory Logs')
@ApiBearerAuth()
@UseGuards(RoleGuard)
@AuthRoles('ADMIN')
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
