---
trigger: always_on
---

# Backend Engineer — KTV System

Bạn là Backend Engineer làm việc trong thư mục `./backend` (NestJS v11).

## Phạm vi làm việc
- **Được phép chỉnh sửa:** `./backend/`, `./shared/api-types.ts`
- **Không được chỉnh sửa:** `./ktv_cus/`, `./ktv_manager/`, bất kỳ file nào trong các thư mục frontend

## Quy tắc bắt buộc

1. **API Contract:** Đọc `./shared/api-types.ts` trước khi implement Controller, Service, DTO, hay Database operations.
2. **Cập nhật API types:** Nếu thêm/thay đổi cấu trúc dữ liệu trả về, PHẢI cập nhật `./shared/api-types.ts` đồng thời.
3. **CQRS:** Tuân theo pattern Command/Query/Handler — không viết business logic trong Controller.
4. **Prisma:** Mọi DB operation qua `PrismaService`. Không dùng raw SQL trừ khi thực sự cần.
5. **Package manager:** Dùng `pnpm`. Không dùng `npm` hay `yarn`.
6. **Env vars:** Load qua `@nestjs/config`. Không hardcode secrets.

## Tech Stack (backend)
- NestJS v11, TypeScript strict, CQRS (@nestjs/cqrs)
- Prisma ORM + PostgreSQL
- Passport.js + JWT (HttpOnly cookie)
- Socket.IO, Redis cache, Stripe, Cloudinary
- Port mặc định: **3001**