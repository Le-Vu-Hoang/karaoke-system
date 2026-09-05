# 🚨 Bài Toán Thực Tế Khi Deploy K-Master KTV lên Production

> Tài liệu này phân tích các vấn đề thực tế mà hệ thống **K-Master Karaoke Management System** sẽ đối mặt khi chạy trên môi trường production, dựa trên kiến trúc hiện tại của dự án.
>
> **Tech stack:** NestJS v11 · Next.js · PostgreSQL · Redis · Stripe · MoMo · VNPay · Cloudinary · Socket.IO

---

## 1. 🔐 Bài Toán Bảo Mật & Authentication

### 1.1 JWT Cookie bị tấn công CSRF
**Mô tả:** Hệ thống lưu JWT trong HttpOnly cookie — đây là lựa chọn đúng để chống XSS. Tuy nhiên, với `credentials: true` trong CORS config, nếu không có CSRF token, kẻ tấn công có thể tạo trang web giả gọi API của hệ thống với cookie của user.

**Nguy cơ:** Khách hàng đang đăng nhập bị redirect sang trang giả → kẻ tấn công thực hiện booking hoặc thanh toán thay mặt họ.

**Giải pháp cần triển khai:**
- Thêm CSRF token (Double Submit Cookie Pattern)
- Cấu hình `SameSite=Strict` hoặc `SameSite=Lax` cho cookie
- Rate limiting trên tất cả auth endpoints

---

### 1.2 Swagger `/api/docs` bị lộ trên production
**Mô tả:** Swagger UI hiện đang được setup không điều kiện trong `main.ts`. Trên production, toàn bộ API schema, params, response format đều bị public.

**Nguy cơ:** Hacker có thể đọc toàn bộ API contract → dễ dàng tấn công có chủ đích (SQLi, brute-force, IDOR).

**Giải pháp:**
```typescript
if (process.env.NODE_ENV !== 'production') {
  SwaggerModule.setup('api/docs', app, document);
}
```

---

### 1.3 Secret Key lọt vào log
**Mô tả:** Stripe webhook secret, MoMo secret key, VNPay secret key được load từ env. Nếu một lỗi unhandled exception xảy ra và logger ghi lại toàn bộ context object, secret có thể bị lộ trong log file.

**Nguy cơ cao** với MoMo/VNPay vì lỗi callback payload malformed rất thường gặp.

---

## 2. ⚡ Bài Toán Hiệu Năng & Scalability

### 2.1 Race Condition khi đặt phòng đồng thời (Critical)
**Mô tả:** Đây là bài toán **nghiêm trọng nhất** trong hệ thống karaoke. Khi 2 khách hàng cùng đặt phòng tại cùng một khung giờ trong **cùng một giây**:

```
Thời điểm T:  User A check phòng 01 → status: AVAILABLE ✅
Thời điểm T:  User B check phòng 01 → status: AVAILABLE ✅
Thời điểm T+1: User A tạo booking → thành công
Thời điểm T+1: User B tạo booking → thành công ← CONFLICT!
```

**Hậu quả:** 2 khách hàng cùng đến, 1 người không có phòng. Tệ hơn là cả 2 đã thanh toán.

**Giải pháp:**
- Dùng **Pessimistic Locking** trong Prisma: `SELECT ... FOR UPDATE`
- Hoặc **Redis Distributed Lock** (Redlock algorithm) — hệ thống đã có Redis!
- Thêm **database-level unique constraint** trên bảng booking theo (room_id, time_slot, status)

```typescript
// Redis distributed lock pattern
const lock = await redisService.set(
  `lock:room:${roomId}:${timeSlot}`,
  'locked',
  'NX', 'EX', 10 // 10 giây TTL
);
if (!lock) throw new ConflictException('Phòng đang được đặt bởi người khác');
```

---

### 2.2 Redis Cache Stampede (Thundering Herd)
**Mô tả:** Redis được dùng làm cache với TTL 300,000ms (5 phút). Khi cache của một key phổ biến (ví dụ: danh sách phòng còn trống) hết hạn, **hàng trăm request đồng thời** sẽ hit thẳng vào PostgreSQL.

