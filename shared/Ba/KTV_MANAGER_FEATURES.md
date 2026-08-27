# Product Requirements Document (PRD) - Giao diện Quản lý (ktv_manager)

**Dự án:** K-Master Karaoke Management System
**Phân hệ:** Staff & Admin Portal (Ứng dụng nội bộ)
**Đối tượng sử dụng:** Lễ tân, Nhân viên phục vụ, Quản lý, Chủ quán.

---

## 1. Tổng Quan (Overview)

Giao diện `ktv_manager` là trung tâm điều khiển toàn bộ hoạt động vận hành của quán Karaoke. Ứng dụng này đòi hỏi tốc độ phản hồi cực nhanh (real-time) và tính ổn định cao để đảm bảo lễ tân và nhân viên có thể phục vụ khách hàng liên tục, đặc biệt vào những khung giờ cao điểm.

Hệ thống phân chia rõ ràng hai vai trò chính:
- **Staff (Lễ tân / Phục vụ):** Tập trung vào việc vận hành hàng ngày (nhận/trả phòng, gọi món, thanh toán, quản lý ca làm).
- **Admin (Quản lý / Chủ quán):** Tập trung vào cấu hình hệ thống, quản lý kho, nhân sự và xem báo cáo tài chính.

---

## 2. Phân quyền (Roles & Permissions)

| Module | Chức năng | Staff | Admin |
|--------|-----------|-------|-------|
| **Auth** | Đăng nhập (Mật khẩu / QR Code) | ✅ | ✅ |
| **Room** | Xem sơ đồ phòng (Live Dashboard) | ✅ | ✅ |
| **Room** | Mở phòng, chuyển phòng, báo bảo trì | ✅ | ✅ |
| **Booking** | Xem danh sách đặt trước, xác nhận, hủy | ✅ | ✅ |
| **Order** | Gọi món, thêm dịch vụ vào phòng | ✅ | ✅ |
| **Billing** | Tính tiền, áp mã giảm giá, thanh toán | ✅ | ✅ |
| **Shift** | Bắt đầu ca, kết thúc ca, chốt tiền mặt | ✅ | ✅ |
| **Inventory**| Nhập hàng, kiểm kho, xem tồn kho | ❌ | ✅ |
| **Master Data**| Quản lý Dịch vụ, Phòng, Khung giá, Voucher| ❌ | ✅ |
| **Report** | Xem báo cáo doanh thu, hiệu suất | ❌ | ✅ |
| **User** | Quản lý tài khoản nhân viên | ❌ | ✅ |

---

## 3. Chi tiết Chức Năng Dành Cho Staff (Vận hành)

### 3.1. Quản lý Ca làm việc (Shift Management)
*Nhân viên bắt buộc phải mở ca trước khi có thể thực hiện các nghiệp vụ thanh toán.*
- **Bắt đầu ca (Clock-in):** Khai báo số tiền mặt ban đầu trong két (`startingCash`).
- **Kết thúc ca (Clock-out):** Hệ thống tự động tính toán số tiền mặt dự kiến (`expectedCash`). Nhân viên nhập số tiền mặt thực tế (`endingCash`) để chốt ca.
- **Lịch sử ca làm:** Xem lại lịch sử các ca mình đã làm.

### 3.2. Bảng điều khiển Sơ đồ phòng (Live Room Dashboard)
*Giao diện quan trọng nhất, hiển thị trực quan toàn bộ quán.*
- **Trực quan hóa:** Hiển thị danh sách các phòng dưới dạng lưới (Grid) hoặc danh sách, nhóm theo Tầng hoặc `RoomType` (VIP, Thường).
- **Màu sắc trạng thái:** 
  - 🟢 Trống (Available)
  - 🔴 Đang sử dụng (In-Use) - *hiển thị cả thời gian đã hát.*
  - 🟡 Chờ dọn dẹp (Cleaning) / ⚪ Bảo trì (Maintenance)
- **Tương tác nhanh:** Click vào phòng trống để Mở phòng/Check-in booking. Click vào phòng đang hát để Gọi món/Tính tiền.
- **Real-time:** Tự động cập nhật trạng thái khi có nhân viên khác thao tác (thông qua WebSocket).

### 3.3. Quản lý Đặt phòng (Booking Management)
- **Danh sách Booking:** Xem danh sách khách hàng đặt trước trong ngày, tuần.
- **Bộ lọc:** Lọc theo trạng thái (Pending, Confirmed, Cancelled, Arrived).
- **Thao tác:** 
  - Xác nhận nhận cọc (nếu có).
  - Hủy booking (ghi chú lý do).
  - Check-in: Chuyển booking thành trạng thái phòng Đang sử dụng (gán vào một phòng cụ thể).

