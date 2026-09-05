import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class WalkInDto {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  staffId: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  guestName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  guestPhone?: string;

  // Nếu muốn link khách có tài khoản luôn thì dùng userId
  @Expose()
  @IsOptional()
  @IsUUID()
  userId?: string;
}
