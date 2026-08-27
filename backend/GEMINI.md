# Backend — NestJS Rules

> Agent làm việc tại thư mục này: đọc các rules đặc thù cho NestJS backend.

## Quick Reference

- **Framework:** NestJS v11, TypeScript strict
- **Port:** 3001
- **Package manager:** `pnpm`
- **ORM:** Prisma + PostgreSQL
- **Pattern:** CQRS (Command/Query/Handler)

## Lệnh thường dùng

```bash
# Development
pnpm start:dev

# Generate Prisma Client (SAU KHI thay đổi schema)
npx prisma generate

# Migrations
npx prisma migrate dev --name <tên-migration>

# Seed database
npx prisma db seed

# Lint check
pnpm lint
```

## Cấu trúc module chuẩn

```
src/modules/<feature>/
├── <feature>.module.ts
├── <feature>.controller.ts      # HTTP routing chỉ
├── commands/                    # Write operations
│   ├── create-<feature>.command.ts
│   └── create-<feature>.handler.ts
├── queries/                     # Read operations
│   ├── get-<feature>.query.ts
│   └── get-<feature>.handler.ts
├── dto/
│   ├── create-<feature>.dto.ts
│   └── update-<feature>.dto.ts
└── events/                      # Side effects
    └── <feature>-created.event.ts
```

## Quy tắc CQRS

- Controller chỉ dispatch Command/Query — không chứa business logic
- Handler chứa toàn bộ business logic
- Event dùng cho side effects (email, notification, cache invalidation)
- Không inject service trực tiếp vào controller khi có CQRS

## Prisma

- Inject qua `PrismaService` (singleton global module)
- Dùng `prisma.$transaction()` cho multi-step writes
- Không dùng `findUnique` khi cần nhiều record — dùng `findMany`

## Skill khuyến nghị

Dùng skill `nestjs-expert` khi: debug CQRS, Prisma issues, WebSocket, Auth.
Dùng skill `stripe-best-practices` khi: làm việc với payment.
Dùng skill `typescript-rules` khi: gặp TypeScript errors phức tạp.
