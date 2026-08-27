---
name: ktv-guidelines
description: >-
  Luna Karaoke Customer Frontend Development Guide — architecture, design system (Neon Pulse),
  coding conventions, and feature patterns for the ktv_cus Next.js app. Activate when working
  on the customer-facing frontend (components, hooks, stores, routing, API calls).
---

# Luna Karaoke — Customer Frontend Development Guide

> Hướng dẫn phát triển dành cho dự án **KTV_FE_CUS** (ktv_cus).
> Đây là ứng dụng giao diện khách hàng của hệ thống đặt phòng Karaoke **Luna Karaoke**.

---

## 1. Tổng Quan Dự Án

**Tên ứng dụng:** Luna Karaoke — Hệ Thống Đặt Phòng Karaoke VIP
**Mô tả:** Giao diện dành cho khách hàng để duyệt phòng, đặt phòng, đặt dịch vụ, quản lý tài khoản cá nhân, và quét QR.
**Ngôn ngữ giao diện:** Tiếng Việt (lang="vi")
**Chủ đề mặc định:** Dark mode (Neon Pulse theme)

### Backend Liên Kết

- Backend: NestJS REST API (`/api/v1`)
- Xác thực: Cookie-based JWT (HttpOnly) với cơ chế tự động refresh token
- Ảnh: Cloudinary, Google Avatar, Unsplash

---

## 2. Tech Stack

| Danh mục            | Công nghệ                                              |
| ------------------- | ------------------------------------------------------- |
| Framework           | **Next.js 16** (App Router, React Server Components)    |
| UI Library          | **React 19**                                            |
| Language            | **TypeScript 5** (strict mode)                          |
| Styling             | **Tailwind CSS v4** + **Shadcn/ui** (style: base-nova)  |
| State Management    | **Zustand** (persist middleware cho client state)        |
| Server State        | **TanStack React Query v5**                             |
| HTTP Client         | **Axios** (instance tập trung, interceptors)            |
| Forms               | **React Hook Form** + **Zod** (schema validation)       |
| Animations          | **Framer Motion**                                       |
| Icons               | **Lucide React**                                        |
| Notifications       | **Sonner** (toast)                                      |
| Fonts               | **Sora** (headings), **Hanken Grotesk** (body), **Geist Mono** (code) |
| Realtime            | **Socket.IO Client** (QR login flow)                    |
| Package Manager     | **pnpm** (workspace)                                    |
| Linting             | **ESLint 9** (next/core-web-vitals + typescript)        |
| Formatting          | **Prettier** + **Husky** + **lint-staged**               |

---

## 3. Cấu Trúc Thư Mục (Clean Architecture)

