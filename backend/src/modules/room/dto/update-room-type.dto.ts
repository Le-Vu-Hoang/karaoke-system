import { PartialType } from '@nestjs/swagger';
import { CreateRoomTypeDto } from './create-room-type.dto';

/**
 * Data Transfer Object cho việc cập nhật thông tin loại phòng.
 * Kế thừa toàn bộ thuộc tính từ CreateRoomTypeDto nhưng ở dạng tùy chọn (Optional).
 */
export class UpdateRoomTypeDto extends PartialType(CreateRoomTypeDto) {}
