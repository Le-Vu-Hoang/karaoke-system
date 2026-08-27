# ktv_manager — Staff/Admin Frontend Rules

> App dành cho **Staff và Admin** — quản lý phòng, đặt lịch, ca làm, inventory, báo cáo.

## Quick Reference

- **Framework:** Next.js (App Router), TypeScript strict
- **Port:** 3002
- **Package manager:** `pnpm`
- **Backend URL:** `http://localhost:3001/api/v1`
- **App name:** KTV Staff Portal

## Lệnh thường dùng

```bash
# Development
pnpm dev

# Lint
pnpm lint

# Build
pnpm build
```

## Phân quyền

App này có 2 loại user:
- **Staff:** Xem phòng, cập nhật trạng thái phòng, ghi nhận dịch vụ
- **Admin:** Toàn quyền — thêm/xóa phòng, quản lý nhân viên, xem báo cáo doanh thu

Route guard phải kiểm tra role từ JWT payload trước khi render trang.

## Lưu ý quan trọng

- `AGENTS.md` trong thư mục này được tự động sinh bởi `next dev` (Next.js agent integration) — **không xóa**
- `CLAUDE.md` chỉ là reference đến `AGENTS.md` — không thay đổi

## Skill khuyến nghị

- `tailwind-design-system` — Tailwind v4 patterns (Neon Pulse theme)
- `vercel-react-best-practices` — Next.js performance patterns
