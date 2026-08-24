import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { CloseShiftDto } from './dto/close-shift.dto';
import { ShiftQueryDto } from './dto/shift-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../../common/guards/role.guard';
import { AuthRoles } from '../../common/decorations/auth-roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../common/decorations/get-user.decorator';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { ShiftResponseDto } from './dto/shift-response.dto';

@ApiTags('Shifts')
@ApiBearerAuth('JWT')
@UseGuards(RoleGuard)
@Controller('shifts')
@Serialize(ShiftResponseDto)
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post('open')
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Mở ca làm việc mới' })
  @ApiResponse({ status: 201, description: 'Mở ca thành công.' })
  @ApiAuthErrors()
  openShift(@GetUser('id') staffId: string, @Body() createShiftDto: CreateShiftDto) {
    return this.shiftService.openShift(staffId, createShiftDto);
  }

  @Post(':id/close')
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Đóng ca làm việc hiện tại' })
  @ApiResponse({ status: 200, description: 'Đóng ca thành công.' })
  @ApiAuthErrors()
  closeShift(@Param('id') id: string, @GetUser('id') staffId: string, @Body() closeShiftDto: CloseShiftDto) {
    return this.shiftService.closeShift(id, staffId, closeShiftDto);
  }

  @Get()
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Lấy danh sách ca làm việc' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công.' })
  @ApiAuthErrors()
  findAll(@Query() query: ShiftQueryDto, @GetUser('role') role: string, @GetUser('id') staffId: string) {
    return this.shiftService.findAll(query, role, staffId);
  }

  @Get(':id')
  @AuthRoles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Lấy chi tiết một ca làm việc' })
  @ApiResponse({ status: 200, description: 'Thành công.' })
  @ApiAuthErrors()
  findOne(@Param('id') id: string, @GetUser('role') role: string, @GetUser('id') staffId: string) {
    return this.shiftService.findOne(id, role, staffId);
  }
}
