import { IsEnum, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';
import { RoomStatus } from '@prisma/client';

/**
 * Data Transfer Object cho việc cập nhật nhanh trạng thái phòng.
 */
export class UpdateRoomStatusDto {
  /**
   * Trạng thái mới muốn cập nhật cho phòng.
   *
   * @example MAINTENANCE
   */
  @Expose()
  @IsEnum(RoomStatus, { message: 'Trạng thái phòng không hợp lệ' })
  @IsNotEmpty({ message: 'Không được để trống trạng thái' })
  status: RoomStatus;
}
