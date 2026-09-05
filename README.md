# K-Master: Karaoke Management System

K-Master là một hệ sinh thái quản lý Karaoke toàn diện, được thiết kế để số hóa toàn bộ quy trình vận hành từ đặt phòng, quản lý dịch vụ tại bàn, thanh toán, đến đối soát ca làm việc và kiểm soát kho hàng theo thời gian thực. Dự án áp dụng kiến trúc monorepo với các tiêu chuẩn công nghệ hiện đại, sẵn sàng cho môi trường thực tế và có khả năng mở rộng cao.

## Tính Năng Chính

- **Smart Booking:** Giao diện đặt phòng trực quan cho phép khách hàng chọn loại phòng, khung giờ, thời lượng và dịch vụ kèm theo. Hỗ trợ đặt trước trực tuyến và nhận phòng vãng lai (walk-in).
- **Real-time Room Management:** Sơ đồ phòng trực tiếp với trạng thái cập nhật tức thì qua WebSocket (Trống / Đang hát / Chờ dọn dẹp / Bảo trì). Đồng hồ đếm thời gian hát và tạm tính tiền theo giây.
- **In-Room Services:** Menu điện tử tại bàn, dữ liệu gọi món đồng bộ trực tiếp xuống bộ phận bếp/quầy bar. Hệ thống chuông gọi nhân viên theo thời gian thực (urgent/normal).
- **Dynamic Pricing:** Công cụ tính giá linh hoạt theo loại phòng, ngày trong tuần và khung giờ, tự động áp dụng giá cơ bản khi không có rule đặc biệt.
- **Invoice & Checkout:** Tạo hóa đơn tự động khi nhận phòng, ghi nhận dịch vụ sử dụng, tính chiết khấu membership và voucher, kết thúc phiên hát và thanh toán.
- **Payment Integration:** Hỗ trợ đa cổng thanh toán: Stripe, MoMo, VNPay với xử lý webhook và đối soát tự động theo mô hình CQRS.
- **Shift Reconciliation:** Quản lý ca làm việc của nhân viên, theo dõi tiền mặt trong két, đối soát doanh thu cuối ca.
- **Inventory Control:** Quản lý kho hàng, nhà cung cấp, đơn nhập hàng, tự động trừ tồn kho khi sử dụng dịch vụ. Ghi nhận lịch sử xuất nhập theo loại (Import / Sale / Damage).
- **Loyalty & Vouchers:** Hệ thống tích điểm, phân hạng thành viên (Silver / Gold / Platinum), đổi điểm lấy voucher và áp dụng khi thanh toán.
- **QR Code Login:** Đăng nhập nhanh bằng cách quét mã QR từ điện thoại, xác thực phiên làm việc trên màn hình desktop theo thời gian thực qua Socket.IO.

## Kiến Trúc Dự Án

