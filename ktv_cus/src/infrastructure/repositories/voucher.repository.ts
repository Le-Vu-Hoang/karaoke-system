import {apiClient} from '@/infrastructure/api/http-client';
import { ApiResponse } from "@/core/types/api.type";
import { UserVoucherDto, BaseVoucherDto } from "../dtos/voucher.dto";

export const voucherRepository = {
  getMyVouchers: async (): Promise<ApiResponse<UserVoucherDto[]>> => {
    const response = await apiClient.get<ApiResponse<UserVoucherDto[]>>('/vouchers/me');
    return response.data;
  },
  
  getPublicVouchers: async (): Promise<ApiResponse<BaseVoucherDto[]>> => {
    const response = await apiClient.get<ApiResponse<BaseVoucherDto[]>>('/vouchers/public');
    return response.data;
  }
};
