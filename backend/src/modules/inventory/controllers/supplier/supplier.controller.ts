import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SupplierService } from '../../services/supplier/supplier.service';
import { CreateSupplierDto } from '../../dto/supplier/create-supplier.dto';
import { UpdateSupplierDto } from '../../dto/supplier/update-supplier.dto';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../../../common/guards/role.guard';
import { Roles } from '../../../../common/decorations/role.decorator';

@ApiTags('Suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles('ADMIN')
@Controller('inventory/suppliers')
export class SupplierController {
	constructor(private readonly supplierService: SupplierService) {}

	@Post()
	@ApiOperation({ summary: 'Tạo mới nhà cung cấp' })
	@ApiResponse({ status: 201, description: 'Tạo thành công' })
	create(@Body() createSupplierDto: CreateSupplierDto) {
		return this.supplierService.create(createSupplierDto);
	}

	@Get()
	@ApiOperation({ summary: 'Lấy danh sách nhà cung cấp' })
	@ApiResponse({ status: 200, description: 'Thành công' })
	findAll() {
		return this.supplierService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Lấy thông tin nhà cung cấp theo ID' })
	@ApiResponse({ status: 200, description: 'Thành công' })
	findOne(@Param('id') id: string) {
		return this.supplierService.findOne(id);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Cập nhật nhà cung cấp' })
	@ApiResponse({ status: 200, description: 'Cập nhật thành công' })
	update(@Param('id') id: string, @Body() updateSupplierDto: UpdateSupplierDto) {
		return this.supplierService.update(id, updateSupplierDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Xóa nhà cung cấp' })
	@ApiResponse({ status: 200, description: 'Xóa thành công' })
	remove(@Param('id') id: string) {
		return this.supplierService.remove(id);
	}
}
