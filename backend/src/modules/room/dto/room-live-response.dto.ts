import { Expose, Type, Transform } from 'class-transformer';
import { RoomStatus } from '@prisma/client';
import { RoomTypeResponseDto } from './room-type-response.dto';

interface RawInvoiceItem {
  priceAtTime?: number | string | object;
  quantity?: number;
}

interface RawBookingCustomer {
  fullName?: string | null;
}

interface RawBooking {
  guestName?: string | null;
  customer?: RawBookingCustomer | null;
}

interface RawInvoice {
  startTime: string | number | Date;
  invoiceItems?: RawInvoiceItem[];
  booking?: RawBooking | null;
}

interface RawRoomType {
  basePricePerHour?: number | string | object | null;
}

interface RawRoomSource {
  invoices?: RawInvoice[];
  roomType?: RawRoomType | null;
}

/**
 * Data Transfer Object cho Session hiện tại (phiên hát đang chạy) của một phòng.
 */
export class CurrentSessionDto {
  /**
   * Thời gian bắt đầu mở phòng/tạo hóa đơn.
   */
  @Expose()
  @Type(() => Date)
  startTime: Date;

  /**
   * Tên khách hàng (Nếu có Booking).
   */
  @Expose()
  guestName?: string | null;

  /**
   * Tạm tính tổng tiền hiện tại (VNĐ).
   * Tính toán bằng (Tiền dịch vụ + Tiền giờ).
   */
  @Expose()
  @Type(() => Number)
  @Transform(({ value }: { value: unknown }) => Number(value) || 0)
  currentBill: number;
}

/**
 * Data Transfer Object trả về cho màn hình Live Dashboard của Staff.
 * Chứa thông tin phòng kèm dữ liệu Real-time (hóa đơn đang mở).
 */
export class RoomLiveResponseDto {
  /**
   * ID của phòng.
   */
  @Expose()
  id: string;

  /**
   * Số phòng.
   */
  @Expose()
  roomNumber: string;

  /**
   * Trạng thái hiện tại của phòng (AVAILABLE, IN_USE, CLEARING, MAINTENANCE).
   */
  @Expose()
  status: RoomStatus;

  /**
   * Ghi chú về vấn đề bảo trì hoặc dọn dẹp.
   */
  @Expose()
  notes?: string | null;

  /**
   * Thông tin loại phòng (để lấy sức chứa, tên loại phòng).
   */
  @Expose()
  @Type(() => RoomTypeResponseDto)
  roomType?: RoomTypeResponseDto;

  /**
   * Dữ liệu phiên hát hiện tại (Chỉ có khi status = IN_USE hoặc CLEARING).
   */
  @Expose()
  @Transform(
    ({ obj }: { obj: RawRoomSource }): CurrentSessionDto | undefined => {
      if (obj.invoices && obj.invoices.length > 0) {
        const activeInvoice = obj.invoices[0];

        // Tính tổng tiền các món dịch vụ đã gọi
        const servicesTotal =
          activeInvoice.invoiceItems?.reduce(
            (sum: number, item: RawInvoiceItem) => sum + Number(item.priceAtTime || 0) * (item.quantity || 0),
            0,
          ) || 0;

        // Tính tiền giờ tạm tính
        const startTime = new Date(activeInvoice.startTime).getTime();
        const hoursElapsed = (new Date().getTime() - startTime) / (1000 * 60 * 60);
        const basePricePerHour = Number(obj.roomType?.basePricePerHour || 0);
        const roomTotal = hoursElapsed * basePricePerHour;

        return {
          startTime: new Date(activeInvoice.startTime),
          guestName: activeInvoice.booking?.guestName || activeInvoice.booking?.customer?.fullName || null,
          currentBill: Math.round(servicesTotal + roomTotal),
        };
      }
      return undefined;
    },
    { toClassOnly: true },
  )
  @Type(() => CurrentSessionDto)
  currentSession?: CurrentSessionDto;
}
