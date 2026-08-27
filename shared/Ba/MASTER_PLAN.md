# MASTER PLAN: K-Master Karaoke Management System

## 1. Executive Summary
K-Master là hệ sinh thái phần mềm quản lý Karaoke toàn diện, được thiết kế để số hóa toàn bộ quy trình vận hành quán Karaoke: từ đặt phòng trực tuyến (Smart Booking), gọi món tại phòng (In-Room Services), quản lý phòng theo thời gian thực, đến kiểm soát tồn kho tự động. Hệ thống bao gồm một Backend tập trung (NestJS) áp dụng kiến trúc CQRS và hai ứng dụng Frontend riêng biệt (Next.js) dành cho Khách hàng và Nhân viên/Quản lý. Mục tiêu là tối ưu hóa trải nghiệm khách hàng, giảm thiểu sai sót vận hành và ngăn chặn thất thoát doanh thu.

---

## 2. Current Understanding

- **System purpose**: Số hóa và tự động hóa toàn bộ quy trình kinh doanh của một cơ sở Karaoke cao cấp.
- **Business goals**: Tăng tỷ lệ lấp đầy phòng qua online booking, tự động hóa quy trình gọi món/thanh toán, kiểm soát kho hàng chặt chẽ chống thất thoát, tối ưu hóa năng suất nhân viên.
- **Users / Actors**: 
  - *Customer*: Khách hàng (đặt phòng online, xem menu, gọi món tại phòng, thanh toán).
  - *Staff*: Nhân viên phục vụ/lễ tân (nhận phòng, ghi nhận dịch vụ, thanh toán, quản lý ca làm).
  - *Admin*: Quản lý/Chủ quán (quản lý kho, doanh thu, thiết lập giá phòng, nhân sự).
- **Core workflows**:
  1. Booking flow (Tạo -> Xác nhận -> Hủy/Đến).
  2. Room lifecycle (Trống -> Đang sử dụng -> Dọn dẹp/Bảo trì).
  3. Service & Billing flow (Gọi món -> Trừ kho -> Cập nhật hóa đơn -> Thanh toán).
- **Main entities**: User, Room, RoomType, Booking, Invoice, Service, InventoryLog, Payment, Shift, Equipment.
- **Current architecture**: Modular Monolith (NestJS) backend + 2 Next.js Frontends (Customer & Manager) trong một cấu trúc Monorepo (`pnpm`).
- **Existing components**: Đã có schema database (Prisma) khá hoàn chỉnh, setup cơ bản cho NestJS và Next.js.
- **Known constraints**: Phải sử dụng công nghệ đã định sẵn (NestJS v11, Next.js 16, Prisma, PostgreSQL).

---

## 3. Requirements

### 3.1 Functional Requirements (FR)

| ID | Feature | Actor | Description | Priority |
|---|---|---|---|---|
| FR-01 | **Smart Booking** | Customer | Cho phép khách xem phòng trống và đặt lịch trước. Yêu cầu cọc (tùy chọn). | High |
| FR-02 | **Room Dashboard** | Staff | Hiển thị sơ đồ phòng thời gian thực, cập nhật trạng thái (Available, In-use, Maintenance). | High |
| FR-03 | **In-Room Ordering** | Customer/Staff | Khách hoặc nhân viên có thể order đồ ăn/uống vào thẳng hóa đơn của phòng đang hát. | High |
| FR-04 | **Inventory Auto-deduction** | System | Khi order được tạo, tự động trừ số lượng trong kho và ghi log. | High |
| FR-05 | **Billing & Payment** | Staff/Customer| Tính toán tiền giờ hát + tiền dịch vụ - khuyến mãi. Hỗ trợ thanh toán nhiều hình thức (Cash, Card, Momo). | High |
| FR-06 | **Shift Management** | Staff | Quản lý ca làm việc, kiểm đếm tiền mặt đầu/cuối ca. | Medium |
| FR-07 | **Price Rules** | Admin | Thiết lập giá phòng thay đổi theo khung giờ, ngày trong tuần. | High |
| FR-08 | **Equipment Maint.** | Admin | Quản lý trạng thái thiết bị trong phòng và lịch sử bảo trì. | Low |
| FR-09 | **QR Login** | Staff | Nhân viên quét QR để đăng nhập nhanh bằng Socket.io. | Medium |

### 3.2 Non-functional Requirements (NFR)

