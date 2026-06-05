import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
	ParseUUIDPipe,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentQueryDto } from './dto/equipment-query.dto';
import { CreateMaintenanceLogDto } from './dto/create-maintenance-log.dto';
import {
	ApiTags,
	ApiOperation,
	ApiBearerAuth,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Equipments')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized access' })
@ApiBadRequestResponse({ description: 'Bad request' })
@Controller('equipments')
export class EquipmentController {
	constructor(private readonly equipmentService: EquipmentService) {}

	@ApiOperation({ summary: 'Thêm thiết bị mới' })
	@Post()
	create(@Body() createEquipmentDto: CreateEquipmentDto) {
		return this.equipmentService.create(createEquipmentDto);
	}

	@ApiOperation({ summary: 'Lấy danh sách thiết bị' })
	@Get()
	findAll(@Query() query: EquipmentQueryDto) {
		return this.equipmentService.findAll(query);
	}

	@ApiOperation({ summary: 'Lấy thông tin một thiết bị' })
	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.equipmentService.findOne(id);
	}

	@ApiOperation({ summary: 'Cập nhật thiết bị' })
	@Patch(':id')
	update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEquipmentDto: UpdateEquipmentDto) {
		return this.equipmentService.update(id, updateEquipmentDto);
	}

	@ApiOperation({ summary: 'Xóa thiết bị' })
	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.equipmentService.remove(id);
	}

	@ApiOperation({ summary: 'Thêm log bảo trì thiết bị' })
	@Post(':id/maintenances')
	createMaintenanceLog(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() createMaintenanceLogDto: CreateMaintenanceLogDto,
	) {
		return this.equipmentService.createMaintenanceLog(id, createMaintenanceLogDto);
	}

	@ApiOperation({ summary: 'Lấy danh sách log bảo trì của thiết bị' })
	@Get(':id/maintenances')
	getMaintenanceLogs(@Param('id', ParseUUIDPipe) id: string) {
		return this.equipmentService.getMaintenanceLogsByEquipment(id);
	}
}
