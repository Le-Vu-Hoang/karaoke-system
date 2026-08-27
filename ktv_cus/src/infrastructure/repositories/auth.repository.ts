import {apiClient} from '@/infrastructure/api/http-client';
import {ApiResponse} from '@/core/types/api.type';
import {LoginCredentialsDto, LoginResponseDto, RegisterCredentialsDto, RegisterResponseDto} from '../dtos/auth.dto';
import {API_ENDPOINTS} from "@/shared/constants/api-endpoints";

export const authRepository = {
    login: async (credentials: LoginCredentialsDto): Promise<ApiResponse<LoginResponseDto>> => {
        const response = await apiClient.post<ApiResponse<LoginResponseDto>>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        return response.data;
    },

    register: async (credentials: RegisterCredentialsDto): Promise<ApiResponse<RegisterResponseDto>> => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, credentials);
        return response.data;
    }
};