### 3.4. Gọi món & Dịch vụ (In-Room Ordering)
- **Menu Dịch vụ:** Hiển thị menu đồ ăn/nước uống phân theo danh mục (`ServiceCategory`).
- **Tìm kiếm:** Tìm kiếm nhanh bằng tên hoặc mã sản phẩm.
- **Cảnh báo hết hàng:** Ẩn hoặc làm mờ các mặt hàng có `stockQuantity` = 0.
- **Giỏ hàng phòng:** Thêm/bớt số lượng. Ghi chú món (vd: "ít đá", "không hành").
- **Xác nhận Order:** Khi bấm lưu, hệ thống tự động sinh `InvoiceService` và đẩy sự kiện trừ kho.

### 3.5. Tính tiền & Trả phòng (Billing & Checkout)
- **Chi tiết Bill:** 
  - Hiển thị giờ vào (`startTime`), giờ ra dự kiến/hiện tại (`endTime`).
  - Hệ thống tự động tính tiền giờ (`roomTotal`) dựa theo bảng giá động (`PriceRule`).
  - Danh sách dịch vụ đã gọi (`servicesTotal`).
- **Giảm giá:** Nhập mã Voucher hoặc giảm giá thủ công (cần quyền Admin hoặc yêu cầu phê duyệt).
- **Thanh toán:** 
  - Tách/Gộp bill (Tùy chọn nâng cao).
  - Chọn phương thức thanh toán: Tiền mặt, Thẻ tín dụng, Chuyển khoản, Momo QR.
  - In hóa đơn tạm tính / Hóa đơn chính thức.
- **Hoàn tất:** Trả phòng, đổi trạng thái phòng về "Chờ dọn dẹp".

### 3.6. Quản lý Thiết bị & Sự cố
- Báo cáo hư hỏng thiết bị trong phòng (Micro, Màn hình, Điều hòa) kèm mô tả.

---

## 4. Chi tiết Chức Năng Dành Cho Admin (Quản trị)

*Admin có quyền truy cập tất cả các chức năng của Staff, cộng thêm các phân hệ sau:*

### 4.1. Quản lý Danh mục Cơ sở (Master Data)
- **Room & RoomType:** Thêm/sửa/xóa phân loại phòng và danh sách phòng thực tế.
- **Price Rules (Cấu hình giá giờ):** Thiết lập giá linh hoạt. Ví dụ: Thứ 2-6 (8h-18h): 100k/h; Thứ 7-CN (18h-23h): 250k/h.
- **Service & Category:** Thêm/sửa/xóa Menu đồ ăn, thức uống. Cập nhật giá bán.
- **Voucher:** Tạo chương trình khuyến mãi (Giảm %, Giảm tiền mặt, Điều kiện hóa đơn tối thiểu, Ngày bắt đầu/kết thúc).

### 4.2. Quản lý Kho & Mua hàng (Inventory & Supply)
- **Suppliers:** Quản lý danh bạ nhà cung cấp (Tên, SĐT).
- **Purchase Orders (Nhập kho):** Tạo đơn nhập hàng từ nhà cung cấp, ghi nhận chi phí và tự động cộng dồn vào `stockQuantity`.
- **Inventory Logs:** Xem lịch sử xuất/nhập/hủy của từng mặt hàng để đối soát. Báo cáo hàng tồn kho thấp.

### 4.3. Quản lý Nhân sự (HR Management)
- **Tài khoản:** Tạo tài khoản cho nhân viên, cấp lại mật khẩu, khóa tài khoản.
- **Báo cáo Ca làm (Shift Logs):** Theo dõi lịch sử ca làm của từng nhân viên, đối soát sự chênh lệch tiền mặt.

### 4.4. Báo cáo & Thống kê (Dashboard & Analytics)
- **Báo cáo Tổng quan:** Doanh thu trong ngày/tuần/tháng, Tỷ lệ lấp đầy phòng.
- **Báo cáo Dịch vụ:** Top mặt hàng bán chạy nhất.
- **Báo cáo Ca:** Doanh thu theo từng ca làm việc, phương thức thanh toán.

---

## 5. Non-Functional Requirements (Yêu cầu phi chức năng UI/UX)

- **Giao diện tối ưu thao tác:** Khu vực Lễ tân cần thao tác nhanh. Nên hỗ trợ **phím tắt (Keyboard shortcuts)** cho các thao tác: Tìm phòng (Ctrl+F), Mở phòng mới (Ctrl+N), Chuyển sang tab Thanh toán (F9).
- **Responsive:** 
  - Lễ tân/Thu ngân: Tối ưu cho màn hình Desktop / POS (1080p).
  - Phục vụ: Tối ưu cho màn hình Tablet (iPad) để nhân viên cầm đi order tại phòng.
- **Cảnh báo âm thanh / Visual:** Khi có khách đặt phòng online mới, hoặc phòng sắp hết giờ (nếu khách mua theo block giờ), hiển thị toast notification có âm thanh nhẹ.
- **Khả năng offline (Resilience):** Có cơ chế retry hoặc hiển thị cảnh báo rõ ràng khi mất kết nối Internet/Socket.
- **Theme:** Đồng nhất Design System "Neon Pulse" (Dark mode) giúp bảo vệ mắt cho nhân viên làm ca đêm.
