import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PageMetaDto {
	/** Total number of records */
	@Expose()
	total: number;

	/** Current page number */
	@Expose()
	page: number;

	/** Items per page */
	@Expose()
	limit: number;

	/** Total number of pages */
	@Expose()
	lastPage: number;

	/** Indicates if there is a next page */
	@Expose()
	hasNextPage: boolean;

	/** Indicates if there is a previous page */
	@Expose()
	hasPreviousPage: boolean;
}

export class PaginatedResponseDto<T> {
	/**
	 * List of items on the current page
	 */
	@Expose()
	data: T[];

	/**
	 * Metadata information for pagination
	 */
	@ApiProperty({ type: () => PageMetaDto })
	@Expose()
	@Type(() => PageMetaDto)
	meta: PageMetaDto;

	constructor(data: T[], meta: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
