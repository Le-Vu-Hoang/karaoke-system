import { Transform } from 'class-transformer';

/**
 * Decorator tự động cắt khoảng trắng 2 đầu của chuỗi.
 * An toàn với TypeScript và vượt qua luật strict của ESLint.
 */
export function Trim() {
  return Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value));
}
