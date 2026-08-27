import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { CreateBookingDto } from "@/infrastructure/dtos/booking.dto";
import { bookingRepository } from "@/infrastructure/repositories/booking.repository";
import { toast } from "@/presentation/shared_ui/sonner";

export const useCreateBooking = (options?: UseMutationOptions<any, Error, CreateBookingDto>) => {
    return useMutation({
        mutationFn: (payload: CreateBookingDto) => bookingRepository.createBooking(payload),
        onError: (error: any) => {
            console.error("API booking request failed:", error);
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Có lỗi xảy ra khi tạo đặt phòng. Vui lòng thử lại."
            );
        },
        ...options,
    });
};
