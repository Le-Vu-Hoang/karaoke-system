import {useQuery, UseQueryOptions} from "@tanstack/react-query";
import {ApiResponse} from "@/core/types/api.type";
import {Booking, GetBookingParams} from "@/infrastructure/dtos/booking.dto";
import {bookingRepository} from "@/infrastructure/repositories/booking.repository";

export const useMyBooking = (params?: GetBookingParams, options?: Partial<UseQueryOptions<ApiResponse<Booking[]>, Error, Booking[]>>) => {
    return useQuery({
        queryKey: ['booking/my-booking', params],
        queryFn: () => bookingRepository.getAllBookings(params),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        select: (response) => response.data,
        retry: 2,
        ...options,
    });
};
