import {apiClient} from '@/infrastructure/api/http-client';
import {Booking, CreateBookingDto, CreateBookingResponseDto, GetBookingParams} from '@/infrastructure/dtos/booking.dto';
import {ApiResponse} from "@/core/types/api.type";
import {API_ENDPOINTS} from "@/shared/constants/api-endpoints";

export const bookingRepository = {
    createBooking: async (data: CreateBookingDto): Promise<ApiResponse<CreateBookingResponseDto>> => {
        const response = await apiClient.post<ApiResponse<CreateBookingResponseDto>>(API_ENDPOINTS.BOOKINGS.CREATE, data);
        return response.data;
    },

    getAllBookings: async (query?: GetBookingParams): Promise<ApiResponse<Booking[]>> => {
        const response = await apiClient.get<ApiResponse<Booking[]>>(API_ENDPOINTS.BOOKINGS.GET_ME, {params: query});
        return response.data;
    }
};
