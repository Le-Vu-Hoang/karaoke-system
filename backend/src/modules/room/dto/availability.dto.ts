import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class GetAvailabilityQueryDto {
  @ApiProperty({ description: 'Ngày muốn kiểm tra phòng trống (YYYY-MM-DD)', example: '2026-08-23' })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}

export class BookedSlotDto {
  @ApiProperty({ description: 'Khung giờ bắt đầu (Index của mốc 30 phút, 0 = 09:00)', example: 20 })
  @Expose()
  start: number;

  @ApiProperty({ description: 'Khung giờ kết thúc (Index của mốc 30 phút, 36 = 03:00)', example: 23 })
  @Expose()
  end: number;
}

export class AvailabilityResponseDto {
  @ApiProperty({ type: [BookedSlotDto], description: 'Danh sách các khung giờ ĐÃ KÍN phòng' })
  @Expose()
  bookedSlots: BookedSlotDto[];
}
