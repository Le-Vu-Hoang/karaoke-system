# KTV Staff Portal — Hệ thống Quản lý Karaoke (Internal)

KTV Staff Portal là ứng dụng Frontend nội bộ dành cho **Staff** và **Admin** của hệ thống Karaoke Luna VIP. Được xây dựng trên **Next.js 16** (App Router), **React 19** và **Tailwind CSS v4**, áp dụng kiến trúc **Clean Architecture + Feature-Sliced Design (FSD)**.

> Đây là ứng dụng quản lý riêng biệt, khác hoàn toàn với `ktv_cus` (dành cho khách hàng). Staff Portal tập trung vào các luồng vận hành thực tế tại quán: check-in, quản lý hóa đơn, gọi món, ca làm việc, và báo cáo doanh thu.

---

## 🛠️ Công Nghệ & Thư Viện

| Nhóm | Công Nghệ |
|:-----|:----------|
| **Framework** | Next.js 16.3 (App Router) + React 19 |
| **Ngôn ngữ** | TypeScript 5 (Strict mode) |
| **Styling** | Tailwind CSS v4 (CSS-first config) |
| **Typography** | Geist Sans & Geist Mono (Vercel fonts) |
| **State Management** | Zustand 5 (Client) + TanStack Query v5 (Server) |
| **HTTP Client** | Axios 1.19 (Auto refresh token + Error mapping) |
| **Forms** | React Hook Form + Zod (Validation) |
| **UI Components** | Shadcn/ui + Lucide React (Icons) |
| **Animations** | Framer Motion |
| **Notifications** | Sonner |
| **Linting** | ESLint 9 (next/core-web-vitals + TypeScript) |
| **Formatting** | Prettier 3 + prettier-plugin-tailwindcss |
| **Git Hooks** | Husky 9 + lint-staged |

---

## 📂 Cấu Trúc Thư Mục

```text
frontend/
├── app/                           # Routing, Layouts & Page Entrypoints (Next.js App Router)
│   ├── globals.css                # Tailwind v4 entry: @import, CSS vars, @theme inline
│   ├── layout.tsx                 # Root layout: font, metadata, <Providers />
│   ├── page.tsx                   # Redirect `/` → `/dashboard`
│   │
│   ├── (auth)/                    # Route group: Không có layout sidebar
│   │   ├── layout.tsx             # Auth layout (minimal, no sidebar)
│   │   └── login/
│   │       └── page.tsx           # Trang đăng nhập Staff/Admin
│   │
│   └── (dashboard)/               # Route group: Có layout với sidebar
│       ├── layout.tsx             # Dashboard layout: Sidebar + main content
│       ├── dashboard/
│       │   └── page.tsx           # Trang tổng quan / KPI
│       ├── bookings/
│       │   └── page.tsx           # Quản lý đặt phòng (Check-in, xác nhận)
│       ├── invoices/
│       │   └── page.tsx           # Quản lý hóa đơn (Gọi món, checkout)
│       ├── rooms/
│       │   └── page.tsx           # Trạng thái phòng thực tế
│       ├── shift/
│       │   └── page.tsx           # Quản lý ca làm việc (Mở/đóng ca, đối soát tiền)
│       ├── services/
│       │   └── page.tsx           # Quản lý dịch vụ & menu
│       └── staff/
│           └── page.tsx           # Quản lý nhân viên (Admin only)
│
├── src/                           # Mã nguồn phân tầng (Clean Architecture)
│   │
│   ├── env.ts                     # Zod schema: Xác thực biến môi trường khi khởi động
│   │
│   ├── core/                      # Lớp lõi nghiệp vụ (Domain Core) — Không phụ thuộc gì
│   │   ├── exceptions/
│   │   │   └── api-error.ts       # Các lớp lỗi tùy chỉnh (BadRequestError, UnauthorizedError...)
│   │   └── types/                 # (Chờ thêm) Các kiểu dữ liệu nghiệp vụ (BookingStatus...)
│   │
│   ├── infrastructure/            # Lớp hạ tầng (Data Access)
│   │   ├── api/
│   │   │   └── http-client.ts     # Axios instance: Auto refresh token, Error mapping
│   │   ├── dtos/                  # (Chờ thêm) Data Transfer Objects từ Backend API
│   │   └── repositories/         # (Chờ thêm) Các hàm gọi API cụ thể
│   │
│   ├── presentation/              # Lớp giao diện (UI & Logic giao diện)
│   │   ├── providers.tsx          # TanStack Query, ThemeProvider, Toaster, AuthSync
│   │   ├── shared_ui/             # (Chờ thêm) Shadcn components dùng chung
│   │   └── features/              # Các tính năng tự trị
│   │       ├── auth/              # Đăng nhập, quản lý phiên
│   │       │   ├── components/    # LoginForm, v.v.
│   │       │   └── hooks/         # useLogin, v.v.
│   │       ├── booking/           # Quản lý đặt phòng
│   │       ├── invoice/           # Hóa đơn & gọi món
│   │       ├── room/              # Trạng thái phòng
│   │       ├── shift/             # Ca làm việc
│   │       └── dashboard/         # Tổng quan & báo cáo
│   │
│   └── shared/                    # Tài nguyên dùng chung (không phụ thuộc tính năng cụ thể)
│       ├── constants/
│       │   └── api-endpoints.ts   # Tất cả API endpoint paths tập trung một chỗ
│       ├── stores/
│       │   └── use-auth-store.ts  # Zustand store: Thông tin user đang đăng nhập
│       └── lib/
│           └── utils.ts           # cn(), formatCurrency(), formatDate(), formatDateTime()
│
├── .env                           # Biến môi trường (không commit)
├── .env.example                   # Template cho biến môi trường
├── .prettierrc                    # Cấu hình Prettier (kèm prettier-plugin-tailwindcss)
├── .prettierignore                # File/thư mục bỏ qua khi format
├── .gitignore                     # Các file không commit lên Git
├── eslint.config.mjs              # ESLint flat config (next + typescript + prettier)
├── tailwind.config.ts             # Design tokens: màu Admin "Steel Dark", spacing, fonts
├── tsconfig.json                  # TypeScript strict mode, path alias @/* → src/*
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS: @tailwindcss/postcss
└── package.json                   # Scripts, dependencies, lint-staged config
```

