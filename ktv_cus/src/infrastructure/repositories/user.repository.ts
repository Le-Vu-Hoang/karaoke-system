import {apiClient} from '@/infrastructure/api/http-client';
import {ApiResponse} from '@/core/types/api.type';
import {UserDto} from '../dtos/auth.dto';
import {API_ENDPOINTS} from "@/shared/constants/api-endpoints";

export const userRepository = {
    updateProfile: async (data: Partial<Omit<UserDto, 'id' | 'role'>>): Promise<ApiResponse<UserDto>> => {
        const response = await apiClient.patch<ApiResponse<UserDto>>(
            API_ENDPOINTS.USERS.UPDATE_PROFILE,
            data
        );
        return response.data;
    }
};
