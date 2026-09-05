import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/role.guard';
import { RoomService } from './room.service';
import { AuthRoles } from '../../common/decorations/auth-roles.decorator';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';
import { Role } from '@prisma/client';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { Public } from '../../common/decorations/puclic.decorator';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { RoomTypeResponseDto } from './dto/room-type-response.dto';
import { ApiPaginatedResponse } from '../../common/decorations/api-paginated-response.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomResponseDto } from './dto/room-response.dto';
import { RoomLiveResponseDto } from './dto/room-live-response.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { GetAvailabilityQueryDto, AvailabilityResponseDto } from './dto/availability.dto';

@ApiTags('Rooms')
@ApiBearerAuth('JWT')
@Controller('rooms')
@UseGuards(RoleGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  //# Create new room type
  @Post('types')
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo loại phòng mới' })
  @ApiCreatedResponse({
    description: 'Tạo loại phòng thành công',
    type: RoomTypeResponseDto,
  })
  @ApiAuthErrors()
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @Serialize(RoomTypeResponseDto)
  createNewRoomtype(@Body() body: CreateRoomTypeDto) {
    return this.roomService.createNewType(body);
  }

  //# Get all type of rooms
  @Get('types')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách tất cả loại phòng' })
  @ApiOkResponse({ type: [RoomTypeResponseDto] })
  @ApiAuthErrors()
  @Serialize(RoomTypeResponseDto)
  getAllRoomType() {
    return this.roomService.getAllRoomTypes();
  }

  //# Get availability of a room type for a specific date
  @Get('types/:id/availability')
  @Public()
  @ApiOperation({ summary: 'Lấy danh sách các khung giờ ĐÃ KÍN PHÒNG của một loại phòng trong 1 ngày' })
  @ApiParam({ name: 'id', description: 'ID của loại phòng (UUID)', type: String })
  @ApiOkResponse({ description: 'Thành công', type: AvailabilityResponseDto })
  @ApiAuthErrors()
  @Serialize(AvailabilityResponseDto)
  getRoomTypeAvailability(@Param('id') id: string, @Query() query: GetAvailabilityQueryDto) {
    return this.roomService.getRoomTypeAvailability(id, query.date);
  }

  //# Update room type info
  @Patch('types/:id')
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin loại phòng' })
  @ApiParam({ name: 'id', description: 'ID của loại phòng (UUID)', type: String })
  @ApiOkResponse({ description: 'Cập nhật thành công', type: RoomTypeResponseDto })
  @ApiAuthErrors()
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @Serialize(RoomTypeResponseDto)
  updateRoomTypeInfo(@Param('id') id: string, @Body() body: UpdateRoomTypeDto) {
    return this.roomService.updateRoomTypeInfo(body, id);
  }

  //# Add new room
  @Post()
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Thêm phòng vật lý mới' })
  @ApiCreatedResponse({ description: 'Thêm phòng thành công', type: String })
  @ApiAuthErrors()
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @Serialize(RoomResponseDto)
  addNewRoom(@Body() body: CreateRoomDto) {
    return this.roomService.addNewRoom(body);
  }

  //# Get all rooms
  @Get()
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Lấy danh sách các phòng' })
  @ApiPaginatedResponse(RoomLiveResponseDto)
  @ApiAuthErrors()
  @ApiBadRequestResponse()
  @Serialize(RoomLiveResponseDto)
  getAllRooms() {
    return this.roomService.getAllRooms();
  }

  //# Get room info
  @Get(':id')
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một phòng' })
  @ApiParam({ name: 'id', description: 'ID của phòng (UUID)', type: String })
  @ApiOkResponse({ description: 'Dữ liệu chi tiết phòng', type: RoomResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phòng' })
  @ApiAuthErrors()
  @Serialize(RoomResponseDto)
  getRoomInfo(@Param('id') id: string) {
    return this.roomService.getRoomInfo(id);
  }

  //# Update room info
  @Patch(':id')
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin phòng' })
  @ApiParam({ name: 'id', description: 'ID của phòng (UUID)', type: String })
  @ApiOkResponse({ description: 'Cập nhật thành công', type: String })
  @ApiAuthErrors()
  @ApiBadRequestResponse()
  @Serialize(RoomResponseDto)
  updateRoomInfo(@Param('id') id: string, @Body() body: UpdateRoomDto) {
    return this.roomService.updateRoomInfo(body, id);
  }

  //# Update status room
  @Patch(':id/status')
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Cập nhật nhanh trạng thái phòng (VD: Bảo trì)' })
  @ApiParam({ name: 'id', description: 'ID của phòng (UUID)', type: String })
  @ApiOkResponse({ description: 'Chuyển trạng thái thành công', type: String })
  @ApiAuthErrors()
  @ApiBadRequestResponse()
  updateRoomStatus(@Param('id') id: string, @Body() body: UpdateRoomStatusDto) {
    return this.roomService.updateRoomStatus(id, body.status);
  }

  //# Disable room
  @Delete(':id')
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Vô hiệu hóa (Soft Delete) phòng' })
  @ApiParam({ name: 'id', description: 'ID của phòng (UUID)', type: String })
  @ApiOkResponse({ description: 'Vô hiệu hóa thành công', type: String })
  @ApiAuthErrors()
  @ApiBadRequestResponse()
  disableRoom(@Param('id') id: string) {
    return this.roomService.disableRoom(id);
  }
}
