import { Expose, Type } from 'class-transformer';
import { RoomStatus } from '@prisma/client';
import { RoomTypeResponseDto } from './room-type-response.dto';

/**
 * Data Transfer Object cho dữ liệu phản hồi của một phòng vật lý.
 */
export class RoomResponseDto {
	/**
	 * ID của phòng (UUIDv7).
	 *
	 * @example 0190b9e8-fa12-7abc-9d8e-ef0123456789
	 */
	@Expose()
	id: string;

	/**
	 * ID loại phòng liên kết.
	 *
	 * @example 0190a1b2-c3d4-7ebd-8f9a-bcde12345678
	 */
	@Expose()
	roomTypeId: string;

	/**
	 * Số hiệu hoặc tên phòng.
	 *
	 * @example P101
	 */
	@Expose()
	roomNumber: string;

	/**
	 * Trạng thái hiện tại của phòng.
	 *
	 * @example AVAILABLE
	 */
	@Expose()
	status: RoomStatus;

	/**
	 * Thông tin chi tiết loại phòng đi kèm (Nếu được join query).
	 */
	@Expose()
	@Type(() => RoomTypeResponseDto)
	roomType?: RoomTypeResponseDto;
}
