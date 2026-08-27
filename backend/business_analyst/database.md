# Tài Liệu Thiết Kế Cơ Sở Dữ Liệu - Hệ Thống Quản Lý & Đặt Lịch Karaoke

Tài liệu này mô tả chi tiết cấu trúc cơ sở dữ liệu (Database Schema) cho hệ thống đặt phòng và quản lý quán Karaoke,
được thiết kế với Prisma và PostgreSQL.

Hệ thống bao gồm 16 bảng, được chia thành 6 nhóm phân hệ (Modules) chính:

---

## 1. Phân Hệ Lõi (Core Module)

Quản lý thông tin cơ bản: Người dùng, Phòng hát, Menu và các luồng Đặt phòng - Hóa đơn.

### Bảng `users` (Tài khoản & Nhân sự)

| Field           | Type     | Attributes        | Description                          |
|:----------------|:---------|:------------------|:-------------------------------------|
| `id`            | String   | PK, UUID(7)       | Mã người dùng.                       |
| `full_name`     | String   |                   | Họ và tên.                           |
| `phone_number`  | String   | Unique            | Số điện thoại (dùng làm tài khoản).  |
| `email`         | String   | Unique, Nullable  | Địa chỉ email.                       |
| `password_hash` | String   |                   | Mật khẩu đã mã hóa.                  |
| `role`          | Enum     | Default: CUSTOMER | Quyền: `CUSTOMER`, `STAFF`, `ADMIN`. |
| `created_at`    | DateTime | Default: now()    | Thời gian tạo tài khoản.             |

### Bảng `room_types` (Loại phòng)

| Field                 | Type    | Attributes     | Description                         |
|:----------------------|:--------|:---------------|:------------------------------------|
| `id`                  | String  | PK, UUID(7)    | Mã loại phòng.                      |
| `name`                | String  |                | Tên loại phòng (VIP, Thường, v.v.). |
| `capacity`            | Int     |                | Sức chứa tối đa.                    |
| `base_price_per_hour` | Decimal |                | Giá cơ bản theo giờ.                |
| `description`         | String  | Text, Nullable | Mô tả chi tiết loại phòng.          |

### Bảng `rooms` (Phòng hát vật lý)

| Field          | Type   | Attributes         | Description                           |
|:---------------|:-------|:-------------------|:--------------------------------------|
| `id`           | String | PK, UUID(7)        | Mã phòng.                             |
| `room_type_id` | String | FK -> room_types   | Phân loại phòng.                      |
| `room_number`  | String | Unique             | Số hiệu/Tên phòng (VD: P101).         |
| `status`       | Enum   | Default: AVAILABLE | `AVAILABLE`, `IN_USE`, `MAINTENANCE`. |

### Bảng `bookings` (Đặt phòng trước)

| Field               | Type     | Attributes            | Description                                     |
|:--------------------|:---------|:----------------------|:------------------------------------------------|
| `id`                | String   | PK, UUID(7)           | Mã đơn đặt phòng.                               |
| `customer_id`       | String   | FK -> users, Nullable | ID khách hàng (nếu có tài khoản).               |
| `guest_name`        | String   | Nullable              | Tên khách vãng lai.                             |
| `guest_phone`       | String   | Nullable              | SĐT khách vãng lai.                             |
| `room_type_id`      | Int      | FK -> room_types      | Loại phòng muốn đặt.                            |
| `room_id`           | Int      | FK -> rooms, Nullable | Phòng được xếp cụ thể.                          |
| `booking_time`      | DateTime |                       | Khung giờ khách đặt đến.                        |
| `duration_expected` | Int      |                       | Số giờ dự kiến hát.                             |
| `status`            | Enum     | Default: PENDING      | `PENDING`, `CONFIRMED`, `CANCELLED`, `ARRIVED`. |
| `deposit`           | Decimal  | Default: 0            | Số tiền đã cọc.                                 |

### Bảng `invoices` (Hóa đơn & Phiên sử dụng phòng)