**Nguy cơ:** Database bị quá tải đột ngột vào giờ cao điểm (19:00–22:00 — khung giờ vàng karaoke).

**Giải pháp:**
- **Cache Lock:** Chỉ cho phép 1 request rebuild cache, các request còn lại chờ.
- **Stale-While-Revalidate:** Trả dữ liệu cũ trong khi rebuild cache ngầm.
- **Jitter TTL:** Thêm random offset vào TTL để tránh nhiều key hết hạn cùng lúc.

```typescript
// Thay vì TTL cố định 300000
const ttl = 300000 + Math.random() * 60000; // +0~60 giây ngẫu nhiên
```

---

### 2.3 Socket.IO không scale khi có nhiều server
**Mô tả:** Khi hệ thống scale horizontally (chạy 2+ instance NestJS), Socket.IO theo mặc định **không chia sẻ connection** giữa các instance. Khách hàng kết nối vào server A không nhận được event từ server B.

**Kịch bản:** Staff cập nhật trạng thái phòng trên server B → Khách hàng đang kết nối server A không nhận được thông báo phòng trống.

**Giải pháp:**
- Dùng **@socket.io/redis-adapter** (hệ thống đã có Redis!)

---

### 2.4 Cloudinary Upload Timeout & Bottleneck
**Mô tả:** Upload ảnh lên Cloudinary là một I/O blocking operation. Nếu người dùng upload nhiều ảnh cùng lúc, server NestJS có thể bị nghẽn ở bước await → Các request khác (đặt phòng, thanh toán) bị delay theo.

**Giải pháp:**
- Xử lý upload trong **background job** (Bull Queue)
- Đặt timeout cụ thể cho Cloudinary requests
- Implement retry logic khi upload thất bại

---

## 3. 💳 Bài Toán Thanh Toán (Payment Critical)

### 3.1 Webhook MoMo/VNPay bị gọi nhiều lần (Duplicate IPN)
**Mô tả:** Cả MoMo và VNPay đều **retry webhook** nếu server không phản hồi `200 OK` trong thời gian quy định. Nếu server đang xử lý chậm (database slow), payment gateway sẽ retry → cùng 1 payment bị xử lý **2-3 lần**.

**Hậu quả:** Khách hàng được cộng điểm 2 lần, invoice được tạo 2 lần, hoặc tệ hơn là hoàn tiền 2 lần.

**Giải pháp — Idempotency Key:**
```typescript
// Trước khi xử lý, kiểm tra trong Redis
const processed = await redisService.get(`payment:processed:${orderId}`);
if (processed) return { status: 'already_processed' };

// Sau khi xử lý thành công
await redisService.set(`payment:processed:${orderId}`, '1', 'EX', 86400);
```

---

### 3.2 Thanh toán thành công nhưng Booking vẫn PENDING
**Mô tả:** Luồng thanh toán: Khách thanh toán → Payment gateway callback → NestJS cập nhật booking. Nếu bước cập nhật booking thất bại (DB timeout, crash), khách đã trả tiền nhưng booking vẫn ở trạng thái PENDING.

**Kịch bản thực tế:** 22:00 cuối tuần, database bị quá tải → 5% payment callback bị timeout → 15 khách đã thanh toán không vào được phòng.

**Giải pháp — Transactional Outbox Pattern:**
- Sử dụng **Prisma transaction** để đảm bảo atomicity
- Implement **Dead Letter Queue** — lưu lại failed callbacks để retry
- Background job kiểm tra reconciliation giữa payment gateway và database mỗi 5 phút

---

### 3.3 Stripe Webhook bị giả mạo
**Mô tả:** Nếu không validate Stripe signature đúng cách, bất kỳ ai cũng có thể POST vào `/payment/webhook` với payload giả để trigger booking confirmed.