- **Performance**: API response time < 200ms cho các tác vụ đọc. Real-time update (Socket.io) cho trạng thái phòng < 500ms.
- **Security**: JWT tokens lưu trong HttpOnly cookies. Áp dụng RBAC khắt khe ở cả API gateway và UI.
- **Reliability**: Hệ thống phải hoạt động tốt trong những ngày Lễ/Tết (lưu lượng booking tăng đột biến). Hỗ trợ Transactional consistency cao cho việc tính tiền và trừ kho.
- **Maintainability**: Tuân thủ Clean Architecture ở FE và CQRS ở BE.

> `UNKNOWN`: Chưa rõ phần cứng tại phòng (Karaoke Machine/Lighting) có cần integrate API để tự động tắt/mở khi hết giờ hay không? 
> *Assumption*: Hiện tại chỉ quản lý bằng software, chưa đụng đến IoT/Hardware control.

---

## 4. Functional Design (Function Map)

**Domain: Booking & Room Management**
- *Module*: Booking
  - *Feature*: Create Online Booking, Cancel Booking, Confirm Arrival.
- *Module*: Room
  - *Feature*: Live Floor Plan (Real-time), Update Room Status, Room Type Management.

**Domain: Service & Inventory**
- *Module*: Menu & Order
  - *Feature*: Browse Menu (Customer), Create Order (InvoiceService).
- *Module*: Inventory
  - *Feature*: Stock In (PurchaseOrder), Auto Stock Out (Sale), Damage Report.

**Domain: Billing & Sales**
- *Module*: Invoice
  - *Feature*: Calculate Time (dựa trên PriceRule), Apply Voucher, Split/Merge Invoice (nếu có).
- *Module*: Payment
  - *Feature*: Process Deposit, Final Payment, Refund, Momo Integration.

**Domain: Admin & HR**
- *Module*: Shift
  - *Feature*: Clock-in (Start Shift), Clock-out (End Shift), Cash Reconciliation.
- *Module*: Equipment
  - *Feature*: Log Maintenance, Change Equipment Status.

---

## 5. System Architecture

**Đề xuất: Modular Monolith**
Do team size và độ phức tạp hiện tại, Microservices là over-engineering. Modular Monolith với CQRS (đã setup) là sự lựa chọn hoàn hảo nhất để dễ maintain nhưng vẫn đủ ranh giới rõ ràng.

### 5.1 Logical Architecture
- **Presentation Layer**: Next.js App Router (ktv_cus cho Khách, ktv_manager cho Staff).
- **API Gateway / Controller Layer**: NestJS REST Controllers.
- **Business Logic Layer**: CQRS Command/Query Handlers. Đảm bảo Single Responsibility.
- **Data Access Layer**: Prisma Repositories.
- **Cross-cutting Concerns**: Auth Guards (JWT/RBAC), Logging Interceptors, Exception Filters.

### 5.2 Runtime Architecture
```
[Customer (Mobile/Web)] --(HTTP/REST)--> [Next.js (ktv_cus)] --(HTTP/REST)--> [NestJS API]
[Staff/Admin (Web/Tablet)] --(HTTP/REST)--> [Next.js (ktv_manager)] --(HTTP/REST)--> [NestJS API]
                                                                        |
                                                                        +-- [Prisma ORM] --> [PostgreSQL]
                                                                        +-- [Cache Manager] --> [Redis]
                                                                        +-- [Socket.io Gateway] <--> (Realtime sync)
```

### 5.3 Deployment Architecture
- **Environment**: AWS (sử dụng Mau CLI như trong README đề xuất).
- **Compute**: Docker Containers chạy trên ECS Fargate hoặc EC2.
- **Database**: Amazon RDS for PostgreSQL.
- **Cache**: Amazon ElastiCache (Redis).
- **Storage**: AWS S3 hoặc Cloudinary (cho hình ảnh dịch vụ, avatar).

---

## 6. Domain & Data Design

Dựa trên Prisma Schema hiện có, hệ thống xoay quanh các entity chính:

- **Booking**: Liên kết với `User` (Customer), `RoomType`, `Room`. Chứa tiền cọc (`deposit`) và `status`.
- **Invoice**: Core entity cho Billing. Liên kết `Booking`, `Room`, `Staff`. Có `startTime`, `endTime`, và các trường tính toán (`roomTotal`, `servicesTotal`, `discount`, `finalTotal`).
- **InvoiceService**: Line items cho các dịch vụ gọi thêm (đồ ăn, nước).
- **Service & InventoryLog**: Dịch vụ có `stockQuantity`. Khi tạo `InvoiceService`, phải phát sinh `InventoryLog` (Sale) để trừ kho (bằng Prisma Transaction).
- **PriceRule**: Hệ thống tính tiền giờ phức tạp (Dynamic Pricing) theo ngày trong tuần và khung giờ.
- **Payment**: Lưu trữ lịch sử giao dịch (Cash, Momo, Card).