| Field            | Type     | Attributes           | Description                              |
|:-----------------|:---------|:---------------------|:-----------------------------------------|
| `id`             | String   | PK, UUID(7)          | Mã hóa đơn.                              |
| `booking_id`     | String   | FK -> bookings, Null | ID đơn đặt phòng (nếu có).               |
| `room_id`        | String   | FK -> rooms          | Phòng đang sử dụng.                      |
| `staff_id`       | String   | FK -> users          | Nhân viên mở phòng/chăm sóc.             |
| `start_time`     | DateTime | Default: now()       | Giờ bắt đầu tính tiền.                   |
| `end_time`       | DateTime | Nullable             | Giờ kết thúc hát.                        |
| `room_total`     | Decimal  | Default: 0           | Tổng tiền giờ hát.                       |
| `services_total` | Decimal  | Default: 0           | Tổng tiền dịch vụ (menu).                |
| `discount`       | Decimal  | Default: 0           | Tiền giảm giá.                           |
| `final_total`    | Decimal  | Default: 0           | Tiền khách phải trả (Sau khi trừ KM).    |
| `status`         | Enum     | Default: UNPAID      | Trạng thái thanh toán: `UNPAID`, `PAID`. |

### Bảng `invoice_services` (Chi tiết gọi món)

| Field           | Type     | Attributes     | Description                                   |
|:----------------|:---------|:---------------|:----------------------------------------------|
| `id`            | String   | PK, UUID(7)    | ID chi tiết gọi món.                          |
| `invoice_id`    | String   | FK -> invoices | Thuộc hóa đơn nào.                            |
| `service_id`    | String   | FK -> services | Món được gọi.                                 |
| `quantity`      | Int      |                | Số lượng.                                     |
| `price_at_time` | Decimal  |                | Giá tại thời điểm order (chống đổi giá menu). |
| `order_time`    | DateTime | Default: now() | Giờ gọi món.                                  |

---

## 2. Phân Hệ Giá Động (Dynamic Pricing)

Xử lý nghiệp vụ giá thay đổi theo khung giờ hoặc ngày lễ/cuối tuần.

### Bảng `price_rules` (Luật tính giá)

| Field            | Type    | Attributes       | Description                 |
|:-----------------|:--------|:-----------------|:----------------------------|
| `id`             | String  | PK, UUID(7)      | ID luật giá.                |
| `room_type_id`   | String  | FK -> room_types | Áp dụng cho loại phòng nào. |
| `day_of_week`    | Int     |                  | 1=CN, 2=Thứ 2... 8=Lễ.      |
| `start_time`     | Time    |                  | Giờ bắt đầu khung giá.      |
| `end_time`       | Time    |                  | Giờ kết thúc khung giá.     |
| `price_per_hour` | Decimal |                  | Giá tiền mỗi giờ.           |

---

## 3. Phân Hệ Thanh Toán & Khuyến Mãi (Payments & Promotions)

### Bảng `vouchers` (Mã giảm giá)

| Field                | Type     | Attributes  | Description                          |
|:---------------------|:---------|:------------|:-------------------------------------|
| `id`                 | String   | PK, UUID(7) | ID Voucher.                          |
| `code`               | String   | Unique      | Mã nhập (VD: HAPPY2026).             |
| `discount_type`      | Enum     |             | `PERCENT` (%), `FIXED_AMOUNT` (VNĐ). |
| `discount_value`     | Decimal  |             | Giá trị giảm.                        |
| `min_invoice_amount` | Decimal  |             | Tổng bill tối thiểu áp dụng.         |
| `valid_from`         | DateTime |             | Ngày bắt đầu.                        |
| `valid_until`        | DateTime |             | Ngày hết hạn.                        |
| `usage_limit`        | Int      | Nullable    | Giới hạn số lượt dùng.               |

### Bảng `payments` (Lịch sử giao dịch)

| Field              | Type     | Attributes           | Description                              |
|:-------------------|:---------|:---------------------|:-----------------------------------------|
| `id`               | String   | PK, UUID(7)          | Mã giao dịch.                            |
| `invoice_id`       | Int      | FK -> invoices, Null | Thanh toán cho hóa đơn nào.              |
| `booking_id`       | Int      | FK -> bookings, Null | Tiền cọc cho booking nào.                |
| `amount`           | Decimal  |                      | Số tiền.                                 |
| `payment_method`   | Enum     |                      | `CASH`, `BANK_TRANSFER`, `CARD`, `MOMO`. |
| `payment_type`     | Enum     |                      | `DEPOSIT`, `FINAL_PAYMENT`, `REFUND`.    |
| `transaction_time` | DateTime | Default: now()       | Thời gian thanh toán.                    |

---

## 4. Phân Hệ Kho Bãi (Inventory Management)

### Bảng `services` (Danh mục Dịch vụ/Sản phẩm)

