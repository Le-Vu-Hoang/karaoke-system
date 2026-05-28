import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';
import { RoomService } from './room.service';
import { Roles } from '../../common/decorations/role.decorator';
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
import { UpdateRoomDto } from './dto/update-room.dto';
import { UpdateRoomStatusDto } from './dto/update-room-status.dto';

@ApiTags('Rooms')
@ApiBearerAuth('JWT')
@Controller('rooms')
@UseGuards(JwtAuthGuard, RoleGuard)
export class RoomController {
	constructor(private readonly roomService: RoomService) {}

	//# Create new room type
	@Post('types')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Tạo loại phòng mới' })
	@ApiCreatedResponse({
		description: 'Tạo loại phòng thành công',
		type: RoomTypeResponseDto,
	})
	@ApiAuthErrors()
	async createNewRoomtype(@Body() body: CreateRoomTypeDto): Promise<RoomTypeResponseDto> {
		return await this.roomService.createNewType(body);
	}

	//# Get all type of rooms
	@Get('types')
	@Public()
	@ApiOperation({ summary: 'Lấy danh sách tất cả loại phòng' })
	@ApiPaginatedResponse(RoomTypeResponseDto)
	@ApiAuthErrors()
	async getAllRoomType(
		@Query() query: PaginationQueryDto,
	): Promise<PaginatedResponseDto<RoomTypeResponseDto>> {
		return await this.roomService.getAllRoomTypes(query);
	}

	//# Update room type info
	@Patch('types/:id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Cập nhật thông tin loại phòng' })
	@ApiParam({ name: 'id', description: 'ID của loại phòng (UUID)', type: String })
	@ApiOkResponse({ description: 'Cập nhật thành công', type: RoomTypeResponseDto })
	@ApiAuthErrors()
	async updateRoomTypeInfo(
		@Param('id') id: string,
		@Body() body: UpdateRoomTypeDto,
	): Promise<RoomTypeResponseDto> {
		return await this.roomService.updateRoomTypeInfo(body, id);
	}

	//# Add new room
	@Post()
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Thêm phòng vật lý mới' })
	@ApiCreatedResponse({ description: 'Thêm phòng thành công', type: String })
	@ApiAuthErrors()
	async addNewRoom(@Body() body: CreateRoomDto): Promise<RoomResponseDto> {
		return await this.roomService.addNewRoom(body);
	}

	//# Get all rooms
	@Get()
	@Roles(Role.ADMIN, Role.STAFF)
	@ApiOperation({ summary: 'Lấy danh sách các phòng' })
	@ApiPaginatedResponse(RoomResponseDto)
	@ApiAuthErrors()
	async getAllRooms(
		@Query() query: PaginationQueryDto,
	): Promise<PaginatedResponseDto<RoomResponseDto>> {
		return await this.roomService.getAllRooms(query);
	}

	//# Get room info
	@Get(':id')
	@Roles(Role.ADMIN, Role.STAFF)
	@ApiOperation({ summary: 'Lấy thông tin chi tiết một phòng' })
	@ApiParam({ name: 'id', description: 'ID của phòng (UUID)', type: String })
	@ApiOkResponse({ description: 'Dữ liệu chi tiết phòng', type: RoomResponseDto })
	@ApiResponse({ status: 404, description: 'Không tìm thấy phòng' })
	@ApiAuthErrors()
	async getRoomInfo(@Param('id') id: string): Promise<RoomResponseDto> {
		return await this.roomService.getRoomInfo(id);
	}

	//# Update room info
	@Patch(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Cập nhật thông tin phòng' })
	@ApiParam({ name: 'id', description: 'ID của phòng (UUID)', type: String })
	@ApiOkResponse({ description: 'Cập nhật thành công', type: String })
	@ApiAuthErrors()
	async updateRoomInfo(
		@Param('id') id: string,
		@Body() body: UpdateRoomDto,
	): Promise<RoomResponseDto> {
		return await this.roomService.updateRoomInfo(body, id);
	}

	//# Update status room
	@Patch(':id/status')
	@Roles(Role.ADMIN, Role.STAFF)
	@ApiOperation({ summary: 'Cập nhật nhanh trạng thái phòng (VD: Bảo trì)' })
	@ApiParam({ name: 'id', description: 'ID của phòng (UUID)', type: String })
	@ApiOkResponse({ description: 'Chuyển trạng thái thành công', type: String })
	@ApiAuthErrors()
	async updateRoomStatus(
		@Param('id') id: string,
		@Body() body: UpdateRoomStatusDto,
	): Promise<string> {
		return await this.roomService.updateRoomStatus(id, body.status);
	}

	//# Disable room
	@Delete(':id')
	@Roles(Role.ADMIN)
	@ApiOperation({ summary: 'Vô hiệu hóa (Soft Delete) phòng' })
	@ApiParam({ name: 'id', description: 'ID của phòng (UUID)', type: String })
	@ApiOkResponse({ description: 'Vô hiệu hóa thành công', type: String })
	@ApiAuthErrors()
	async disableRoom(@Param('id') id: string): Promise<string> {
		return await this.roomService.disableRoom(id);
	}
}
