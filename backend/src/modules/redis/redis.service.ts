import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
	private readonly logger = new Logger(RedisService.name);
	constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

	//# [Generic] Lấy dữ liệu từ cache
	async get<T>(key: string): Promise<T | null> {
		try {
			const value = await this.cacheManager.get<T>(key);
			return value ?? null;
		} catch (error) {
			this.logger.error(`Failed to retrieve cache for key [${key}]: ${(error as Error).message}`);
			return null;
		}
	}

	//# [Generic] Lưu dữ liệu vào cache
	async set<T>(key: string, value: T, ttl?: number): Promise<void> {
		try {
			await this.cacheManager.set(key, value, ttl);
		} catch (error) {
			this.logger.error(`Failed to set cache for key [${key}]: ${(error as Error).message}`);
		}
	}

	//# Xóa một key cụ thể
	async del(key: string): Promise<void> {
		try {
			await this.cacheManager.del(key);
		} catch (error) {
			this.logger.error(`Failed to delete cache for key [${key}]: ${(error as Error).message}`);
		}
	}

	//# Làm sạch toàn bộ cache
	async clear(): Promise<void> {
		try {
			await this.cacheManager.clear();
		} catch (error) {
			this.logger.error(`Failed to clear cache: ${(error as Error).message}`);
		}
	}

	//# Lấy dữ liệu từ cache hoặc fetch nếu không tồn tại
	async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
		const cached = await this.get<T>(key);
		if (cached !== null && cached !== undefined) {
			return cached;
		}

		const data = await fetcher();
		if (data !== null && data !== undefined) {
			await this.set(key, data, ttl);
		}
		return data;
	}
}