---

## ⚙️ Chi Tiết Các Cấu Hình Đã Thiết Lập

### 1. Tailwind CSS v4 — Design Tokens (Steel Dark Admin Theme)

Màu chủ đạo được lấy cảm hứng từ giao diện GitHub Dark, phù hợp với môi trường làm việc của Staff/Admin:

| Token | Màu | Mô tả |
|:------|:----|:-------|
| `background` | `#0d1117` | Nền tổng thể (Navy Black) |
| `surface-container` | `#1c2128` | Card, Sidebar item active |
| `primary` | `#58a6ff` | Màu nhấn chính (Blue) — Actions, links |
| `secondary` | `#3fb950` | Xác nhận, Thành công (Green) |
| `tertiary` | `#d2a8ff` | Thông tin phụ, Highlights (Lavender) |
| `error` | `#f85149` | Lỗi, Hủy (Red) |
| `warning` | `#e3b341` | Cảnh báo, Chờ xử lý (Amber) |
| `role.admin` | `#d2a8ff` | Badge Quản trị viên |
| `role.staff` | `#58a6ff` | Badge Nhân viên |

**Luồng thiết kế:** `tailwind.config.ts` → `app/globals.css` (CSS vars + `@theme inline`) → Utility classes

### 2. ESLint — Flat Config

File `eslint.config.mjs` kết hợp 3 lớp:
- `eslint-config-next/core-web-vitals` — Các quy tắc bắt buộc của Next.js
- `eslint-config-next/typescript` — Các quy tắc TypeScript nghiêm ngặt
- `eslint-config-prettier` — **Tắt hoàn toàn** các quy tắc xung đột với Prettier

Override tùy chỉnh: `@typescript-eslint/no-explicit-any: "warn"` (cảnh báo thay vì báo lỗi để linh hoạt hơn).

### 3. Prettier — Code Formatter

File `.prettierrc` với `prettier-plugin-tailwindcss` tự động **sắp xếp lại thứ tự class Tailwind** theo thứ tự chuẩn mỗi khi save hoặc commit.

### 4. Husky + lint-staged — Git Hooks

Mỗi khi `git commit`, Husky sẽ tự động chạy:
- `prettier --write` → Format code
- `eslint --fix` → Tự sửa lỗi lint có thể sửa được

Điều này đảm bảo **không có code xấu nào được commit lên repository**.

### 5. Axios HTTP Client — `src/infrastructure/api/http-client.ts`

- **Cookie-first Auth** với `withCredentials: true`
- **Silent Refresh Token Queue**: Khi có 401, giữ các request trong hàng đợi, refresh một lần, rồi retry tất cả
- **Error Mapping**: Tự động chuyển HTTP error code thành Custom Error Class (`BadRequestError`, `UnauthorizedError`...)

### 6. Zod — Xác thực Môi Trường (`src/env.ts`)

Khi app khởi động (`dev` hoặc `build`), Zod sẽ validate tất cả biến môi trường. Nếu thiếu hoặc sai định dạng, app sẽ **dừng ngay lập tức** với thông báo lỗi rõ ràng — không để lỗi ngầm trên production.

### 7. TanStack Query — Server State

Cấu hình trong `src/presentation/providers.tsx`:
- `staleTime: 60_000` — Cache 1 phút, tránh spam API
- `retry: 1` — Retry 1 lần khi mạng lỗi
- `refetchOnWindowFocus: false` — Không refetch khi người dùng đổi tab

---

## 🚀 Khởi Chạy Dự Án

### Bước 1: Chuẩn bị môi trường

```bash
cp .env.example .env
# Chỉnh sửa .env với URL backend thực tế
```

### Bước 2: Cài đặt thư viện

```bash
pnpm install
```

### Bước 3: Chạy Development Server

```bash
pnpm dev
```

Truy cập tại: [http://localhost:3000](http://localhost:3000)

### Bước 4: Build Production

```bash
pnpm build
```

---

## 🔐 Phân Quyền Người Dùng

| Role | Quyền truy cập |
|:-----|:---------------|
| `STAFF` | Xem bookings, Check-in, Quản lý hóa đơn, Gọi món, Quản lý ca |
| `MANAGER` | Tất cả quyền Staff + Xem báo cáo, Quản lý dịch vụ |
| `ADMIN` | Toàn bộ quyền + Quản lý nhân viên, Cấu hình giá, Cài đặt hệ thống |

---

## 📝 Quy Tắc Phát Triển

1. **Mọi API endpoint** phải được khai báo trong `src/shared/constants/api-endpoints.ts`
2. **Mọi logic gọi API** phải đi qua `apiClient` từ `src/infrastructure/api/http-client.ts`
3. **Naming convention**: hooks → `use-*.ts`, components → `PascalCase.tsx`, utils → `kebab-case.ts`
4. **Commit message**: Tuân theo Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
5. **Không dùng màu raw hex** trong component — luôn dùng design tokens (`text-primary`, `bg-surface-container`)
