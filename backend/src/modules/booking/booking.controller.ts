import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
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
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import {
  BookingDetailResponseDto,
  BookingSummaryResponseDto,
  BookingCreateResponseDto,
} from './dto/booking-response.dto';
import { AuthRoles } from '../../common/decorations/auth-roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../common/decorations/get-user.decorator';
import { CheckInResponseDto } from './dto/checkin-response.dto';
import { Public } from '../../common/decorations/puclic.decorator';

@ApiTags('Bookings')
@ApiBearerAuth('JWT')
@UseGuards(RoleGuard)
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  //# Create new booking request
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, type: BookingCreateResponseDto, description: 'Tạo đơn thành công.' })
  @ApiAuthErrors()
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy loại phòng hoặc phòng được chọn không hợp lệ',
  })
  @Serialize(BookingCreateResponseDto)
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  //# Get all booking for staff and admin
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
  @Serialize(BookingSummaryResponseDto)
  findAll(@Query() query: BookingQueryDto) {
    return this.bookingService.findAll(query);
  }

  //# Get booking for user
  @Get('me')
  @AuthRoles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Lấy danh sách đơn đặt phòng của khách hàng hiện tại' })
  @ApiResponse({
    status: 200,
    type: [BookingSummaryResponseDto],
  })
  @ApiAuthErrors()
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy lịch hẹn nào. ',
  })
  @Serialize(BookingSummaryResponseDto)
  findAllById(@GetUser('id') id: string, @Query() query: BookingQueryDto) {
    return this.bookingService.findByCusId(id, query);
  }

  //# Get booking detail for staff and admin
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
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Chỉnh sửa thông tin lịch đặt phòng (Giờ hát, Loại phòng...)' })
  @ApiOkResponse({ type: BookingDetailResponseDto })
  @ApiAuthErrors()
  @ApiBadRequestResponse()
  @Serialize(BookingDetailResponseDto)
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  //# Check in for custommer and get room
  @Post(':id/check-in')
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({
    summary: 'Xác nhận khách đến (Check-in) -> Tự động đổi trạng thái phòng và tạo hóa đơn',
  })
  @ApiOkResponse({ type: CheckInResponseDto })
  @ApiAuthErrors()
  @ApiBadRequestResponse()
  @Serialize(CheckInResponseDto)
  checkIn(@Param('id') bookingId: string, @GetUser('id') staffId: string, @Body('roomId') roomId: string) {
    return this.bookingService.checkIn(bookingId, staffId, roomId);
  }

  //# Cancel booking
  @Patch(':id/cancel')
  @AuthRoles(Role.ADMIN, Role.STAFF, Role.CUSTOMER)
  @ApiOperation({ summary: 'Hủy đơn đặt lịch phòng' })
  @ApiOkResponse({
    description: 'Hủy đơn và giải phóng phòng thành công',
    type: BookingSummaryResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Không thể hủy đơn do sai trạng thái' })
  @Serialize(BookingSummaryResponseDto)
  cancel(@Param('id') id: string) {
    return this.bookingService.cancel(id);
  }
}
