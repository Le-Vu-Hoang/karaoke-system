import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
	@ApiProperty({ description: 'Tổng số bản ghi' })
	total: number;

	@ApiProperty({ description: 'Trang hiện tại' })
	page: number;

	@ApiProperty({ description: 'Số bản ghi trên mỗi trang' })
	limit: number;

	@ApiProperty({ description: 'Tổng số trang' })
	lastPage: number;

	@ApiProperty({ description: 'Có trang tiếp theo không?' })
	hasNextPage: boolean;

	@ApiProperty({ description: 'Có trang trước đó không?' })
	hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
	data: T[];

	@ApiProperty({ type: () => PageMetaDto })
	meta: PageMetaDto;
}
