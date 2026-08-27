import {apiClient} from '@/infrastructure/api/http-client';
import {GetRoomsQueryParams, Room, RoomType} from '@/infrastructure/dtos/room.dto';
import {ApiResponse} from "@/core/types/api.type";
import {PaginatedResponse} from "@/core/types/pagination.type";
import {API_ENDPOINTS} from "@/shared/constants/api-endpoints";

export const roomRepository = {
    getRooms: async (params?: GetRoomsQueryParams): Promise<ApiResponse<PaginatedResponse<Room>>> => {
        const response = await apiClient.get<ApiResponse<PaginatedResponse<Room>>>(API_ENDPOINTS.ROOMS.LIST, {params});
        return response.data;
    },
    getRoomTypes: async (): Promise<ApiResponse<RoomType[]>> => {
        const response = await apiClient.get<ApiResponse<RoomType[]>>(API_ENDPOINTS.ROOMS.TYPES);
        return response.data;
    },
    getRoomDetails: async (id: string): Promise<ApiResponse<Room>> => {
        const response = await apiClient.get<ApiResponse<Room>>(API_ENDPOINTS.ROOMS.DETAILS(id));
        return response.data;
    }
};
