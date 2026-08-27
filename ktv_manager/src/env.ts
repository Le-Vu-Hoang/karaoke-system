import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().url("NEXT_PUBLIC_BACKEND_URL must be a valid URL"),
  NEXT_PUBLIC_APP_NAME: z.string().default("KTV Staff Portal"),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
