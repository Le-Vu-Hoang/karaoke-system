import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export function Serialize(dto: ClassConstructor<unknown>) {
	return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
	constructor(private dto: ClassConstructor<unknown>) {}

	intercept(context: ExecutionContext, handler: CallHandler): Observable<unknown> {
		return handler.handle().pipe(
			map((response: unknown) => {
				if (response !== null && typeof response === 'object' && 'data' in response && 'meta' in response) {
					const paginatedResponse = response as { data: unknown[]; meta: unknown };

					return {
						...paginatedResponse,
						data: plainToInstance(this.dto, paginatedResponse.data, {
							excludeExtraneousValues: true,
						}),
					};
				}

				return plainToInstance(this.dto, response, {
					excludeExtraneousValues: true,
				});
			}),
		);
	}
}
