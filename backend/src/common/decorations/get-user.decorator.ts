//? Custom decorater to extract user information from the request

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../modules/auth/interfaces/jwt-payload.interface';
import { RequestWithUser } from '../../modules/auth/interfaces/req-w-user.interface';

export const GetUser = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<RequestWithUser>();
	const user = request.user;

	return data ? user?.[data] : user;
});