**Transaction Boundary & Concurrency Risk**:
- *Inventory Deduction*: Cần dùng cơ chế Locking hoặc atomic update (`decrement` trong Prisma) để tránh Race Condition khi nhiều phòng cùng order một mặt hàng sắp hết.
- *Room Assignment*: Tránh double-booking cùng một phòng vào cùng một thời điểm.

---

## 7. API Design

Sử dụng RESTful chuẩn + WebSockets. 

**Public / Customer APIs (`/api/v1/customer/...`)**
- `GET /rooms/available` - Tìm phòng trống theo giờ.
- `POST /bookings` - Đặt phòng.
- `GET /services` - Xem menu.
- `POST /rooms/{id}/orders` - Gọi món (chỉ khi được cấp token tạm thời cho phiên hát).

**Staff APIs (`/api/v1/staff/...`)**
- `GET /rooms/live-status` - Dashboard sơ đồ phòng.
- `POST /invoices/{id}/check-out` - Trả phòng & xuất bill.
- `POST /shifts/start` - Bắt đầu ca làm.

**Admin APIs (`/api/v1/admin/...`)**
- `CRUD /services`, `CRUD /room-types`, `CRUD /price-rules`.

**WebSockets (`/ws/rooms`)**
- Event `room_status_changed`: Broadcast cho tất cả Staff client khi một phòng đổi trạng thái.
- Event `new_order_placed`: Báo cho quầy bar/bếp.

---

## 8. Event / Async Design

Sử dụng tính năng EventBus của `@nestjs/cqrs`:

- `OrderPlacedEvent`: Trigger trừ kho (Inventory Service), gửi thông báo cho Bar/Bếp (WebSocket).
- `BookingCreatedEvent`: Gửi email/SMS xác nhận cho khách hàng, gửi lịch hẹn tự động dọn dẹp nếu có.
- `InvoicePaidEvent`: Cập nhật doanh thu ca làm việc (`Shift`), tính điểm trung thành (`Loyalty` nếu có).

---

## 9. Security Design

- **Authentication**: JWT Token phát hành qua endpoint `/auth/login`. Token được set vào `HttpOnly`, `Secure` Cookie để chống XSS. Token có hạn ngắn (15m), dùng Refresh Token (7d) xoay vòng tự động.
- **Authorization**: RBAC Guard tùy chỉnh của NestJS (`@Roles(Role.ADMIN)`).
- **Throttling/Rate Limit**: Áp dụng `@nestjs/throttler` chặt chẽ ở các endpoint public (đăng nhập, booking) để chống DDoS.
- **Data Protection**: Mật khẩu mã hóa `bcrypt`. Thông tin thanh toán (Momo) qua HTTPS và verify signature nghiêm ngặt.

---

## 10. Infrastructure & DevOps

- **Local Dev**: Docker Compose (gồm PostgreSQL, Redis). 
- **CI/CD**: GitHub Actions.
  - *PR Phase*: Run `pnpm lint`, `pnpm test`, check Prisma format.
  - *Merge Phase*: Build Docker image, push to registry.
- **Database Migrations**: Tự động chạy `npx prisma migrate deploy` trong quá trình CD trước khi start app.
- **Secrets Management**: AWS Secrets Manager hoặc .env file thông qua CI variables.

---

## 11. Testing Strategy

- **Unit Test**: Test các CQRS Handlers độc lập (mock PrismaService và EventBus). Focus mạnh vào logic tính tiền (`CalculateInvoiceTotalHandler`) và trừ kho.
- **Integration Test**: API Endpoints (dùng Supertest + Test Database). Đảm bảo Auth Guards hoạt động.
- **E2E Test**: Playwright hoặc Cypress cho các flow chính trên FE: Flow Đặt phòng online, Flow Lễ tân nhận phòng -> Tính tiền.
- **Load Test**: Dùng k6 test API `/rooms/available` và `/bookings` để đảm bảo hệ thống chịu tải tốt vào cuối tuần.

---

## 12. Documentation Inventory

