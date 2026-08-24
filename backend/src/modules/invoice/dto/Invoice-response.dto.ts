import { Expose, Type, Transform } from 'class-transformer';

/**
 * Data Transfer Object phản hồi thông tin chi tiết Hóa đơn.
 */
export class InvoiceResponseDto {
  /**
   * ID của hóa đơn (UUIDv7).
   * @example "inv-123456"
   */
  @Expose()
  id: string;

  /**
   * ID của đơn đặt phòng liên quan (nếu có).
   * @example "booking-789"
   */
  @Expose()
  bookingId?: string | null;

  /**
   * ID của phòng sử dụng.
   * @example "room-101"
   */
  @Expose()
  roomId: string;

  /**
   * ID nhân viên thực hiện.
   * @example "staff-001"
   */
  @Expose()
  staffId: string;

  /**
   * Thời gian bắt đầu.
   * @example "2026-08-21T18:00:00Z"
   */
  @Expose()
  startTime: Date;

  /**
   * Thời gian kết thúc.
   * @example "2026-08-21T21:00:00Z"
   */
  @Expose()
  endTime?: Date | null;

  /**
   * Tổng tiền phòng.
   * @example 500000
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  roomTotal: number;

  /**
   * Tổng tiền dịch vụ.
   * @example 300000
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  servicesTotal: number;

  /**
   * Chiết khấu cũ (Nên bỏ hoặc giữ cho tương thích).
   * @example 0
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  discount: number;

  /**
   * Chiết khấu theo hạng thành viên (VNĐ).
   * @example 50000
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  tierDiscountAmount: number;

  /**
   * Chiết khấu theo Voucher (VNĐ).
   * @example 100000
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  voucherDiscountAmount: number;

  /**
   * Mã Voucher đã áp dụng (nếu có).
   * @example "SUMMER2026"
   */
  @Expose()
  appliedVoucherCode?: string | null;

  /**
   * ID của User mua hàng.
   * @example "user-123"
   */
  @Expose()
  userId?: string | null;

  /**
   * Trạng thái hóa đơn.
   *
   * @example "UNPAID"
   */
  @Expose()
  status: string;

  /**
   * Tổng tiền cuối cùng.
   *
   * @example 0
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: any }): number =>
    value && typeof value?.toNumber === 'function' ? Number(value.toNumber()) : Number(value) || 0,
  )
  finalTotal: number;
}
