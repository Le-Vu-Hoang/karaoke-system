import { BookingStatus, Prisma } from '@prisma/client';
import { Expose, Type, Transform } from 'class-transformer';

//? DTO for custom
class BookingCustomerDto {
  /**
   * ID Khách hàng.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  id: string;

  /**
   * Họ tên khách hàng.
   * @example "Nguyen Van A"
   */
  @Expose()
  fullName: string;

  /**
   * Số điện thoại.
   * @example "0912345678"
   */
  @Expose()
  phoneNumber: string;
}

//? DTO for roomType mapping
class BookingRoomTypeDto {
  /**
   * ID Loại phòng.
   * @example "type-123"
   */
  @Expose()
  id: string;

  /**
   * Tên loại phòng (VIP, Thường...).
   * @example "Phòng VIP - Sức chứa 15 người"
   */
  @Expose()
  name: string;
}

//? DTO for room mapping
class BookingRoomDto {
  /**
   * ID Phòng.
   * @example "room-456"
   */
  @Expose()
  id: string;

  /**
   * Tên/Số phòng cụ thể.
   * @example "P101"
   */
  @Expose()
  roomNumber: string;
}

//! --- MAIN DTO RESPONSE ---

//? DTO for list find all
export type BookingSummaryRelations = Prisma.BookingGetPayload<{
  include: {
    customer: { select: { id: true; fullName: true; phoneNumber: true } };
    roomType: true;
    room: true;
  };
}>;

/**
 * Data Transfer Object cho danh sách tổng quan đặt phòng.
 */
export class BookingSummaryResponseDto {
  constructor(partial: Partial<BookingSummaryResponseDto> | BookingSummaryRelations) {
    Object.assign(this, partial);
  }

  /**
   * Mã đơn đặt phòng (UUID).
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  id: string;

  /**
   * Tên khách vãng lai.
   * @example "Khách Lẻ"
   */
  @Expose()
  guestName?: string | null;

  /**
   * Thời gian nhận phòng dự kiến.
   * @example "2026-08-21T18:00:00Z"
   */
  @Expose()
  @Type(() => Date)
  startTime: Date;

  /**
   * Thời gian trả phòng dự kiến.
   * @example "2026-08-21T21:00:00Z"
   */
  @Expose()
  @Type(() => Date)
  endTime: Date;

  /**
   * Trạng thái hiện tại của Booking.
   * @example "CONFIRMED"
   */
  @Expose()
  status: BookingStatus;

  /**
   * Số tiền đặt cọc trước (VNĐ).
   *
   * @default 0
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  deposit: number;

  /**
   * Thông tin thành viên (Nếu có).
   */
  @Expose()
  @Type(() => BookingCustomerDto)
  customer?: BookingCustomerDto;

  /**
   * Thông tin loại phòng.
   */
  @Expose()
  @Type(() => BookingRoomTypeDto)
  roomType?: BookingRoomTypeDto;

  /**
   * Thông tin phòng đã xếp (Nếu có).
   */
  @Expose()
  @Type(() => BookingRoomDto)
  room?: BookingRoomDto;
}

//? DTO for find one detail
export type BookingDetailRelations = Prisma.BookingGetPayload<{
  include: {
    customer: true;
    roomType: true;
    room: true;
  };
}>;

/**
 * Data Transfer Object cho thông tin chi tiết đặt phòng.
 */
export class BookingDetailResponseDto extends BookingSummaryResponseDto {
  constructor(partial: Partial<BookingDetailResponseDto> | BookingDetailRelations) {
    super(partial);
  }

  /**
   * ID khách hàng (Nếu là thành viên).
   * @example "cus-123"
   */
  @Expose()
  customerId?: string | null;

  /**
   * Số điện thoại khách vãng lai.
   * @example "0987654321"
   */
  @Expose()
  guestPhone?: string | null;

  /**
   * ID Loại phòng khách chọn.
   * @example "type-123"
   */
  @Expose()
  roomTypeId: string;

  /**
   * ID Phòng cụ thể được xếp (khi check-in).
   * @example "room-456"
   */
  @Expose()
  roomId?: string | null;

  /**
   * Thời điểm tạo đơn.
   * @example "2026-08-20T10:00:00Z"
   */
  @Expose()
  createdAt: Date;
}

/**
 * Dữ liệu phản hồi thông tin thanh toán (nếu có).
 */
export class PaymentResponseDto {
  /**
   * ID giao dịch thanh toán.
   * @example "pi_3MtwBwLkdIwHu7ix28a3tq3X"
   */
  @Expose()
  transactionId: string;

  /**
   * Link thanh toán (nếu sử dụng Stripe Checkout hoặc VNPay/Momo).
   * @example "https://checkout.stripe.com/c/pay/..."
   */
  @Expose()
  paymentUrl?: string;

  /**
   * Client secret cho thanh toán trực tiếp (nếu dùng Stripe Payment Intents).
   * @example "pi_3MtwBwLkdIwHu7ix28a3tq3X_secret_abcd1234"
   */
  @Expose()
  clientSecret?: string;
}

/**
 * Dữ liệu phản hồi khi tạo mới một Booking thành công.
 */
export class BookingCreateResponseDto {
  /**
   * Thông tin Booking vừa tạo.
   */
  @Expose()
  @Type(() => BookingSummaryResponseDto)
  booking: BookingSummaryResponseDto;

  /**
   * Thông tin thanh toán (trả về nếu Booking yêu cầu đặt cọc).
   */
  @Expose()
  @Type(() => PaymentResponseDto)
  payment?: PaymentResponseDto;
}
