import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { AddServiceDto } from './dto/add-service.dto';
import { CancelInvoiceDto } from './dto/cancel-invoice.dto';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
	constructor(private readonly invoiceService: InvoiceService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Tạo mới một hóa đơn (Check-in)' })
	@ApiResponse({ status: HttpStatus.CREATED, description: 'Hóa đơn được tạo thành công' })
	@ApiAuthErrors()
	createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
		return this.invoiceService.createInvoice(createInvoiceDto);
	}

	@Get()
	@ApiOperation({ summary: 'Lấy danh sách tất cả hóa đơn' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Thành công' })
	@ApiAuthErrors()
	findAll() {
		return this.invoiceService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Lấy chi tiết một hóa đơn' })
	@ApiParam({ name: 'id', description: 'ID hóa đơn' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Thành công' })
	@ApiAuthErrors()
	findById(@Param('id') id: string) {
		return this.invoiceService.findById(id);
	}

	@Post(':id/services')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Thêm dịch vụ vào hóa đơn' })
	@ApiParam({ name: 'id', description: 'ID hóa đơn' })
	@ApiResponse({ status: HttpStatus.CREATED, description: 'Đã thêm dịch vụ thành công' })
	@ApiAuthErrors()
	addService(@Param('id') id: string, @Body() addServiceDto: AddServiceDto) {
		return this.invoiceService.addService(id, addServiceDto);
	}

	@Post(':id/checkout')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Chốt tiền hóa đơn (Checkout)' })
	@ApiParam({ name: 'id', description: 'ID hóa đơn' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Hóa đơn đã chốt thành công' })
	@ApiAuthErrors()
	checkout(@Param('id') id: string) {
		return this.invoiceService.checkout(id);
	}

	@Post(':id/cancel')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Hủy hóa đơn (Xóa mềm)' })
	@ApiParam({ name: 'id', description: 'ID hóa đơn' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Hóa đơn đã được hủy thành công' })
	@ApiAuthErrors()
	cancelInvoice(@Param('id') id: string, @Body() dto: CancelInvoiceDto) {
		return this.invoiceService.cancelInvoice(id, dto.reason);
	}
}
