import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {serviceRepository} from '@/infrastructure/repositories/service.repository';
import {GetServicesQueryParams, Service, ServiceCategory} from '@/infrastructure/dtos/service.dto';
import {ApiResponse} from "@/core/types/api.type";
import {PaginatedResponse} from "@/core/types/pagination.type";

export const useServiceCategories = (options?: Partial<UseQueryOptions<ApiResponse<ServiceCategory[]>, Error, ServiceCategory[]>>) => {
    return useQuery({
        queryKey: ['service-categories'],
        queryFn: serviceRepository.getCategories,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        gcTime: 10 * 60 * 1000,
        select: (response) => response.data.sort((a, b) => a.displayOrder - b.displayOrder),
        retry: 2,
        ...options,
    });
};

export const useServices = (params?: GetServicesQueryParams, options?: Partial<UseQueryOptions<ApiResponse<PaginatedResponse<Service>>, Error, Service[]>>) => {
    return useQuery({
        queryKey: ['services', params],
        queryFn: () => serviceRepository.getServices(params),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        gcTime: 10 * 60 * 1000,
        select: (response) => response.data.data,
        retry: 2,
        ...options,
    });
};