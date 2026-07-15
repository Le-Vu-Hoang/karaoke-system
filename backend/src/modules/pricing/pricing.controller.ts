import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { CreatePriceRuleDto } from './dto/create-price-rule.dto';
import { UpdatePriceRuleDto } from './dto/update-price-rule.dto';
import { CalculatePriceDto } from './dto/calculate-price.dto';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';

@ApiTags('Pricing')
@Controller('pricing')
export class PricingController {
	constructor(private readonly pricingService: PricingService) {}

	@Post('rules')
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({ summary: 'Tạo mới một luật giá (Price Rule)' })
	@ApiResponse({ status: HttpStatus.CREATED, description: 'Luật giá được tạo thành công' })
	@ApiAuthErrors()
	createRule(@Body() createPriceRuleDto: CreatePriceRuleDto) {
		return this.pricingService.createRule(createPriceRuleDto);
	}

	@Get('rules')
	@ApiOperation({ summary: 'Lấy danh sách các luật giá' })
	@ApiQuery({ name: 'roomTypeId', required: false, description: 'Lọc theo ID loại phòng' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Lấy danh sách thành công' })
	@ApiAuthErrors()
	findAllRules(@Query('roomTypeId') roomTypeId?: string) {
		return this.pricingService.findAllRules(roomTypeId);
	}

	@Get('rules/:id')
	@ApiOperation({ summary: 'Lấy chi tiết một luật giá bằng ID' })
	@ApiParam({ name: 'id', description: 'ID của luật giá' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Thành công' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy luật giá' })
	@ApiAuthErrors()
	findRuleById(@Param('id') id: string) {
		return this.pricingService.findRuleById(id);
	}

	@Patch('rules/:id')
	@ApiOperation({ summary: 'Cập nhật một luật giá' })
	@ApiParam({ name: 'id', description: 'ID của luật giá' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Cập nhật thành công' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy luật giá' })
	@ApiAuthErrors()
	updateRule(@Param('id') id: string, @Body() updatePriceRuleDto: UpdatePriceRuleDto) {
		return this.pricingService.updateRule(id, updatePriceRuleDto);
	}

	@Delete('rules/:id')
	@ApiOperation({ summary: 'Xóa một luật giá' })
	@ApiParam({ name: 'id', description: 'ID của luật giá' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Xóa thành công' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy luật giá' })
	@ApiAuthErrors()
	deleteRule(@Param('id') id: string) {
		return this.pricingService.deleteRule(id);
	}

	@Post('calculate')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Tính toán giá tiền dự kiến cho phòng hát' })
	@ApiResponse({ status: HttpStatus.OK, description: 'Kết quả tính tiền' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Không tìm thấy loại phòng' })
	@ApiAuthErrors()
	calculatePrice(@Body() calculatePriceDto: CalculatePriceDto) {
		return this.pricingService.calculatePrice(calculatePriceDto);
	}
}
