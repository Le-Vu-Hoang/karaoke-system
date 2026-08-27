import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ApiResponse } from "@/core/types/api.type";
import { UserVoucherDto } from "@/infrastructure/dtos/voucher.dto";
import { voucherRepository } from "@/infrastructure/repositories/voucher.repository";

export const useMyVouchers = (options?: Partial<UseQueryOptions<ApiResponse<UserVoucherDto[]>, Error, UserVoucherDto[]>>) => {
    return useQuery({
        queryKey: ['vouchers/my-vouchers'],
        queryFn: () => voucherRepository.getMyVouchers(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        select: (response) => response.data,
        retry: 2,
        ...options,
    });
};
