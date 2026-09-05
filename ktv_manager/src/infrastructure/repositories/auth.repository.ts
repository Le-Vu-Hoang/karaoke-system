import { LoginCredentialsDto, LoginResponseDto } from "@/infrastructure/dtos/auth.dto";
import { ApiResponse } from "@/core/types/api.type";
import { apiClient } from "@/infrastructure/api/http-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";

export const authRepository = {
  login: async (credential: LoginCredentialsDto): Promise<ApiResponse<LoginResponseDto>> => {
    const response = await apiClient.post<ApiResponse<LoginResponseDto>>(
      API_ENDPOINTS.AUTH.LOGIN,
      credential,
    );
    return response.data;
  },
};
