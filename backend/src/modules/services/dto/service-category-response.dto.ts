import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceCategoryResponseDto {
	@ApiProperty({ description: 'ID của danh mục' })
	id: string;

	@ApiProperty({ description: 'Tên danh mục (VD: Đồ uống, Đồ ăn vặt)' })
	name: string;

	@ApiPropertyOptional({ description: 'Mô tả chi tiết danh mục' })
	description?: string | null;

	@ApiProperty({ description: 'Thứ tự hiển thị trên Menu' })
	displayOrder: number;

	@ApiProperty({ description: 'Trạng thái hoạt động' })
	isActive: boolean;
}
