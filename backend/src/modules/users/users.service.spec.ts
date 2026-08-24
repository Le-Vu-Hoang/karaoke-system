import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

jest.mock('bcrypt');

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
};

const mockUser = {
  id: 'user-id-1',
  fullName: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '1234567890',
  role: Role.CUSTOMER,
  createdAt: new Date(),
  passwordHash: 'hashed_password',
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findOne('user-id-1');
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
        select: { id: true, fullName: true, email: true, phoneNumber: true, role: true, createdAt: true },
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const query = { page: 1, limit: 10 };
      prisma.user.findMany.mockResolvedValue([mockUser]);
      prisma.user.count.mockResolvedValue(1);

      const result = await service.findAll(query);

      expect(result.data).toEqual([mockUser]);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        lastPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });

  describe('updateCurrentUser', () => {
    const updateDto = { fullName: 'Jane Doe', phoneNumber: '0987654321', email: 'jane@example.com' };

    it('should update and return the user', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUser); // currentUser
      prisma.user.findUnique.mockResolvedValueOnce(null); // existingPhone
      prisma.user.findUnique.mockResolvedValueOnce(null); // existingEmail
      prisma.user.update.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.updateCurrentUser('user-id-1', updateDto);
      expect(result.fullName).toEqual('Jane Doe');
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(service.updateCurrentUser('invalid-id', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if phone number is taken', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'other-id' }); // phone taken
      await expect(service.updateCurrentUser('user-id-1', updateDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if email is taken', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      prisma.user.findUnique.mockResolvedValueOnce(null); // phone not taken
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'other-id' }); // email taken
      await expect(service.updateCurrentUser('user-id-1', updateDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      oldPassword: 'old_password',
      newPassword: 'new_password',
      confirmPassword: 'new_password',
    };

    it('should change password successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      prisma.user.update.mockResolvedValue(mockUser);

      const result = await service.changePassword('user-id-1', changePasswordDto);
      expect(result).toEqual('Password changed successfully');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id-1' },
        data: { passwordHash: 'new_hashed_password' },
      });
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const invalidDto = { ...changePasswordDto, confirmPassword: 'wrong' };
      await expect(service.changePassword('user-id-1', invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.changePassword('invalid-id', changePasswordDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if old password is incorrect', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.changePassword('user-id-1', changePasswordDto)).rejects.toThrow(ConflictException);
    });
  });
});
