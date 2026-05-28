import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		if (exception.code === 'P2002') {
			const status = HttpStatus.CONFLICT;

			const targetField = exception.meta?.target
				? (exception.meta.target as string[]).join(', ')
				: 'trường dữ liệu';

			return response.status(status).json({
				statusCode: status,
				error: 'Conflict',
				message: `Dữ liệu tại '${targetField}' đã tồn tại trong hệ thống. Vui lòng chọn giá trị khác.`,
			});
		}

		const defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR;
		return response.status(defaultStatus).json({
			statusCode: defaultStatus,
			message: 'Đã xảy ra lỗi nội bộ cơ sở dữ liệu.',
		});
	}
}
