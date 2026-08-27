# K-Master Portal (KTV_FE_CUS)

K-Master Portal là ứng dụng Frontend dành cho khách hàng đặt phòng Karaoke VIP, được xây dựng trên nền tảng **Next.js 16** (App Router), **React 19** và **Tailwind CSS v4**. Dự án áp dụng mô hình kiến trúc lai (Hybrid) giữa **Clean Architecture** và **Feature-Sliced Design (FSD)** để đảm bảo khả năng mở rộng, bảo trì và chất lượng mã nguồn tối đa.

Tài liệu chi tiết về kiến trúc dự án có thể tham khảo tại: [analysis/architecture.md](file:///home/hoang/Projects/Next/KTV_FE_CUS/ktv_cus/analysis/architecture.md)

---

## 🛠️ Công Nghệ & Thư Viện Sử Dụng

*   **Core**: Next.js 16.2 (App Router), React 19.2, TypeScript 5.
*   **Styling & UI**: Tailwind CSS v4 (định dạng CSS-first), Shadcn UI (Base Library + Nova Preset).
*   **Typography**: Plus Jakarta Sans (Font chữ hiện đại, tối ưu hóa chống Layout Shift).
*   **State Management**: Zustand 5 (Client state) & TanStack Query v5 (Server state/Caching).
*   **API Client**: Axios 1.18 (Cấu hình tự động refresh token đồng thời & hàng đợi).
*   **Validation**: Zod 4 (Xác thực môi trường .env và dữ liệu form).

---

## 📂 Cấu Trúc Thư Mục Dự Án

Dự án tổ chức mã nguồn theo mô hình Clean Architecture phân tầng đặt dưới thư mục `src/`, tách biệt hoàn toàn với hệ thống định tuyến (Routing) của Next.js:

```text
├── analysis/               # Tài liệu thiết kế và kiến trúc dự án
├── app/                    # Routing, SEO Metadata, Layouts và Page Entrypoints (App Router)
├── src/
│   ├── core/               # LỚP NGHIỆP VỤ & QUY TẮC CHỦ ĐẠO (Domain Core)
│   │   ├── entities/       # Các đối tượng nghiệp vụ (Room, Booking, User...)
│   │   └── exceptions/     # Các lớp ngoại lệ tùy chỉnh (api-error.ts...)
│   │
│   ├── infrastructure/     # LỚP HẠ TẦNG (Data Access & Services)
│   │   ├── api/            # Axios Client (http-client.ts) cấu hình refresh token
│   │   ├── dtos/           # Data Transfer Objects định nghĩa dữ liệu từ Swagger/NestJS
│   │   └── repositories/   # Các hiện thực (implementations) gọi API thực tế
│   │
│   ├── presentation/       # LỚP GIAO DIỆN (UI & Logic Giao Diện)
│   │   ├── features/       # Các nhóm tính năng tự trị (auth, room, booking...)
│   │   │   ├── components/ # Giao diện cục bộ của tính năng
│   │   │   ├── hooks/      # React Hooks quản lý logic hoặc kết nối React Query
│   │   │   └── store/      # Zustand store quản lý State của tính năng
│   │   ├── shared_ui/      # Shadcn UI và các Component dùng chung (Button, Input...)
│   │   └── providers.tsx   # TanStack Query & các Global Provider bọc ngoài Layout
│   │
│   ├── lib/                # Các thư viện phụ trợ dùng chung (utils.ts...)
│   └── env.ts              # Zod Schema xác thực biến môi trường .env khi khởi động
```

---

## ⚙️ Các Cấu Hình Core Quan Trọng Đã Thiết Lập

### 1. Xác thực môi trường nghiêm ngặt (`src/env.ts`)
*   Được validate bằng **Zod** ngay khi ứng dụng khởi chạy (`dev` hoặc `build`).
*   Nếu thiếu hoặc sai định dạng của biến môi trường bắt buộc (ví dụ: `NEXT_PUBLIC_API_URL`), hệ thống sẽ **in đỏ chi tiết lỗi và dừng tiến trình lập tức (`process.exit(1)`)** để tránh sinh lỗi ngầm trên Production.

### 2. Axios Client thông minh (`src/infrastructure/api/http-client.ts`)
*   **Cookie-first Auth**: Tự động lấy JWT Access Token từ Cookies (hỗ trợ SSR) và LocalStorage (đồng bộ Zustand) gắn vào header.
*   **Silent Refresh Token Queue**: Khi gặp lỗi `401 Unauthorized` đồng thời từ nhiều request, hệ thống sẽ giữ chúng trong hàng đợi, thực hiện một request refresh token duy nhất lên `/v1/auth/refresh`, sau đó tự động gửi lại tất cả các request trong hàng đợi với token mới mà người dùng không hề nhận ra.
*   **Error Mapping**: Tự động chuyển đổi các mã lỗi HTTP thô từ backend thành các Custom Error Class có ngữ nghĩa như `BadRequestError`, `ValidationError` (422), `UnauthorizedError` (401),...

### 3. Cấu hình Caching TanStack Query (`src/presentation/providers.tsx`)
*   `staleTime: 60000` (1 phút): Dữ liệu được cache và xem là "fresh" trong 1 phút, tránh gọi API liên tiếp khi chuyển trang.
*   `retry: 1`: Tự động gọi lại 1 lần nếu gặp lỗi kết nối mạng.
*   `refetchOnWindowFocus: false`: Không tự động fetch lại khi người dùng chuyển qua lại các tab trình duyệt.

### 4. Giao diện & Typography (`app/globals.css`, `tailwind.config.ts`)
*   Được cấu hình sẵn tông màu chủ đạo **Karaoke VIP**: Màu chính là **Vàng đồng sang trọng** (`primary: #cca04e`) và màu nền là **Xám đen tối** (`background: #121212`).
*   Tích hợp sẵn font chữ **`Plus Jakarta Sans`** tối ưu hóa hiệu năng và tốc độ hiển thị.

---

## 🚀 Khởi Chạy Dự Án

### 1. Chuẩn bị biến môi trường
Sao chép file cấu hình mẫu và điền thông tin kết nối tới NestJS API:
```bash
cp .env.example .env
```

### 2. Cài đặt thư viện phụ thuộc
Dự án sử dụng trình quản lý gói `pnpm`:
```bash
pnpm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
pnpm run dev
```
Truy cập vào ứng dụng tại: [http://localhost:3000](http://localhost:3000).

### 4. Đóng gói Production (Build)
```bash
pnpm run build
```

---

## 📦 Cài đặt thêm Component Shadcn UI

Các UI components được quản lý dưới thư mục `src/presentation/shared_ui/`. Để tải thêm component mới từ thư viện Shadcn UI, hãy chạy lệnh:

```bash
npx shadcn add <tên_component>
```
*Ví dụ:* `npx shadcn add card` hoặc `npx shadcn add dropdown-menu`.
