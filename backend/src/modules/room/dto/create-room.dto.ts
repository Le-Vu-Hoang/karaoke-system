import { IsNotEmpty, IsString, IsUUID, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { Expose } from 'class-transformer';
import { RoomStatus } from '@prisma/client';

/**
 * Data Transfer Object cho việc tạo mới một phòng vật lý.
 */
export class CreateRoomDto {
  /**
   * URL hình ảnh của phòng.
   *
   * @example https://res.cloudinary.com/...image.jpg
   */
  @Expose()
  @IsString()
  @IsUrl({}, { message: 'Đường dẫn ảnh không hợp lệ' })
  @IsOptional()
  imageUrl?: string;

  /**
   * ID của loại phòng liên kết (UUIDv7).
   *
   * @example 0190...uuid
   */
  @Expose()
  @IsUUID('7', { message: 'ID loại phòng phải là định dạng UUIDv7' })
  @IsNotEmpty({ message: 'Phải chọn loại phòng' })
  roomTypeId: string;

  /**
   * Số hiệu hoặc tên của phòng (VD: P101, V202).
   *
   * @example P101
   */
  @Expose()
  @IsString()
  @IsNotEmpty({ message: 'Số hiệu phòng không được để trống' })
  roomNumber: string;

  /**
   * Trạng thái khởi tạo của phòng (Mặc định: AVAILABLE).
   *
   * @default RoomStatus.AVAILABLE
   */
  @Expose()
  @IsEnum(RoomStatus, { message: 'Trạng thái phòng không hợp lệ' })
  @IsOptional()
  status?: RoomStatus;
}
