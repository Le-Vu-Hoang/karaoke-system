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
import { Public } from '../../common/decorations/puclic.decorator';
import { ServiceResponseDto } from './dto/service-response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';

@ApiTags('Services (Dịch vụ & Món ăn)')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('services')
export class ServicesController {
	constructor(private readonly servicesService: ServicesService) {}

	@Post()
	@Roles(Role.ADMIN, Role.STAFF)
	@ApiOperation({ summary: 'Thêm mới dịch vụ/món ăn' })
	@ApiCreatedResponse({ description: 'Tạo dịch vụ/món ăn thành công', type: ServiceResponseDto })
	@ApiAuthErrors()
	@ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ (Validation Error)' })
	async create(@Body() createServiceDto: CreateServiceDto): Promise<ServiceResponseDto> {
		return await this.servicesService.createService(createServiceDto);
	}

	@Get()
	@Roles(Role.ADMIN, Role.STAFF, Role.CUSTOMER)
	@ApiOperation({ summary: 'Lấy danh sách dịch vụ (Menu)' })
	@ApiOkResponse({ description: 'Lấy danh sách thành công' })
	@ApiAuthErrors()
	@ApiBadRequestResponse({ description: 'Số trang không hợp lệ' })
	async findAll(
		@Query() query: PaginationQueryDto,
	): Promise<PaginatedResponseDto<ServiceResponseDto>> {
		return await this.servicesService.getAllServices(query);
	}

	@Patch(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Cập nhật thông tin dịch vụ' })
	@ApiOkResponse({ description: 'Cập nhật thành công', type: ServiceResponseDto })
	@ApiAuthErrors()
	@ApiBadRequestResponse({ description: 'Dữ liệu gửi lên không hợp lệ hoặc ID sai định dạng' })
	async update(
		@Param('id') id: string,
		@Body() updateServiceDto: UpdateServiceDto,
	): Promise<ServiceResponseDto> {
		return await this.servicesService.updateService(id, updateServiceDto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Vô hiệu hóa (Xóa mềm) dịch vụ' })
	@ApiOkResponse({
		description: 'Vô hiệu hóa thành công',
		schema: { example: { message: 'Vô hiệu hóa dịch vụ thành công!' } },
	})
	@ApiAuthErrors()
	@ApiBadRequestResponse({ description: 'ID sai định dạng' })
	async remove(@Param('id') id: string): Promise<{ message: string }> {
		const message = await this.servicesService.deleteService(id);
		return { message };
	}
}