| Document | Purpose | Audience | Required? | Priority |
| -------- | ------- | -------- | --------- | -------- |
| Product Requirements (PRD) | Định nghĩa specs chi tiết tính năng | All | Yes | High |
| API Specification | Swagger/OpenAPI docs cho FE tích hợp | FE/BE | Yes | High |
| Database Schema (ERD) | Sơ đồ quan hệ DB trực quan | Engineers | Yes | High |
| Pricing Algorithm Rule | Tài liệu giải thích thuật toán tính tiền giờ phức tạp | Engineers, QA, Admin | Yes | Critical |
| Deployment Guide | Các bước setup AWS/Docker | DevOps | Yes | Medium |

---

## 13. Traceability Matrix (Ví dụ)

**Business Goal**: Tự động hóa quản lý kho, chống thất thoát.
-> **Requirement**: FR-04 Inventory Auto-deduction
-> **Feature**: Order Service API
-> **Component**: `PlaceOrderCommandHandler`
-> **Data**: Table `InventoryLog`, `Service` (giảm `stockQuantity`)
-> **Test**: Unit test `should_decrement_stock_and_throw_if_out_of_stock`
-> **Doc**: System Architecture Document (Event Flow section).

---

## 14. Architecture Decisions (ADRs)

### ADR-001: Modular Monolith vs Microservices
- **Problem**: Chọn kiến trúc cho BE.
- **Options**: Microservices vs Monolith.
- **Decision**: Chọn Modular Monolith (NestJS + CQRS).
- **Reason**: Domain không quá lớn tới mức cần microservices (gây overhead về network, distributed transactions). CQRS giữ cho code clean và dễ tách ra microservices sau này nếu cần thiết.

### ADR-002: Dynamic Pricing Handling
- **Problem**: Tiền giờ thay đổi liên tục tùy khung giờ hát (VD: 18h-20h giá A, 20h-23h giá B).
- **Decision**: Logic tính tiền sẽ được execute tại thời điểm Checkout (`endTime`), chia tổng thời gian thành các blocks, đối chiếu với table `PriceRule`.
- **Consequences**: API Checkout sẽ mang tải tính toán nặng, cần viết Unit Test độ phủ 100% cho thuật toán này.

---

## 15. Risks & Open Questions

| Risk / Question | Impact | Mitigation | Status |
| --------------- | ------ | ---------- | ------ |
| Hardware Integration: Có cần tự động tắt điện/màn hình khi hết giờ? | High (nếu required) | Cần confirm gấp với Stakeholders. Tạm thời build software-only. | UNKNOWN |
| Race condition khi trừ kho nhiều phòng cùng lúc | High | Dùng Database Level Locking hoặc Prisma atomic update. | Planned |
| Đồng bộ trạng thái phòng khi mất kết nối mạng (Socket rớt) | Medium | FE (Zustand) cần có cơ chế polling nhẹ fallback, tự reconnect Socket. | Planned |

---

## 16. Implementation Roadmap

- **Phase 0 — Foundation**: Setup CI/CD, Prisma Schema, Global Auth & Exception Filters.
- **Phase 1 — Core Master Data**: Admin API (RoomType, Room, ServiceCategory, Service, PriceRule).
- **Phase 2 — Inventory & Ordering**: Flow nhập kho, API gọi món, Event trừ kho.
- **Phase 3 — Booking & Room Management**: Customer booking flow, Staff Room Dashboard (Socket.io).
- **Phase 4 — Billing Engine**: Thuật toán tính tiền dựa trên time-blocks, Voucher, Thanh toán.
- **Phase 5 — Shift & Reporting**: Quản lý ca làm nhân viên, Thống kê doanh thu.
- **Phase 6 — Testing & Production Readiness**: Viết Unit Test cho thuật toán, Load Test, Deploy.

---

## 17. Final Deliverables (Checklist)

Tài liệu này đóng vai trò là **Master Plan**. Dưới đây là các artifacts sẽ được kỹ sư tạo ra trong quá trình triển khai (team Execution sẽ follow):

- [x] System Architecture Document (Master Plan này)
- [ ] PRD (Functional Specification)
- [ ] ERD Diagram (tạo từ Prisma Schema)
- [ ] Swagger API Documentation (Tự động hóa qua NestJS `@nestjs/swagger`)
- [ ] Technical Design Document: Pricing Algorithm
- [ ] Postman / Bruno API Collection
- [ ] Test Strategy & Test Plan
- [ ] CI/CD Pipeline (GitHub Actions YAML)
- [ ] Runbook & Deployment Guide
