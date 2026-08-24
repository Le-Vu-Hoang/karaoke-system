import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/role.guard';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { AuthRoles } from '../../common/decorations/auth-roles.decorator';
import { Role } from '@prisma/client';
import { ApiPaginatedResponse } from '../../common/decorations/api-paginated-response.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GetUser } from '../../common/decorations/get-user.decorator';
import { UpdateUserInfoDto } from './dto/update-info.dto';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@UseGuards(RoleGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //# Get current user profile
  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân của người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    type: UserResponseDto,
  })
  @ApiAuthErrors()
  @Serialize(UserResponseDto)
  async getMe(@GetUser('id') userId: string) {
    return await this.usersService.findOne(userId);
  }

  //# Get user profile
  @Get(':id')
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một người dùng theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    type: UserResponseDto,
  })
  @ApiAuthErrors()
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng với ID này' })
  @Serialize(UserResponseDto)
  async getUser(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }

  //# Get all user
  @Get()
  @AuthRoles(Role.ADMIN)
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng (Có phân trang)' })
  @ApiPaginatedResponse(UserResponseDto)
  @ApiAuthErrors()
  async getAllUsers(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    return await this.usersService.findAll(query);
  }

  //# Update current user profile
  @Patch('me')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân của người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thông tin thành công',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ (Validation Error)' })
  @ApiAuthErrors()
  async updateUserInfo(@GetUser('id') userId: string, @Body() body: UpdateUserInfoDto): Promise<UserResponseDto> {
    return await this.usersService.updateCurrentUser(userId, body);
  }

  //# Change password
  @Patch('me/password')
  @ApiOperation({ summary: 'Đổi mật khẩu cho người dùng hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Đổi mật khẩu thành công',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ (Mật khẩu không đủ mạnh)',
  })
  @ApiAuthErrors()
  async changePassword(@GetUser('id') userId: string, @Body() body: ChangePasswordDto): Promise<string> {
    return await this.usersService.changePassword(userId, body);
  }
}