```
ktv_cus/
├── app/                          # Next.js App Router (routes & layouts)
│   ├── (auth)/                   #   Route group: đăng nhập, đăng ký
│   ├── (public)/                 #   Route group: trang chủ, duyệt phòng/dịch vụ
│   ├── (custommer)/              #   Route group: booking, profile, scan-qr (cần auth)
│   ├── globals.css               #   CSS variables, Tailwind theme, typography utilities
│   └── layout.tsx                #   Root layout (fonts, providers, metadata)
│
├── src/                          # Mã nguồn chính, tổ chức theo Clean Architecture
│   ├── core/                     #   ⬛ DOMAIN LAYER — types & exceptions thuần túy
│   │   ├── types/                #     Domain types (ApiResponse, Pagination, ...)
│   │   └── exceptions/           #     Custom error classes (ApiError hierarchy)
│   │
│   ├── infrastructure/           #   🔧 INFRASTRUCTURE LAYER — giao tiếp bên ngoài
│   │   ├── api/                  #     HTTP client (Axios instance, interceptors, refresh token)
│   │   ├── dtos/                 #     Data Transfer Objects (request/response shapes)
│   │   └── repositories/         #     Repository functions gọi API (auth, room, booking, ...)
│   │
│   ├── presentation/             #   🎨 PRESENTATION LAYER — giao diện người dùng
│   │   ├── features/             #     Feature modules (auth, home, room, booking, profile, service)
│   │   │   └── <feature>/
│   │   │       ├── components/   #       React components riêng cho feature
│   │   │       ├── hooks/        #       Custom hooks (useQuery/useMutation wrappers)
│   │   │       └── store/        #       Zustand store riêng feature (nếu có)
│   │   ├── shared_ui/            #     Shadcn/ui components (button, dialog, input, header, footer, ...)
│   │   └── providers.tsx         #     QueryClientProvider + Toaster + Auth hydration
│   │
│   ├── shared/                   #   🔗 SHARED LAYER — code dùng chung
│   │   ├── constants/            #     API endpoints, magic values
│   │   ├── lib/                  #     Utility functions (cn, ...)
│   │   ├── stores/               #     Global Zustand stores (auth, cart, theme)
│   │   └── utils/                #     Helper functions
│   │
│   └── env.ts                    #   Zod-validated environment variables
│
├── public/                       # Static assets
├── tailwind.config.ts            # Neon Pulse color palette & design tokens
├── next.config.ts                # Next.js configuration (remote images)
├── components.json               # Shadcn/ui configuration
└── tsconfig.json                 # TypeScript config (path alias: @/ → ./src/)
```

### Quy Tắc Phân Lớp

- **core/** → KHÔNG import từ `infrastructure/`, `presentation/`, hay `shared/`. Chỉ chứa types thuần túy và error classes.
- **infrastructure/** → Chỉ import từ `core/`. KHÔNG import từ `presentation/`.
- **presentation/** → Import từ `infrastructure/` (qua repositories) và `shared/` (stores, utils).
- **shared/** → Import từ `core/` và `infrastructure/`. KHÔNG import từ `presentation/`.
- **app/** (routes) → Import từ `presentation/features/<feature>/components/` để render UI.

---

## 4. Lệnh Phát Triển

```bash
# Khởi chạy dev server (mặc định: http://localhost:3000)
pnpm dev

# Build production
pnpm build

# Chạy production server
pnpm start

# Lint kiểm tra
pnpm lint

# Lint + auto-fix
pnpm lint:fix

# Thêm component Shadcn/ui mới
pnpm dlx shadcn@latest add <component-name>
```

### Biến Môi Trường (`.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000          # URL frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api/v1  # URL backend API
NODE_ENV=development
```

Biến môi trường được validate qua Zod schema tại `src/env.ts`. Nếu thiếu hoặc sai format, ứng dụng sẽ tự dừng với thông báo lỗi rõ ràng.

---

## 5. Design System — "Neon Pulse"

### Bảng Màu Chủ Đạo

| Token              | Hex       | Vai trò                           |
| ------------------ | --------- | --------------------------------- |
| `background`       | `#0b1326` | Midnight Base — nền chính         |
| `primary`          | `#ecb2ff` | Electric Purple — hành động chính |
| `secondary`        | `#ffb1c3` | Neon Pink — hành động phụ         |
| `tertiary`         | `#00dbe9` | Cyber Cyan — điểm nhấn bổ sung   |
| `success`          | `#69ffa8` | Neon Emerald — trạng thái thành công |
| `warning`          | `#ffc83d` | Neon Amber — cảnh báo             |
| `error`            | `#ffb4ab` | Neon Coral — lỗi                  |
| `foreground`       | `#dae2fd` | Màu chữ chính                     |
| `surface-container`| `#171f33` | Card/Popover background           |

### Typography

- **Headings:** Font `Sora` (via `font-heading` hoặc `font-sora`)
- **Body text:** Font `Hanken Grotesk` (via `font-sans` hoặc `font-hanken`)
- **Code/Mono:** Font `Geist Mono` (via `font-mono`)

### Utility Classes Tùy Chỉnh (định nghĩa trong `globals.css`)

```css
text-headline-xl    /* 48px/56px, Sora, bold 800 */
text-headline-lg    /* 32px/40px, Sora, bold 700 */
text-headline-md    /* 24px/32px, Sora, semibold 600 */
text-body-lg        /* 18px/28px, Hanken, regular 400 */
text-body-md        /* 16px/24px, Hanken, regular 400 */
text-label-md       /* 14px/20px, Hanken, semibold 600 */
text-label-sm       /* 12px/16px, Hanken, medium 500 */
glass               /* Glassmorphism: rgba bg + blur + subtle border */
```

### Quy Tắc UI/UX

1. **Luôn sử dụng bảng màu Neon Pulse** — KHÔNG dùng màu tùy ý hoặc hardcode hex trực tiếp. Sử dụng CSS variable hoặc Tailwind token.
2. **Glassmorphism** — Sử dụng class `glass` cho các card, overlay, modal nổi bật.
3. **Animations** — Sử dụng Framer Motion cho micro-animations (page transitions, hover effects, loading states). Giữ animations nhẹ nhàng, tránh lạm dụng.
4. **Dark-first** — Thiết kế cho dark mode trước, đảm bảo contrast đủ (WCAG AA).
5. **Responsive** — Mobile-first approach. Sử dụng Tailwind breakpoints (`sm`, `md`, `lg`, `xl`).
6. **Icons** — Chỉ sử dụng `lucide-react`. KHÔNG thêm thư viện icon khác.
7. **Toast notifications** — Sử dụng `sonner` qua import từ `@/presentation/shared_ui/sonner`. KHÔNG dùng `alert()` hay `console.log()` cho thông báo người dùng.

---

## 6. Quy Tắc Kiến Trúc Code

### 6.1 Tạo Feature Mới

Khi thêm tính năng mới (ví dụ: "voucher"), tạo theo cấu trúc:

```
src/infrastructure/dtos/voucher.dto.ts          # DTO types
src/infrastructure/repositories/voucher.repository.ts  # API calls
src/presentation/features/voucher/
├── components/                                 # UI components
│   ├── voucher-list.tsx
│   └── voucher-card.tsx
└── hooks/
    └── use-vouchers.ts                         # useQuery/useMutation hooks