**Giải pháp:**
```typescript
// Validate Stripe signature trước khi xử lý
const sig = request.headers['stripe-signature'];
stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
```

---

## 4. 🗄️ Bài Toán Database

### 4.1 N+1 Query Problem với Prisma
**Mô tả:** Trong các API như "lấy danh sách booking kèm thông tin phòng, dịch vụ, invoice", nếu không dùng `include` đúng cách, Prisma sẽ sinh ra N+1 queries.

**Ví dụ:**
```
GET /bookings → 1 query lấy 50 bookings
             → 50 queries lấy room info
             → 50 queries lấy services
             → 50 queries lấy invoice
             = 151 queries cho 1 request!
```

**Giải pháp:**
- Sử dụng `include` + `select` rõ ràng trong tất cả Prisma queries
- Enable Prisma query logging để phát hiện N+1 sớm

---

### 4.2 Migration Database trên Production gây downtime
**Mô tả:** Khi chạy `prisma migrate deploy` trên production, một số migration sẽ **lock bảng** (ALTER TABLE ADD COLUMN, CREATE INDEX). Với bảng bookings có hàng triệu record, lock này có thể kéo dài **5–15 phút** → toàn bộ hệ thống bị downtime.

**Giải pháp:**
- Dùng **expand-contract pattern:** Thêm cột mới trước, migrate data, rồi xóa cột cũ sau
- Với PostgreSQL: Dùng `CREATE INDEX CONCURRENTLY` thay vì `CREATE INDEX`
- Triển khai **blue-green deployment** để zero-downtime migration

---

### 4.3 Connection Pool Exhaustion
**Mô tả:** Prisma mặc định dùng connection pool. Trong giờ cao điểm, nếu số lượng concurrent requests vượt quá pool size, các request sẽ bị timeout khi chờ connection.

**Giải pháp:**
- Tăng `connection_limit` phù hợp với RAM của DB server
- Sử dụng **PgBouncer** làm connection pooler ở tầng database
- Monitor connection pool metrics với Prometheus

---

## 5. 🔄 Bài Toán Vận Hành (Operations)

### 5.1 Không có Health Check & Auto-Recovery
**Mô tả:** Nếu NestJS process bị crash lúc 3:00 sáng (memory leak, unhandled exception), không có cơ chế nào tự động restart. Hệ thống sẽ offline cho đến khi có người phát hiện sáng hôm sau.

**Giải pháp:**
- Dùng **PM2** hoặc **Docker + restart policy** để auto-restart
- Implement health check endpoint: `GET /api/v1/health`
- Setup alerting (Telegram bot, email) khi service down

---

### 5.2 Log không có cấu trúc — Khó debug production incident
**Mô tả:** Hệ thống đang dùng NestJS Logger mặc định. Trên production, logs của nhiều request bị trộn lẫn, không có correlation ID, không thể trace một request từ đầu đến cuối.

**Kịch bản:** Khách hàng gọi báo "Tôi đặt phòng lúc 20:37 nhưng không nhận được xác nhận" — bạn sẽ **không thể** tìm thấy log tương ứng.

**Giải pháp:**
- Dùng **Pino** hoặc **Winston** với structured JSON logs
- Thêm **Request ID** middleware để trace request end-to-end
- Tích hợp **Sentry** để capture và alert lỗi production

---

### 5.3 Shift Management — Staff quên check-in/check-out
**Mô tả:** Module `shift` quản lý ca làm việc. Trên thực tế, staff thường quên check-in/out. Nếu hệ thống yêu cầu strict check-in để xử lý order, toàn bộ ca làm có thể bị block.

**Giải pháp:**
- Cho phép Manager override check-in/out thủ công
- Auto-check-out sau một khoảng thời gian định sẵn
- Gửi reminder notification trước giờ kết thúc ca 15 phút

---

## 6. 🌐 Bài Toán Môi Trường Production Cụ Thể

