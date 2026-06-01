import { Type, Expose } from 'class-transformer';
import { BookingSummaryResponseDto } from './booking-response.dto';
import { InvoiceResponseDto } from '../../invoice/dto/Invoice-response.dto';

export class CheckInResponseDto {
	@Expose()
	message: string;

	@Expose()
	@Type(() => BookingSummaryResponseDto)
	booking: BookingSummaryResponseDto;

	@Expose()
	@Type(() => InvoiceResponseDto)
	invoice: InvoiceResponseDto;
}
