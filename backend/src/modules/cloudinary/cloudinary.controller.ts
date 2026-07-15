import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CloudinaryService } from './cloudinary.service';

@ApiTags('Cloudinary (Upload ảnh)')
@ApiBearerAuth('JWT')
@Controller('cloudinary')
export class CloudinaryController {
	constructor(private readonly cloudinaryService: CloudinaryService) {}

	@Post('upload')
	@ApiOperation({ summary: 'Tải ảnh lên Cloudinary' })
	@ApiConsumes('multipart/form-data')
	@ApiQuery({
		name: 'folder',
		required: false,
		description: 'Tên thư mục con (ví dụ: user, service, category, room)',
		example: 'user',
	})
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'Upload thành công, trả về URL của ảnh',
		schema: {
			example: {
				url: 'https://res.cloudinary.com/....jpg',
				publicId: 'ktv_system/...',
			},
		},
	})
	@UseInterceptors(FileInterceptor('file'))
	async uploadImage(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
		if (!file) {
			throw new BadRequestException('Vui lòng chọn file ảnh để upload');
		}

		if (!file.mimetype.startsWith('image/')) {
			throw new BadRequestException('Chỉ cho phép upload file định dạng hình ảnh');
		}

		if (file.size > 5 * 1024 * 1024) {
			throw new BadRequestException('Kích thước ảnh không được vượt quá 5MB');
		}

		const targetFolder = folder ? folder.trim() : 'general';
		const result = await this.cloudinaryService.uploadFile(file, targetFolder);

		return {
			url: result.secure_url,
			publicId: result.public_id,
		};
	}
}