```
KTV-System/
├── backend/          # NestJS v11 — REST API + WebSocket (port 3001)
├── ktv_cus/          # Next.js 16 — Customer Frontend (port 3000)
├── ktv_manager/      # Next.js 16 — Staff/Admin Frontend (port 3002)
├── shared/           # TypeScript types & API contract dùng chung
├── docker-compose.yml
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

| Thư mục | Vai trò | Port |
|---|---|---|
| `backend/` | NestJS v11 REST API + WebSocket Gateway | 3001 |
| `ktv_cus/` | Next.js — Giao diện khách hàng | 3000 |
| `ktv_manager/` | Next.js — Giao diện quản lý (Staff/Admin) | 3002 |
| `shared/` | TypeScript interfaces dùng chung (API contract) | — |

## Tech Stack

### Backend

| Thành phần | Công nghệ |
|---|---|
| Framework | NestJS v11 (TypeScript, strict mode) |
| ORM & Database | Prisma v7 (multi-file schema) + PostgreSQL 17 |
| Caching | Redis 7 via cache-manager |
| Authentication | Passport.js + JWT (Access & Refresh Token, HttpOnly Cookie) |
| OAuth | Google, Facebook |
| Real-time | Socket.IO (WebSocket Gateway) |
| Payment | Stripe, MoMo, VNPay (CQRS + Strategy Pattern) |
| File Storage | Cloudinary SDK |
| Scheduling | NestJS Schedule (Cron jobs) |
| Validation | class-validator, class-transformer, Joi (env) |
| API Docs | Swagger / OpenAPI 3.0 tại `/api/docs` |

### Frontend (Customer & Manager)

| Thành phần | Công nghệ |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 + Shadcn/ui (Neon Pulse theme) |
| Animations | Framer Motion |
| Server State | TanStack React Query v5 |
| Client State | Zustand 5 (persist middleware) |
| HTTP Client | Axios (centralized instance, silent refresh queue) |
| Real-time | Socket.IO Client |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Toast | Sonner |

## Cấu Trúc Backend

```
backend/src/
├── main.ts                # Application entrypoint
├── app.module.ts          # Root module
├── common/                # Guards, Decorators, Filters, Interceptors
├── prisma/                # PrismaModule & PrismaService
├── script/                # Database seeding scripts
└── modules/
    ├── auth/              # Đăng nhập, JWT, OAuth, QR Gateway
    ├── users/             # Profile, quản lý user, loyalty
    ├── room/              # Room types, rooms, trạng thái, WebSocket Gateway
    ├── booking/           # Đặt phòng, check-in, walk-in, cron tự động hủy
    ├── pricing/           # Quy tắc tính giá động theo thời gian
    ├── invoice/           # Hóa đơn, gọi món tại phòng, checkout
    ├── services/          # Danh mục dịch vụ, menu đồ ăn & nước uống
    ├── inventory/         # Nhà cung cấp, đơn nhập hàng, log tồn kho
    ├── payment/           # CQRS: Stripe, MoMo, VNPay strategies & webhooks
    ├── shift/             # Ca làm việc, đối soát két tiền
    ├── vouchers/          # Voucher catalog, đổi điểm
    ├── equipment/         # Thiết bị theo phòng, bảo trì
    ├── redis/             # Global Redis caching module
    └── cloudinary/        # Upload ảnh/media