app/(public)/vouchers/
└── page.tsx                                    # Route page (import từ features)
```

### 6.2 Quy Tắc Repository

```typescript
// ✅ Đúng: Repository chỉ gọi API, trả về typed response
export const featureRepository = {
    getList: async (params?: QueryParams): Promise<ApiResponse<Data[]>> => {
        const response = await apiClient.get<ApiResponse<Data[]>>(API_ENDPOINTS.FEATURE.LIST, { params });
        return response.data;
    },
};

// ❌ Sai: KHÔNG xử lý business logic, UI state, hoặc toast trong repository
```

### 6.3 Quy Tắc Custom Hooks (TanStack React Query)

```typescript
// ✅ Đúng: Hook bọc useMutation, xử lý side-effects (toast, redirect)
export const useCreateBookingMutation = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: CreateBookingDto) => bookingRepository.create(data),
        onSuccess: () => {
            toast.success('Đặt phòng thành công!');
            router.push('/booking');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });
};

// ✅ Đúng: Hook bọc useQuery cho data fetching
export const useRooms = (params?: GetRoomsQueryParams) => {
    return useQuery({
        queryKey: ['rooms', params],
        queryFn: () => roomRepository.getRooms(params),
    });
};
```

### 6.4 Quy Tắc Zustand Store

- **Global stores** (`shared/stores/`): Chỉ dùng cho state xuyên suốt ứng dụng (auth, cart, theme).
- **Feature stores** (`presentation/features/<feature>/store/`): Dùng cho state cục bộ của feature (ví dụ: booking wizard steps).
- **Luôn dùng `persist` middleware** khi cần giữ state qua page refresh.
- **Dùng hook `useStore()`** (`shared/stores/use-store.ts`) để tránh Hydration Mismatch khi đọc persisted state trong SSR.

```typescript
// ✅ Tránh hydration mismatch
const items = useStore(useCartStore, (state) => state.items);

