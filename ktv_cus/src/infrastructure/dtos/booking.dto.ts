import {PaginationQueryParams} from "@/core/types/pagination.type";

export interface BookingServiceItem {
    serviceId: string;
    quantity: number;
}

export interface CreateBookingDto {
    customerId?: string;
    guestName?: string;
    guestPhone?: string;
    roomTypeId: string;
    startTime: string; // ISO string
    endTime: string; // ISO string
    deposit?: number;
    paymentProvider?: string; // 'STRIPE' | 'MOMO' | 'VNPAY'
    notes?: string;
}

export interface BookingCustomer {
    id: string;
    fullName: string;
    phoneNumber: string;
}

export interface BookingRoomType {
    id: string;
    name: string;
}

export interface BookingRoom {
    id: string;
    roomNumber: string;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | string;

export interface Booking {
    id: string;
    guestName?: string | null;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    deposit: number;

    customer: BookingCustomer;
    roomType: BookingRoomType;
    room: BookingRoom;
}

export interface PaymentDto {
    transactionId: string;
    paymentUrl?: string;
    clientSecret?: string;
}

export interface CreateBookingResponseDto {
    booking: Booking;
    payment: PaymentDto;
}

export interface GetBookingParams extends PaginationQueryParams {
    search?: string;
    fromDate?: Date;
    toDate?: Date;
    status?: BookingStatus;
    roomTypeId?: string;
}