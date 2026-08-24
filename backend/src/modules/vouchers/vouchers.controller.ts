import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { AuthRoles } from '../../common/decorations/auth-roles.decorator';
import { Role } from '@prisma/client';
import { ApiBadRequestResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiAuthErrors } from '../../common/decorations/api-auth-error.decorator';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { GetUser } from '../../common/decorations/get-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UserVoucherResponseDto, VoucherResponseDto } from './dto/user-voucher-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RoleGuard } from '../../common/guards/role.guard';

@ApiTags('Vouchers')
@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Get('public')
  @ApiOperation({ summary: 'Lấy danh sách các vouchers có thể đổi điểm hoặc public' })
  @Serialize(VoucherResponseDto)
  getPublicVouchers() {
    return this.vouchersService.getPublicVouchers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AuthRoles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Lấy danh sách vouchers của người dùng hiện tại' })
  @ApiAuthErrors()
  @ApiBadRequestResponse()
  @Serialize(UserVoucherResponseDto)
  getUserVouchers(@GetUser() user: UserResponseDto) {
    return this.vouchersService.getUserVouchers(user.id);
  }

  @Post('redeem/:code')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @AuthRoles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Đổi điểm lấy voucher theo mã code' })
  @ApiAuthErrors()
  @ApiBadRequestResponse()
  @Serialize(UserVoucherResponseDto)
  redeemVoucher(@GetUser() user: UserResponseDto, @Param('code') code: string) {
    return this.vouchersService.redeemVoucher(user.id, code);
  }
}
