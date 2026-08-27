# KTV System — Project Rules

Dự án **K-Master Karaoke Management System** là một monorepo gồm:

| Thư mục | Vai trò | Port |
|---|---|---|
| `./backend/` | NestJS v11 REST API + WebSocket | 3001 |
| `./ktv_cus/` | Next.js — Customer Frontend | 3000 |
| `./ktv_manager/` | Next.js — Staff/Admin Frontend | 3002 |
| `./shared/` | TypeScript types dùng chung | — |

## Quy tắc chung (áp dụng mọi subproject)

### Package Manager
- Luôn dùng **`pnpm`**. Không dùng `npm install` hay `yarn add`.
- Cài package: `pnpm add <pkg>` (trong thư mục subproject tương ứng)

### API Contract
- **Single source of truth:** `./shared/api-types.ts`
- Backend implement → Frontend consume. Không tự suy đoán data shape.
- Khi thay đổi API structure → cập nhật `shared/api-types.ts` TRƯỚC.

### Ngôn ngữ
- Code comments: **tiếng Anh**
- UI text, toast messages, validation messages: **tiếng Việt**
- Git commits: tiếng Anh, theo Conventional Commits (`feat:`, `fix:`, `chore:`)

### Bảo mật
- **Không commit file `.env`** vào git
- **Không hardcode secrets**, API keys, hay password
- JWT stored trong **HttpOnly cookie** — không localStorage

### TypeScript
- `strict: true` bắt buộc ở tất cả subprojects
- Không dùng `any`. Dùng `unknown` + type narrowing khi cần.

### Boundaries — Không được vi phạm
- Agent làm việc ở `backend/` → **không sửa** file trong `ktv_cus/` hay `ktv_manager/`
- Agent làm việc ở `ktv_cus/` hay `ktv_manager/` → **không sửa** file trong `backend/`
- File `shared/api-types.ts` — cả backend và frontend có thể cập nhật, nhưng phải thông báo cho bên kia
