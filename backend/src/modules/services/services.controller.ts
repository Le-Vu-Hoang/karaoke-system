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
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategoryResponseDto } from './dto/service-category-response.dto';
import { Role } from '@prisma/client';

import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../../common/guards/role.guard';
import { AuthRoles } from '../../common/decorations/auth-roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { Public } from '../../common/decorations/puclic.decorator';

@ApiTags('Services (Dịch vụ & Món ăn)')
@ApiBearerAuth('JWT-auth')
@UseGuards(RoleGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  //# --- CATEGORIES ---
  @Post('categories')
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Thêm mới danh mục dịch vụ' })
  @ApiCreatedResponse({ description: 'Tạo danh mục thành công', type: ServiceCategoryResponseDto })
  @ApiAuthErrors()
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @Serialize(ServiceCategoryResponseDto)
  createCategory(@Body() dto: CreateServiceCategoryDto) {
    return this.servicesService.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  @ApiOkResponse({ type: [ServiceCategoryResponseDto] })
  @ApiAuthErrors()
  @Public()
  @Serialize(ServiceCategoryResponseDto)
  getAllCategories() {
    return this.servicesService.getAllCategories();
  }

  @Patch('categories/:id')
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @ApiOkResponse({ type: ServiceCategoryResponseDto })
  @ApiAuthErrors()
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @Serialize(ServiceCategoryResponseDto)
  updateCategory(@Param('id') id: string, @Body() dto: UpdateServiceCategoryDto) {
    return this.servicesService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Vô hiệu hóa danh mục' })
  @ApiOkResponse({
    schema: { example: { message: 'Category disabled successfully!' } },
  })
  @ApiAuthErrors()
  deleteCategory(@Param('id') id: string) {
    return this.servicesService.deleteCategory(id);
  }

  //# --- SERVICES ---
  @Post()
  @AuthRoles(Role.ADMIN, Role.STAFF)
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
  @ApiOperation({ summary: 'Lấy danh sách dịch vụ (Menu)' })
  @ApiOkResponse({
    description: 'Lấy danh sách thành công',
    type: PaginatedResponseDto<ServiceResponseDto>,
  })
  @ApiBadRequestResponse({ description: 'Số trang không hợp lệ' })
  @Public()
  @Serialize(ServiceResponseDto)
  findAll(@Query() query: PaginationQueryDto) {
    return this.servicesService.getAllServices(query);
  }

  //# Update service info
  @Patch(':id')
  @AuthRoles(Role.ADMIN)
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
  @AuthRoles(Role.ADMIN)
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
