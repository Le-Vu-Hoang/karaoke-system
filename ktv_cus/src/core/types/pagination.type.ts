
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface PaginationQueryParams {
    page?: number;
    limit?: number;
}