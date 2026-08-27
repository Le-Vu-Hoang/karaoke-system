//# Query params for fetching services with optional filters and pagination
export interface GetServicesQueryParams {
    categoryId?: string;
    search?: string;
    limit?: number;
    page?: number;
}

//# Category DTO
export interface ServiceCategory {
    id: string;
    name: string;
    description: string | null;
    displayOrder: number;
    isActive: boolean;

    services?: Service[];
}

//# Services DTO
export interface Service {
    id: string;
    categoryId: string;
    name: string;
    price: number;
    stockQuantity: number;
    isActive: boolean;

    category?: ServiceCategory;
}

