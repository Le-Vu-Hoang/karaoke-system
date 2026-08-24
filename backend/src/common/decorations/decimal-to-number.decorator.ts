import { Transform } from 'class-transformer';

/**
 * Decorator tự động chuyển đổi kiểu Decimal của Prisma thành kiểu Number cho Frontend.
 * An toàn với TypeScript và vượt qua luật strict của ESLint.
 */
export function DecimalToNumber() {
  return Transform(({ value }: { value: unknown }): number => {
    // Ép kiểu ép an toàn để tránh ESLint báo lỗi unsafe-member-access
    const val = value as { toNumber?: () => number };

    if (val && typeof val.toNumber === 'function') {
      return Number(val.toNumber());
    }

    return Number(value) || 0;
  });
}