### 6.1 CORS sai cấu hình → Frontend không gọi được API
**Mô tả:** Biến môi trường `ALLOWED_ORIGINS` không được set hoặc set sai trên production server. Nếu `ALLOWED_ORIGINS` undefined → fallback về `localhost` → **toàn bộ production frontend bị block**.

**Giải pháp:**
- Validate `ALLOWED_ORIGINS` là bắt buộc qua Joi schema
- Thêm vào `app.module.ts` Joi validation ngay

---

### 6.2 Timezone Mismatch — Booking sai giờ
**Mô tả:** Server deploy trên cloud (UTC timezone), database UTC, nhưng khách hàng ở Việt Nam (UTC+7). Nếu không xử lý timezone đồng nhất, booking lúc **23:00 ICT** sẽ bị lưu thành **16:00 UTC ngày hôm trước** → logic check phòng trống bị sai.

**Giải pháp:**
- **Toàn bộ datetime lưu UTC** trong DB — không exception
- Convert sang `Asia/Ho_Chi_Minh` chỉ ở tầng API response và UI display
- Dùng thư viện `date-fns-tz` hoặc `luxon` — không dùng `new Date()` thuần

---

### 6.3 Voucher bị dùng đồng thời — Double Spending
**Mô tả:** Khách hàng share mã voucher với bạn bè. Cả 2 cùng apply voucher đúng lúc → nếu không có atomic check, cả 2 đều dùng được dù voucher chỉ có 1 lượt.

**Giải pháp — Atomic Redis operation:**
```typescript
// SETNX để "đặt trước" voucher — atomic
const claimed = await redisService.set(
  `voucher:claim:${voucherCode}:${userId}`,
  '1',
  'NX', 'EX', 300
);
if (!claimed) throw new ConflictException('Voucher đã được sử dụng');
// Rồi mới xử lý business logic và commit DB
```

---

## 📊 Ma Trận Ưu Tiên

| # | Vấn đề | Mức độ nghiêm trọng | Khả năng xảy ra | Ưu tiên |
|---|--------|---------------------|-----------------|----------|
| 2.1 | Race condition đặt phòng | 🔴 Critical | 🔴 Cao | **P0** |
| 3.1 | Webhook IPN duplicate | 🔴 Critical | 🔴 Cao | **P0** |
| 3.2 | Payment success nhưng booking pending | 🔴 Critical | 🟡 Trung bình | **P0** |
| 6.3 | Voucher double spending | 🔴 Critical | 🟡 Trung bình | **P1** |
| 1.1 | CSRF attack | 🟠 High | 🟡 Trung bình | **P1** |
| 1.2 | Swagger lộ production | 🟠 High | 🔴 Cao | **P1** |
| 5.1 | Không có health check | 🟠 High | 🔴 Cao | **P1** |
| 6.2 | Timezone mismatch | 🟠 High | 🟡 Trung bình | **P1** |
| 2.3 | Socket.IO multi-instance | 🟠 High | 🟢 Thấp (single server) | **P2** |
| 4.1 | N+1 Query Prisma | 🟡 Medium | 🔴 Cao | **P2** |
| 5.2 | Log không có structure | 🟡 Medium | 🔴 Cao | **P2** |
| 4.2 | Migration gây downtime | 🟡 Medium | 🟡 Trung bình | **P2** |
| 2.2 | Redis cache stampede | 🟡 Medium | 🟢 Thấp | **P3** |

---

## ✅ Quick Wins (Có thể fix trong 1–2 ngày)

1. **Tắt Swagger trên production** — 30 phút
2. **Validate `ALLOWED_ORIGINS` trong Joi schema** — 15 phút
3. **Thêm idempotency key cho webhook** — 4 giờ
4. **Tắt `rawBody` toàn cục, chỉ bật cho Stripe route** — 1 giờ
5. **Thêm Redis distributed lock cho booking creation** — 1 ngày
6. **Setup PM2 + health check endpoint** — 2 giờ

---

*Tài liệu được tạo ngày 30/08/2026 — Phân tích dựa trên codebase thực tế của K-Master KTV System*
