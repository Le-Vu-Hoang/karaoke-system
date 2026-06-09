import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';

const mockUser = {
	id: 'user-id-1',
	fullName: 'John Doe',
	email: 'john@example.com',
	phoneNumber: '1234567890',
	role: Role.CUSTOMER,
	createdAt: new Date(),
};

const mockUsersService = {
	findOne: jest.fn(),
	findAll: jest.fn(),
	updateCurrentUser: jest.fn(),
	changePassword: jest.fn(),
};

describe('UsersController', () => {
	let controller: UsersController;
	let service: typeof mockUsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{ provide: UsersService, useValue: mockUsersService },
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
		service = module.get(UsersService);
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('getUser', () => {
		it('should return a user', async () => {
			service.findOne.mockResolvedValue(mockUser);
			const result = await controller.getUser('user-id-1');
			expect(result).toEqual(mockUser);
			expect(service.findOne).toHaveBeenCalledWith('user-id-1');
		});
	});

	describe('getAllUsers', () => {
		it('should return paginated users', async () => {
			const query = { page: 1, limit: 10 };
			const mockPaginatedResponse = {
				data: [mockUser],
				meta: {
					total: 1,
					page: 1,
					limit: 10,
					lastPage: 1,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			};
			service.findAll.mockResolvedValue(mockPaginatedResponse);

			const result = await controller.getAllUsers(query);
			expect(result).toEqual(mockPaginatedResponse);
			expect(service.findAll).toHaveBeenCalledWith(query);
		});
	});

	describe('updateUserInfo', () => {
		it('should update and return user info', async () => {
			const updateDto = { fullName: 'Jane Doe' };
			const updatedUser = { ...mockUser, ...updateDto };
			service.updateCurrentUser.mockResolvedValue(updatedUser);

			const result = await controller.updateUserInfo('user-id-1', updateDto);
			expect(result).toEqual(updatedUser);
			expect(service.updateCurrentUser).toHaveBeenCalledWith('user-id-1', updateDto);
		});
	});

	describe('changePassword', () => {
		it('should change password successfully', async () => {
			const changePasswordDto = {
				oldPassword: 'old_password',
				newPassword: 'new_password',
				confirmPassword: 'new_password',
			};
			const successMessage = 'Password changed successfully';
			service.changePassword.mockResolvedValue(successMessage);

			const result = await controller.changePassword('user-id-1', changePasswordDto);
			expect(result).toEqual(successMessage);
			expect(service.changePassword).toHaveBeenCalledWith('user-id-1', changePasswordDto);
		});
	});
});
