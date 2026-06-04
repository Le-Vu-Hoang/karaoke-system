import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

/**
 * Data Transfer Object cho việc cập nhật thông tin phòng.
 * Kế thừa toàn bộ thuộc tính từ CreateRoomDto nhưng ở dạng tùy chọn (Optional).
 */
export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
