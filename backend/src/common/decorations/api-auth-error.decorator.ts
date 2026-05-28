import { applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

export function ApiAuthErrors(
	unauthorizedMsg = 'Chưa xác thực (Thiếu, sai hoặc Token đã hết hạn)',
	forbiddenMsg = 'Không có quyền truy cập (Tài khoản không đủ thẩm quyền)',
) {
	return applyDecorators(
		ApiUnauthorizedResponse({ description: unauthorizedMsg }),
		ApiForbiddenResponse({ description: forbiddenMsg }),
	);
}