```

## Cấu Trúc Frontend

Cả hai ứng dụng frontend đều áp dụng mô hình **Clean Architecture** kết hợp **Feature-Sliced Design**:

```
ktv_cus/ (hoặc ktv_manager/)
├── app/                           # Next.js App Router — Routes & Layouts
│   ├── (auth)/                    # Route group xác thực
│   ├── (public)/ hoặc (dashboard)/ # Route group chính
│   ├── globals.css                # Tailwind v4 theme, Neon Pulse CSS variables
│   └── layout.tsx                 # Root layout
│
├── src/
│   ├── core/                      # Domain layer — Exceptions, Types
│   ├── infrastructure/            # API client, DTOs, Repositories
│   ├── presentation/
│   │   ├── features/              # Feature modules (auth, booking, dashboard, ...)
│   │   └── shared_ui/             # Shadcn/ui components tái sử dụng
│   └── shared/                    # Constants, utilities, Zustand stores
│
├── middleware.ts                  # Edge Route Guard (cookie-based)
└── components.json                # Shadcn CLI configuration
```

### Trang Customer App (ktv_cus — port 3000)

| Route | Chức năng |
|---|---|
| `/` | Trang chủ — Hero, featured rooms, khuyến mãi, đặt nhanh |
| `/rooms` | Khám phá loại phòng, giá và tiện ích |
| `/services` | Catalog đồ ăn & nước uống (ISR, tìm kiếm, giỏ hàng) |
| `/booking` | Quy trình đặt phòng nhiều bước (chọn phòng, giờ, thanh toán) |
| `/booking/success` | Trang kết quả thanh toán VNPay |
| `/auth` | Đăng nhập / Đăng ký / QR Login |
| `/scan-qr` | Quét mã QR từ camera điện thoại |
| `/profile` | Thông tin cá nhân, hạng thành viên, điểm tích lũy |
| `/profile/history` | Lịch sử đặt phòng |
| `/profile/memberships` | Phân hạng và quyền lợi thành viên |
| `/profile/vouchers` | Ví voucher & đổi điểm |

### Trang Manager App (ktv_manager — port 3002)

| Route | Chức năng |
|---|---|
| `/login` | Đăng nhập nhân viên (mật khẩu hoặc QR) |
| `/` | Dashboard — Sơ đồ phòng trực tiếp, check-in, yêu cầu dịch vụ, trạng thái ca |
| `/bookings` | Quản lý đặt phòng (đang phát triển) |
| `/rooms` | Quản lý phòng chi tiết (đang phát triển) |
| `/invoices` | Hóa đơn & gọi món (đang phát triển) |
| `/services` | Quản lý dịch vụ & menu (đang phát triển) |
| `/shift` | Đối soát ca làm việc (đang phát triển) |
| `/staff` | Quản lý nhân viên - Admin (đang phát triển) |

## Bảo Mật

- JWT dual-token: Access Token (30 phút) + Refresh Token (7 ngày), lưu trong HttpOnly Cookie.
- Global Auth Guard: Tất cả endpoint được bảo vệ mặc định, chỉ mở bằng decorator `@Public()`.
- Role-Based Access Control (RBAC): Phân quyền theo 3 role — CUSTOMER, STAFF, ADMIN.
- Password hashing với bcrypt.
- Input validation: Global ValidationPipe với whitelist và forbidNonWhitelisted.
- CORS cấu hình cho các origin cụ thể với credentials.
- Silent token refresh: Khi access token hết hạn, frontend tự động refresh và retry request mà người dùng không bị gián đoạn.

## Hạ Tầng (Docker)

File `docker-compose.yml` định nghĩa 2 service chạy trên Docker:

| Service | Image | Port | Mô tả |
|---|---|---|---|
| PostgreSQL | `postgres:17-alpine` | 5432 | Database chính, database name: `ktv_local_db` |
| Redis | `redis:7-alpine` | 4924 | Cache & session, password protected, maxmemory 256MB |

Cả hai service đều có healthcheck và restart policy `unless-stopped`.

## Yêu Cầu Hệ Thống

- Node.js phiên bản 25 trở lên
- Docker (để chạy PostgreSQL và Redis)
- pnpm (package manager bắt buộc)

## Cài Đặt & Chạy Dự Án

### 1. Khởi động hạ tầng

```bash
docker compose up -d
```

### 2. Cài đặt dependencies

```bash
pnpm install
```

### 3. Chạy backend

```bash
cd backend
pnpm run start:dev
```

Backend sẽ chạy tại `http://localhost:3001`. API docs tại `http://localhost:3001/api/docs`.

### 4. Chạy frontend

```bash
# Customer app
cd ktv_cus
pnpm run dev

# Manager app
cd ktv_manager
pnpm run dev
```

Customer app tại `http://localhost:3000`, Manager app tại `http://localhost:3002`.

## Chạy Tests

```bash
cd backend

# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

## API Documentation

Swagger UI được tự động tạo tại `/api/docs` khi chạy backend. Hỗ trợ Bearer Auth để test trực tiếp trên giao diện.

Global API prefix: `/api/v1`

## Shared API Contract

File `shared/api-types.ts` là single source of truth cho các TypeScript interfaces dùng chung giữa backend và frontend:

```typescript
// Standard response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Paginated response
interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

Mọi thay đổi API structure phải cập nhật file này trước khi implement ở backend hoặc frontend.

## Workspace Configuration

Dự án sử dụng pnpm workspace với cấu hình:

```yaml
packages:
  - "backend"
  - "ktv_cus"
  - "ktv_manager"
  - "shared"
```

## License

Private — All rights reserved.
