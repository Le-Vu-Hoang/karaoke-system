import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategoryResponseDto } from './service-category-response.dto';

export class ServiceResponseDto {
	@ApiProperty({ description: 'ID của dịch vụ/món ăn' })
	id: string;

	@ApiProperty({ description: 'ID của danh mục chứa món này' })
	categoryId: string;

	@ApiProperty({ description: 'Tên dịch vụ/món ăn (VD: Bia Tiger, Trái cây dĩa)' })
	name: string;

	// 💡 LƯU Ý QUAN TRỌNG: Ở Database là Decimal, nhưng khi trả về API phải là number
	@ApiProperty({ description: 'Giá bán', type: Number })
	price: number;

	@ApiProperty({ description: 'Số lượng tồn kho hiện tại' })
	stockQuantity: number;

	@ApiProperty({ description: 'Trạng thái hoạt động (true: Đang bán, false: Ngừng bán/Đã xóa)' })
	isActive: boolean;

	@ApiPropertyOptional({
		description: 'Thông tin chi tiết của danh mục (Có thể null nếu không include)',
		type: () => ServiceCategoryResponseDto,
	})
	category?: ServiceCategoryResponseDto;
}
