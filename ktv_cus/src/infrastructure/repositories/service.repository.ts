import {apiClient} from '@/infrastructure/api/http-client';
import {GetServicesQueryParams, Service, ServiceCategory} from '@/infrastructure/dtos/service.dto';
import {ApiResponse} from "@/core/types/api.type";
import {PaginatedResponse} from "@/core/types/pagination.type";
import {API_ENDPOINTS} from "@/shared/constants/api-endpoints";

export const serviceRepository = {
    getCategories: async (): Promise<ApiResponse<ServiceCategory[]>> => {
        const response = await apiClient.get<ApiResponse<ServiceCategory[]>>(API_ENDPOINTS.SERVICES.CATEGORIES);
        return response.data;
    },
    getServices: async (params?: GetServicesQueryParams): Promise<ApiResponse<PaginatedResponse<Service>>> => {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<Service>>>(API_ENDPOINTS.SERVICES.LIST, {params});
        return response.data;
    }
};