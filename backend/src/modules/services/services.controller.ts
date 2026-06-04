import {
	ApiTags,
	ApiOperation,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiBadRequestResponse,
	ApiOkResponse,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Role } from '@prisma/client';

import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { Roles } from '../../common/decorations/role.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';

@ApiTags('Services (Dịch vụ & Món ăn)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('services')
export class ServicesController {
	constructor(private readonly servicesService: ServicesService) {}

	//# Create new service on system
	@Post()
	@Roles(Role.ADMIN, Role.STAFF)
	@ApiOperation({ summary: 'Thêm mới dịch vụ/món ăn' })
	@ApiCreatedResponse({ description: 'Tạo dịch vụ/món ăn thành công', type: ServiceResponseDto })
	@ApiAuthErrors()
	@ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ (Validation Error)' })
	@Serialize(ServiceResponseDto)
	create(@Body() createServiceDto: CreateServiceDto) {
		return this.servicesService.createService(createServiceDto);
	}

	//# Get all services (menu)
	@Get()
	@Roles(Role.ADMIN, Role.STAFF, Role.CUSTOMER)
	@ApiOperation({ summary: 'Lấy danh sách dịch vụ (Menu)' })
	@ApiOkResponse({ description: 'Lấy danh sách thành công' })
	@ApiAuthErrors()
	@ApiBadRequestResponse({ description: 'Số trang không hợp lệ' })
	@Serialize(ServiceResponseDto)
	findAll(@Query() query: PaginationQueryDto) {
		return this.servicesService.getAllServices(query);
	}

	//# Update service info
	@Patch(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Cập nhật thông tin dịch vụ' })
	@ApiOkResponse({ description: 'Cập nhật thành công', type: ServiceResponseDto })
	@ApiAuthErrors()
	@ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ hoặc ID sai định dạng' })
	@Serialize(ServiceResponseDto)
	update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
		return this.servicesService.updateService(id, updateServiceDto);
	}

	//# Delete service (Soft delete - Vô hiệu hóa)
	@Delete(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Vô hiệu hóa (Xóa mềm) dịch vụ' })
	@ApiOkResponse({
		description: 'Vô hiệu hóa thành công',
		schema: { example: { message: 'Vô hiệu hóa dịch vụ thành công!' } },
	})
	@ApiAuthErrors()
	@ApiBadRequestResponse({ description: 'ID sai định dạng' })
	remove(@Param('id') id: string) {
		return this.servicesService.deleteService(id);
	}
}
