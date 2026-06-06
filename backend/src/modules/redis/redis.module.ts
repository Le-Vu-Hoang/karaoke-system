import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { RedisService } from './redis.service';
import { RedisCacheAsyncOptions } from './interface/redis-cache.interface';

@Global()
@Module({})
export class RedisModule {
	private static readonly logger = new Logger('RedisClient');

	static forRootAsync(options: RedisCacheAsyncOptions): DynamicModule {
		return {
			module: RedisModule,
			imports: [
				CacheModule.registerAsync({
					imports: options.imports,
					inject: options.inject,
					useFactory: async (...args: unknown[]) => {
						if (!options.useFactory) {
							throw new Error('Async configuration is missing a useFactory method.');
						}
						const config = await options.useFactory(...args);

						const store = await redisStore({
							socket: {
								host: config.host,
								port: config.port,
								reconnectStrategy: (retries) => {
									const delay = Math.min(retries * 100, 3000);
									RedisModule.logger.warn(`Retry attempt ${retries} will execute in ${delay}ms`);
									return delay;
								},
							},

							password: config.password,
							ttl: config.ttl || 60000,
							keyPrefix: 'karaoke_app:',
						});

						const client = store.client;

						client.on('connect', () => {
							RedisModule.logger.log('Establishing connection to Redis Server...');
						});

						client.on('ready', () => {
							RedisModule.logger.log(
								`Successfully connected to Redis at ${config.host}:${config.port}`,
							);
						});

						client.on('error', (err: Error) => {
							RedisModule.logger.error(`Redis connection error: ${err.message}`);
						});

						client.on('reconnecting', () => {
							RedisModule.logger.warn('Connection lost!  Reconnecting to Redis Server...');
						});

						client.on('end', () => {
							RedisModule.logger.error('Redis connection has been completely closed.');
						});

						return { store };
					},
				}),
			],
			providers: [RedisService],
			exports: [RedisService, CacheModule],
		};
	}
}
