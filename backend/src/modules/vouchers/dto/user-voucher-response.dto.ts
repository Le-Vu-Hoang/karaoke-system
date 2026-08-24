import { Expose, Type } from 'class-transformer';
import { DecimalToNumber } from '../../../common/decorations/decimal-to-number.decorator';

export class VoucherResponseDto {
  /**
   * ID của Voucher.
   * @example "voucher-123"
   */
  @Expose()
  id: string;

  /**
   * Mã Voucher để nhập khi thanh toán.
   * @example "SUMMER2026"
   */
  @Expose()
  code: string;

  /**
   * Tiêu đề/Tên của Voucher.
   * @example "Giảm 50K cho hóa đơn trên 500K"
   */
  @Expose()
  title: string;

  /**
   * Mô tả chi tiết.
   * @example "Áp dụng cho mọi loại phòng, trừ lễ tết."
   */
  @Expose()
  description: string | null;

  /**
   * Loại giảm giá (PERCENTAGE hoặc FIXED).
   * @example "FIXED"
   */
  @Expose()
  discountType: string;

  /**
   * Giá trị giảm (Ví dụ 50.000 VNĐ hoặc 10%).
   * @example 50000
   */
  @Expose()
  @Type(() => Number)
  @DecimalToNumber()
  discountValue: number;

  /**
   * Mức giảm tối đa (Áp dụng cho loại PERCENTAGE).
   * @example 100000
   */
  @Expose()
  @Type(() => Number)
  @DecimalToNumber()
  maxDiscount: number | null;

  /**
   * Giá trị đơn hàng tối thiểu để được áp dụng voucher.
   * @example 500000
   */
  @Expose()
  @Type(() => Number)
  @DecimalToNumber()
  minOrderValue: number | null;

  /**
   * Phạm vi áp dụng (ALL, ROOM_ONLY, SERVICE_ONLY).
   * @example "ALL"
   */
  @Expose()
  scope: string;

  /**
   * Số điểm Loyalty cần thiết để đổi voucher này.
   * @example 200
   */
  @Expose()
  pointsCost: number;

  /**
   * Thời gian bắt đầu có hiệu lực.
   * @example "2026-06-01T00:00:00Z"
   */
  @Expose()
  validFrom: Date;

  /**
   * Thời gian hết hạn.
   * @example "2026-08-31T23:59:59Z"
   */
  @Expose()
  validTo: Date;

  /**
   * Trạng thái hoạt động của Voucher.
   * @example true
   */
  @Expose()
  isActive: boolean;
}

export class UserVoucherResponseDto {
  /**
   * ID của bản ghi lưu trữ Voucher người dùng sở hữu.
   * @example "uv-12345"
   */
  @Expose()
  id: string;

  /**
   * Trạng thái sử dụng (AVAILABLE, USED, EXPIRED).
   * @example "AVAILABLE"
   */
  @Expose()
  status: string;

  /**
   * Thời gian đã sử dụng (Nếu có).
   * @example null
   */
  @Expose()
  usedAt: Date | null;

  /**
   * Thời gian nhận voucher.
   * @example "2026-08-21T10:00:00Z"
   */
  @Expose()
  createdAt: Date;

  /**
   * Thông tin chi tiết của Voucher.
   */
  @Expose()
  @Type(() => VoucherResponseDto)
  voucher: VoucherResponseDto;
}
