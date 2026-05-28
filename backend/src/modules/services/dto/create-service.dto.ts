import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsUUID } from 'class-validator';

export class CreateServiceDto {
	@ApiProperty({ description: 'ID của danh mục (ServiceCategory)' })
	@IsUUID('7', { message: 'ID danh mục phải là chuẩn UUID' })
	@IsNotEmpty({ message: 'Vui lòng chọn danh mục' })
	categoryId: string;

	@ApiProperty({ description: 'Tên dịch vụ/món ăn' })
	@IsString()
	@IsNotEmpty({ message: 'Tên dịch vụ không được để trống' })
	name: string;

	@ApiProperty({ description: 'Giá bán' })
	@IsNumber()
	@Min(0, { message: 'Giá bán không được âm' })
	price: number;

	@ApiPropertyOptional({ description: 'Số lượng tồn kho ban đầu (mặc định 0)' })
	@IsOptional()
	@IsNumber()
	@Min(0)
	stockQuantity?: number;
}
