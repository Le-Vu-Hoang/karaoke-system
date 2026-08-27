import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import {ApiResponse} from "@/core/types/api.type";
import {RoomType} from "@/infrastructure/dtos/room.dto";
import {roomRepository} from "@/infrastructure/repositories/room.repository";

export const useRoomTypes = (options?: Partial<UseQueryOptions<ApiResponse<RoomType[]>, Error, RoomType[]>>) => {
    return useQuery({
        queryKey: ['roomTypes'],
        queryFn: () => roomRepository.getRoomTypes(),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        select: (response) => response.data,
        retry: 2,
        ...options,
    });
};