| Field            | Type    | Attributes  | Description                       |
|:-----------------|:--------|:------------|:----------------------------------|
| `id`             | String  | PK, UUID(7) | Mã dịch vụ.                       |
| `name`           | String  |             | Tên món (VD: Bia Tiger).          |
| `category`       | String  |             | Phân loại (Đồ uống, Đồ ăn, Khác). |
| `price`          | Decimal |             | Giá bán lẻ.                       |
| `stock_quantity` | Int     | Default: 0  | Tồn kho hiện tại.                 |

### Bảng `suppliers` (Nhà cung cấp)

| Field          | Type   | Attributes  | Description            |
|:---------------|:-------|:------------|:-----------------------|
| `id`           | String | PK, UUID(7) | Mã NCC.                |
| `name`         | String |             | Tên nhà cung cấp.      |
| `phone_number` | String |             | Số điện thoại liên hệ. |

### Bảng `purchase_orders` (Phiếu nhập kho)

| Field          | Type     | Attributes      | Description           |
|:---------------|:---------|:----------------|:----------------------|
| `id`           | String   | PK, UUID(7)     | Mã phiếu nhập.        |
| `supplier_id`  | Int      | FK -> suppliers | Nhập từ NCC nào.      |
| `staff_id`     | Int      | FK -> users     | Nhân viên nhập.       |
| `total_amount` | Decimal  |                 | Tổng tiền phiếu nhập. |
| `order_date`   | DateTime | Default: now()  | Ngày nhập kho.        |

### Bảng `inventory_logs` (Lịch sử biến động kho)

| Field              | Type     | Attributes     | Description                                     |
|:-------------------|:---------|:---------------|:------------------------------------------------|
| `id`               | String   | PK, UUID(7)    | Mã log.                                         |
| `service_id`       | String   | FK -> services | Sản phẩm có biến động.                          |
| `change_type`      | Enum     |                | `IMPORT` (Nhập), `SALE` (Bán), `DAMAGE` (Hỏng). |
| `quantity_changed` | Int      |                | Số lượng thay đổi (+/-).                        |
| `reference_id`     | Int      | Nullable       | ID của phiếu nhập hoặc hóa đơn liên quan.       |
| `created_at`       | DateTime | Default: now() | Ngày lưu log.                                   |

---

## 5. Phân Hệ Nhân Sự (Shift Management)

### Bảng `shifts` (Ca làm việc)

| Field           | Type     | Attributes     | Description                         |
|:----------------|:---------|:---------------|:------------------------------------|
| `id`            | String   | PK, UUID(7)    | Mã ca.                              |
| `staff_id`      | String   | FK -> users    | Nhân viên trực.                     |
| `start_time`    | DateTime | Default: now() | Giờ mở ca.                          |
| `end_time`      | DateTime | Nullable       | Giờ chốt ca.                        |
| `starting_cash` | Decimal  |                | Tiền két lúc đầu ca.                |
| `ending_cash`   | Decimal  | Nullable       | Tiền két lúc chốt ca (đếm thực tế). |
| `expected_cash` | Decimal  | Nullable       | Tiền két lý thuyết (để đối soát).   |

---

## 6. Phân Hệ Thiết Bị (Equipment Management)

### Bảng `equipments` (Tài sản)

| Field           | Type   | Attributes       | Description                      |
|:----------------|:-------|:-----------------|:---------------------------------|
| `id`            | String | PK, UUID(7)      | Mã thiết bị.                     |
| `room_id`       | String | FK -> rooms      | Nằm ở phòng nào.                 |
| `name`          | String |                  | Tên thiết bị (VD: Loa JBL).      |
| `serial_number` | String | Unique, Nullable | Mã Serial bảo hành.              |
| `status`        | Enum   | Default: ACTIVE  | `ACTIVE`, `REPAIRING`, `BROKEN`. |

### Bảng `maintenance_logs` (Lịch sử bảo trì)

| Field              | Type     | Attributes       | Description           |
|:-------------------|:---------|:-----------------|:----------------------|
| `id`               | String   | PK, UUID(7)      | Mã lần bảo trì.       |
| `equipment_id`     | String   | FK -> equipments | Bảo trì thiết bị nào. |
| `maintenance_date` | DateTime | Default: now()   | Ngày bảo trì.         |
| `description`      | String   | Text             | Chi tiết sửa chữa.    |
| `cost`             | Decimal  |                  | Chi phí.              |

---
*Document generated for Prisma & PostgreSQL schema architecture.*
