import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

/**
 * Data Transfer Object cho việc cập nhật dịch vụ.
 * Kế thừa toàn bộ thuộc tính từ CreateServiceDto ở dạng tùy chọn.
 */
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
