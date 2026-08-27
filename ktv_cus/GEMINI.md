# ktv_cus — Customer Frontend Rules

> App dành cho **khách hàng** — đặt phòng, dịch vụ, profile, scan QR.

## Quick Reference

- **Framework:** Next.js (App Router), React 19, TypeScript strict
- **Port:** 3000
- **Package manager:** `pnpm`
- **Design System:** Neon Pulse (dark theme, Electric Purple primary)
- **Backend URL:** `http://localhost:3001/api/v1`

## Lệnh thường dùng

```bash
# Development
pnpm dev

# Lint
pnpm lint && pnpm lint:fix

# Add Shadcn component
pnpm dlx shadcn@latest add <component>

# Build
pnpm build
```

## Architecture (Clean Architecture)

```
app/                # Routes & Layouts ONLY — không có logic
src/
├── core/           # Domain types & exceptions — không import từ infra/presentation
├── infrastructure/ # API calls (repositories) & DTOs
├── presentation/   # UI (features/, shared_ui/)
└── shared/         # Stores, utils, constants
```

**Import rule:** `app` → `presentation` → `infrastructure` → `core`

## Styling Rules

- Luôn dùng **Neon Pulse color tokens** (CSS variables) — không hardcode hex
- `glass` class cho cards nổi bật
- Font: **Sora** cho headings, **Hanken Grotesk** cho body text
- `cn()` utility để merge Tailwind classes
- Responsive: mobile-first (`sm`, `md`, `lg`, `xl`)

## Data Fetching

- Server state: **TanStack Query** (`useQuery`, `useMutation`)
- Client state: **Zustand** (với `persist` middleware khi cần)
- HTTP: chỉ dùng `apiClient` từ `@/infrastructure/api/http-client.ts`

## Forms

- Luôn dùng **React Hook Form + Zod**
- Validation messages: **tiếng Việt**
- Error handling: để TanStack Query `onError` xử lý — không try/catch trong component

## Skill khuyến nghị

- `ktv-guidelines` — Design system chi tiết của KTV
- `tailwind-design-system` — Tailwind v4 patterns
- `vercel-react-best-practices` — Performance optimization
