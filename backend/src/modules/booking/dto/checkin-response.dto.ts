import { Type, Expose } from 'class-transformer';
import { BookingSummaryResponseDto } from './booking-response.dto';
import { InvoiceResponseDto } from '../../invoice/dto/Invoice-response.dto';

/**
 * Data Transfer Object cho dữ liệu phản hồi khi nhận phòng.
 */
export class CheckInResponseDto {
	/**
	 * Thông báo kết quả nhận phòng.
	 */
	@Expose()
	message: string;

	/**
	 * Thông tin đặt phòng.
	 */
	@Expose()
	@Type(() => BookingSummaryResponseDto)
	booking: BookingSummaryResponseDto;

	/**
	 * Hóa đơn của lượt đặt phòng.
	 */
	@Expose()
	@Type(() => InvoiceResponseDto)
	invoice: InvoiceResponseDto;
}
