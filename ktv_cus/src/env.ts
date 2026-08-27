import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z
        .string({
            message: 'NEXT_PUBLIC_API_URL là bắt buộc',
        })
        .url({
            message: 'NEXT_PUBLIC_API_URL phải là một URL hợp lệ (e.g. http://localhost:3000)',
        }),

    NEXT_PUBLIC_BACKEND_URL: z
        .string({
            message: 'BACKEND_URL là bắt buộc',
        })
        .url({
            message: 'BACKEND_URL phải là một URL hợp lệ (e.g. http://localhost:3001/api/v1)',
        })
        .optional(),

    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .optional()
        .default('development'),
});

const processEnv = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NODE_ENV: process.env.NODE_ENV || 'development',
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    const errors = parsed.error.format();

    console.error('\n==========================================');
    console.error('LỖI CẤU HÌNH BIẾN MÔI TRƯỜNG (.env):');
    console.error(JSON.stringify(errors, null, 2));
    console.error('==========================================\n');

    if (typeof window === 'undefined') {
        process.exit(1);
    } else {
        throw new Error('Cấu hình biến môi trường (.env) không hợp lệ.');
    }
}

export const env = parsed.data;