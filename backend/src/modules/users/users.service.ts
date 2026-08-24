import { PrismaService } from '../../prisma/prisma.service';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationQueryDto } from '../../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserInfoDto } from './dto/update-info.dto';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  //# Find user with id
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        role: true,
        membershipTier: true,
        loyaltyPoints: true,
        totalSpent: true,
        membershipTierId: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //# Find many users with pagination
  async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
          email: true,
          role: true,
          imageUrl: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      data: data as UserResponseDto[],
      meta: {
        total,
        page,
        limit,
        lastPage,
        hasNextPage: page < lastPage,
        hasPreviousPage: page > 1,
      },
    };
  }

  //# Update profile user
  async updateCurrentUser(userId: string, body: UpdateUserInfoDto): Promise<UserResponseDto> {
    const { fullName, phoneNumber, email, imageUrl } = body;

    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    if (phoneNumber && phoneNumber !== currentUser.phoneNumber) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phoneNumber: phoneNumber },
      });

      if (existingPhone) {
        throw new ConflictException('This phone number is already registered by another account.');
      }
    }

    if (email && email !== currentUser.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: email },
      });

      if (existingEmail) {
        throw new ConflictException('This email is already registered by another account.');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName: fullName }),
        ...(phoneNumber && { phoneNumber: phoneNumber }),
        ...(email && { email: email }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl }),
      },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        email: true,
        role: true,
        imageUrl: true,
        createdAt: true,
      },
    }) as unknown as UserResponseDto;
  }

  //# Change password
  async changePassword(userId: string, body: ChangePasswordDto): Promise<string> {
    const { oldPassword, newPassword, confirmPassword } = body;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        passwordHash: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.passwordHash) {
      throw new BadRequestException('Account registered via OAuth does not have a password');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new ConflictException('Old password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return 'Password changed successfully';
  }

  //# Find user by email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