// ❌ Sẽ bị hydration mismatch nếu dùng trực tiếp trong SSR component
const items = useCartStore((state) => state.items);
```

### 6.5 Quy Tắc Forms

- Sử dụng **React Hook Form** + **Zod** cho mọi form.
- Định nghĩa Zod schema tại component hoặc file riêng nếu phức tạp.
- Sử dụng `@hookform/resolvers/zod` làm resolver.
- Thông báo validation errors bằng tiếng Việt.

### 6.6 Quy Tắc API & Authentication

- **HTTP Client** duy nhất: `apiClient` từ `@/infrastructure/api/http-client.ts`.
- KHÔNG tạo instance Axios mới. KHÔNG gọi `fetch()` trực tiếp.
- Auth dựa trên **HttpOnly cookie** — KHÔNG lưu token trong localStorage.
- Cơ chế **auto refresh token**: Interceptor tự động gọi `/auth/refresh` khi gặp 401, retry request gốc.
- Lỗi API được map sang class hierarchy (`BadRequestError`, `UnauthorizedError`, ...) tại interceptor.
- **API endpoints**: Tập trung tại `@/shared/constants/api-endpoints.ts`. KHÔNG hardcode URL trong repository hoặc component.

### 6.7 Quy Tắc Routing (App Router)

| Route Group      | Mục đích                              | Cần đăng nhập? |
| ---------------- | ------------------------------------- | -------------- |
| `(auth)`         | Đăng nhập, Đăng ký                   | Không          |
| `(public)`       | Trang chủ, duyệt phòng, dịch vụ      | Không          |
| `(custommer)`    | Đặt phòng, profile, scan QR, booking | Có             |

- **Page files** (`page.tsx`): Chỉ chứa metadata export và import component chính từ `presentation/features/`.
- **Layout files** (`layout.tsx`): Chứa layout chung (header/footer) và metadata.
- KHÔNG viết business logic trực tiếp trong `page.tsx`.

---

## 7. Quy Tắc TypeScript

- **Strict mode bật**: `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`.
- **Path alias**: `@/` map tới `./src/`. Luôn dùng `@/` thay vì relative path (`../../`).
- KHÔNG dùng `any`. Sử dụng `unknown` và type narrowing khi cần.
- Interface cho DTO/API shapes, Type cho union/intersection.
- Export types cùng file với implementation liên quan.

---

## 8. Quy Tắc Styling

- **Tailwind CSS v4** là phương pháp styling chính. KHÔNG viết CSS module hoặc inline styles trừ trường hợp đặc biệt.
- Sử dụng **Shadcn/ui components** (`@/presentation/shared_ui/`) cho các UI primitives (Button, Dialog, Input, ...). KHÔNG tự viết lại component có sẵn.
- Thêm Shadcn/ui component mới bằng CLI: `pnpm dlx shadcn@latest add <name>`.
- Sử dụng `cn()` utility (`@/shared/lib/utils`) để merge class names.
- Tùy chỉnh styling qua Tailwind classes, KHÔNG override CSS variables trực tiếp trừ khi thay đổi design token.

---

## 9. Quy Tắc Commit & Code Quality

### Pre-commit (Husky + lint-staged)

Mỗi lần commit, các file sẽ tự động được:
- `*.{ts,tsx,js,jsx}` → `prettier --write` + `eslint --fix`
- `*.{json,css,md}` → `prettier --write`

### Quy Ước Đặt Tên

| Loại             | Convention          | Ví dụ                                 |
| ---------------- | ------------------- | ------------------------------------- |
| Component files  | `kebab-case.tsx`    | `room-card.tsx`, `booking-form.tsx`    |
| Hook files       | `use-*.ts`          | `use-login.ts`, `use-rooms.ts`        |
| Store files      | `use-*-store.ts`    | `use-auth-store.ts`, `use-cart-store.ts` |
| DTO files        | `*.dto.ts`          | `auth.dto.ts`, `room.dto.ts`          |
| Repository files | `*.repository.ts`   | `auth.repository.ts`                  |
| React Components | `PascalCase`        | `RoomCard`, `BookingForm`             |
| Variables/Funcs  | `camelCase`         | `getRooms`, `handleSubmit`            |
| Constants        | `UPPER_SNAKE_CASE`  | `API_ENDPOINTS`, `BASE_URL`           |
| CSS classes      | Tailwind utilities  | `bg-primary`, `text-headline-lg`      |

---

## 10. Hiệu Suất & SEO

### SEO

- Mỗi route group có `metadata` export riêng (`title`, `description`).
- Sử dụng semantic HTML (`<main>`, `<section>`, `<article>`, `<nav>`).
- Một `<h1>` duy nhất mỗi trang.
- Ảnh từ remote phải khai báo trong `next.config.ts` > `images.remotePatterns`.

### Performance

- Sử dụng React Server Components mặc định. Chỉ thêm `'use client'` khi component cần interactivity.
- TanStack Query `staleTime: 60s` mặc định. Không refetch khi focus window.
- Lazy load heavy components bằng `next/dynamic`.
- Tối ưu ảnh bằng `next/image`.
- Zustand persist chỉ lưu fields cần thiết qua `partialize`.

---

## 11. Xử Lý Lỗi

### Phân Loại Lỗi API

| HTTP Status | Error Class          | Hành Động UI                              |
| ----------- | -------------------- | ----------------------------------------- |
| 400         | `BadRequestError`    | Toast error với message từ server          |
| 401         | `UnauthorizedError`  | Auto refresh → nếu fail → logout + toast  |
| 403         | `ForbiddenError`     | Toast "Không có quyền"                    |
| 404         | `NotFoundError`      | Toast hoặc hiển thị empty state           |
| 422         | `ValidationError`    | Hiển thị errors trên form fields          |
| 500         | `InternalServerError`| Toast "Lỗi hệ thống"                     |
| 0 (network) | `ApiError`           | Toast "Không thể kết nối đến máy chủ"    |

### Quy Tắc

- KHÔNG dùng `try/catch` trong component. Để TanStack Query `onError` hoặc error boundary xử lý.
- Thông báo lỗi bằng **tiếng Việt**, thân thiện với người dùng cuối.
- Log lỗi chi tiết (stack trace) chỉ ở development mode.

---

## 12. Realtime (Socket.IO)

- Socket.IO client dùng cho flow **QR Login** (nhân viên quét QR để đăng nhập nhanh).
- Kết nối tới backend URL (KHÔNG phải API URL).
- KHÔNG giữ kết nối socket mở khi không cần thiết — connect/disconnect theo lifecycle component.

---

## 13. Checklist Khi Review Code

- [ ] Đúng lớp kiến trúc? (core → infra → presentation → app)
- [ ] Dùng `@/` path alias thay vì relative imports?
- [ ] Không có `any` type?
- [ ] DTO được khai báo trong `infrastructure/dtos/`?
- [ ] API call đi qua repository, không gọi trực tiếp `apiClient` từ component?
- [ ] Custom hook wraps TanStack Query, xử lý toast/redirect?
- [ ] Styling dùng Tailwind + Shadcn, không inline CSS?
- [ ] Sử dụng đúng font (Sora cho heading, Hanken cho body)?
- [ ] Responsive design (mobile-first)?
- [ ] Tiếng Việt cho UI text, toast messages?
- [ ] Component file đặt tên kebab-case?
- [ ] Không hardcode API URLs?
