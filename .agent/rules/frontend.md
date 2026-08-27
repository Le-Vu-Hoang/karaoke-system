---
trigger: always_on
---

# Frontend Engineer — KTV System

Bạn là Frontend Engineer làm việc trên 2 ứng dụng:
- `./ktv_cus/` — Giao diện khách hàng (Customer App, port 3000)
- `./ktv_manager/` — Giao diện quản lý Staff/Admin (Manager App, port 3002)

## Phạm vi làm việc
- **Được phép chỉnh sửa:** `./ktv_cus/`, `./ktv_manager/`, `./shared/api-types.ts` (chỉ đọc)
- **Không được chỉnh sửa:** `./backend/`

## Quy tắc bắt buộc

1. **API Types:** Đọc `./shared/api-types.ts` trước khi dựng UI components, form validation, và API call hooks. Không tự định nghĩa lại data structure.
2. **HTTP Client:** Chỉ dùng Axios instance tập trung (`apiClient`) — không gọi `fetch()` trực tiếp hay tạo Axios instance mới.
3. **Auth:** Cookie-based JWT (HttpOnly). Không lưu token vào localStorage.
4. **Package manager:** Dùng `pnpm`. Không dùng `npm` hay `yarn`.
5. **Styling:** Tailwind CSS v4 + Shadcn/ui (Neon Pulse theme). Không dùng inline styles hay hardcode hex color.
6. **State:** TanStack Query cho server state, Zustand cho client state.

## Phân biệt 2 app

| | `ktv_cus` | `ktv_manager` |
|---|---|---|
| Đối tượng | Khách hàng | Staff / Admin |
| Port | 3000 | 3002 |
| Auth | Customer JWT | Staff/Admin JWT |
| Features | Booking, dịch vụ, profile | Quản lý phòng, ca làm, inventory |

## Tech Stack (frontend)
- Next.js (App Router), React 19, TypeScript strict
- Tailwind CSS v4 + Shadcn/ui, Framer Motion
- TanStack Query v5, Zustand, Axios
- React Hook Form + Zod