import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
	ApiOkResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/role.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { BookingDetailResponseDto, BookingSummaryResponseDto } from './dto/booking-response.dto';
import { Roles } from '../../common/decorations/role.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../common/decorations/get-user.decorator';
import { CheckInResponseDto } from './dto/checkin-response.dto';

@ApiTags('Bookings')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('bookings')
@Serialize(BookingSummaryResponseDto)
export class BookingController {
	constructor(private readonly bookingService: BookingService) {}

	//# Create new booking request
	@Post()
	@ApiOperation({ summary: 'Create a new booking' })
	@ApiResponse({ status: 201, type: BookingSummaryResponseDto, description: 'Tạo đơn thành công.' })
	@ApiAuthErrors()
	@ApiResponse({
		status: 404,
		description: 'Không tìm thấy loại phòng hoặc phòng được chọn không hợp lệ',
	})
	create(@Body() createBookingDto: CreateBookingDto) {
		return this.bookingService.create(createBookingDto);
	}

	//# Get all booking
	@Get()
	@ApiOperation({ summary: 'Lấy danh sách đặt phòng kèm bộ lọc tìm kiếm nâng cao' })
	@ApiResponse({
		status: 200,
		type: [BookingSummaryResponseDto],
		description: 'Lấy danh sách thành công',
	})
	@ApiAuthErrors()
	@ApiResponse({
		status: 404,
		description: 'Không tìm thấy lịch hẹn nào. ',
	})
	findAll(@Query() query: BookingQueryDto) {
		return this.bookingService.findAll(query);
	}

	//# Get booking detail
	@Get(':id')
	@ApiOperation({ summary: 'Xem chi tiết một đơn đặt phòng bằng ID' })
	@ApiResponse({
		status: 200,
		type: BookingDetailResponseDto,
	})
	@ApiAuthErrors()
	@ApiResponse({
		status: 404,
		description: 'Không tìm thấy đơn đặt phòng với ID đã cho',
	})
	@Serialize(BookingDetailResponseDto)
	findOne(@Param('id') id: string) {
		return this.bookingService.findOne(id);
	}

	//# Update booking info
	@Patch(':id')
	@Roles(Role.ADMIN, Role.STAFF)
	@ApiOperation({ summary: 'Chỉnh sửa thông tin lịch đặt phòng (Giờ hát, Loại phòng...)' })
	@ApiOkResponse({ type: BookingDetailResponseDto })
	@ApiAuthErrors()
	@ApiBadRequestResponse()
	update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
		return this.bookingService.update(id, updateBookingDto);
	}

	//# Check in for custommer and get room
	@Post(':id/check-in')
	@Roles(Role.ADMIN, Role.STAFF)
	@ApiOperation({
		summary: 'Xác nhận khách đến (Check-in) -> Tự động đổi trạng thái phòng và tạo hóa đơn',
	})
	@ApiOkResponse({ type: CheckInResponseDto })
	@ApiAuthErrors()
	@ApiBadRequestResponse()
	@Serialize(CheckInResponseDto)
	checkIn(
		@Param('id') bookingId: string,
		@GetUser('id') staffId: string,
		@Body('roomId') roomId: string,
	) {
		return this.bookingService.checkIn(bookingId, staffId, roomId);
	}

	//# Cancel booking
	@Patch(':id/cancel')
	@Roles(Role.ADMIN, Role.STAFF, Role.CUSTOMER)
	@ApiOperation({ summary: 'Hủy đơn đặt lịch phòng' })
	@ApiOkResponse({
		description: 'Hủy đơn và giải phóng phòng thành công',
		type: BookingSummaryResponseDto,
	})
	@ApiBadRequestResponse({ description: 'Không thể hủy đơn do sai trạng thái' })
	cancel(@Param('id') id: string) {
		return this.bookingService.cancel(id);
	}
}
