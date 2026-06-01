import { BookingStatus, Prisma } from '@prisma/client';
import { Expose, Type, Transform } from 'class-transformer';

//? DTO for custom
class BookingCustomerDto {
	/** ID Khách hàng */
	@Expose()
	id: string;

	/** Họ tên khách hàng */
	@Expose()
	fullName: string;

	/** Số điện thoại */
	@Expose()
	phoneNumber: string;
}

//? DTO for roomType mapping
class BookingRoomTypeDto {
	/** ID Loại phòng */
	@Expose()
	id: string;

	/** Tên loại phòng (VIP, Thường...) */
	@Expose()
	name: string;
}

//? DTO for room mapping
class BookingRoomDto {
	/** ID Phòng */
	@Expose()
	id: string;

	/** Tên/Số phòng cụ thể */
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

export class BookingSummaryResponseDto {
	constructor(partial: Partial<BookingSummaryResponseDto> | BookingSummaryRelations) {
		Object.assign(this, partial);
	}

	/** Mã đơn đặt phòng (UUID) */
	@Expose()
	id: string;

	/** Tên khách vãng lai */
	@Expose()
	guestName?: string | null;

	/** Thời gian khách dự kiến đến nhận phòng */
	@Expose()
	bookingTime: Date;

	/** * Số giờ dự kiến hát
	 * @example 2
	 */
	@Expose()
	durationExpected: number;

	/** Trạng thái hiện tại của Booking */
	@Expose()
	status: BookingStatus;

	/** * Số tiền đặt cọc trước (VNĐ)
	 * @default 0
	 */
	@Expose()
	@Transform(({ value }) => (value ? Number(value) : 0))
	deposit: number;

	/** Thông tin thành viên (Nếu có) */
	@Expose()
	@Type(() => BookingCustomerDto)
	customer?: BookingCustomerDto;

	/** Thông tin loại phòng */
	@Expose()
	@Type(() => BookingRoomTypeDto)
	roomType?: BookingRoomTypeDto;

	/** Thông tin phòng đã xếp (Nếu có) */
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

export class BookingDetailResponseDto extends BookingSummaryResponseDto {
	constructor(partial: Partial<BookingDetailResponseDto> | BookingDetailRelations) {
		super(partial);
	}

	/** ID khách hàng (Nếu là thành viên) */
	@Expose()
	customerId?: string | null;

	/** Số điện thoại khách vãng lai */
	@Expose()
	guestPhone?: string | null;

	/** ID Loại phòng khách chọn */
	@Expose()
	roomTypeId: string;

	/** ID Phòng cụ thể được xếp (khi check-in) */
	@Expose()
	roomId?: string | null;

	/** Thời điểm tạo đơn */
	@Expose()
	createdAt: Date;
}
