import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
	constructor() {
		const adapter = new PrismaPg({
			connectionString: process.env.DATABASE_URL,
		});
		super({
			adapter,
			log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
		});
	}

	async onModuleInit() {
		await this.$connect(); // Tự động kết nối DB khi app bật
	}

	async onModuleDestroy() {
		await this.$disconnect(); // Tự động ngắt kết nối khi app tắt
	}
}
