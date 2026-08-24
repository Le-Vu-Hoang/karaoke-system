import { ModuleMetadata } from '@nestjs/common';

export interface RedisCacheOptions {
  host: string;
  port: number;
  password?: string;
  ttl?: number;
}

export interface RedisCacheAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory?: (...args: any[]) => Promise<RedisCacheOptions> | RedisCacheOptions;
}
