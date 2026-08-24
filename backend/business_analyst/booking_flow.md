# Tài Liệu Phân Tích Nghiệp Vụ - Luồng Đặt Phòng (Booking Flow)

Tài liệu này mô tả chi tiết luồng nghiệp vụ đặt phòng và thanh toán trong hệ thống KTV. Luồng này bao gồm sự phối hợp giữa Frontend (Next.js) và Backend (NestJS), đặc biệt tập trung vào cơ chế "Chống phân mảnh phòng" và "Giữ chỗ".

---

## 1. Các Trạng Thái Của Booking (Booking Status)

Mỗi đơn đặt phòng (Booking) có vòng đời như sau:
- **`PENDING`**: Khách hàng đã tạo đơn đặt phòng thành công trên hệ thống nhưng chưa hoàn tất thanh toán tiền cọc.
- **`CONFIRMED`**: Hệ thống đã nhận được tiền cọc (thông qua Webhook của MoMo/Stripe/VNPay). Booking chính thức có hiệu lực và phòng được giữ.
- **`ARRIVED`**: Khách hàng đã đến quán và nhân viên thực hiện thao tác Check-in. Lúc này hệ thống sẽ tự động tạo Hóa Đơn (Invoice) và chuyển trạng thái phòng sang `IN_USE`.
- **`CANCELLED`**: Khách hàng hủy đặt phòng hoặc quá thời gian thanh toán cọc/quá giờ check-in mà không đến (hệ thống tự động hủy).

---

## 2. Luồng Nghiệp Vụ Tạo Đặt Phòng (Creation Flow)

### 2.1. Bước 1: Khách hàng chọn thời gian (Frontend)
- Khách hàng chọn Ngày và Khung Giờ (ví dụ: `19:00 - 21:00`).
- **Gọi API Availability**: Frontend gọi API `GET /rooms/types/:id/availability?date=...`.
  - Backend trả về danh sách các khung giờ bị bận (ví dụ: `[{ start: 20, end: 22 }]`).
  - Frontend sẽ chặn (disable) nút "Tiếp Tục" nếu khách hàng chọn đè vào khung giờ đỏ.

### 2.2. Bước 2: Tạo Booking & Cơ chế chống phân mảnh (Backend)
- Khách hàng điền thông tin và bấm "Xác Nhận". Frontend gọi `POST /bookings`.
- **Thuật toán Chống Phân Mảnh (Anti-fragmentation)**:
  - Backend truy xuất toàn bộ phòng vật lý (Room 101, 102...) thuộc loại phòng khách chọn.
  - Backend lặp qua từng phòng và kiểm tra: *Phòng này có bị kẹt lịch (Overlap) với bất kỳ Booking nào có trạng thái `PENDING`, `CONFIRMED`, hoặc `ARRIVED` trong khung giờ `19:00 - 21:00` không?*
  - Nếu phòng 101 trống suốt khoảng thời gian đó, Backend sẽ tự động gán `roomId = 101` cho Booking mới.
  - Nếu tất cả các phòng đều vướng lịch, Backend trả về lỗi: `"Không có phòng nào trống xuyên suốt khung giờ bạn chọn!"` (Việc này ngăn chặn tình trạng khách hát 2 tiếng nhưng phải chuyển phòng giữa chừng).

### 2.3. Bước 3: Tính tiền cọc và Khởi tạo Thanh toán
- Backend tự động tính tiền phòng dựa vào bảng `price_rules` (Giá động theo giờ/ngày lễ).
- Số tiền cọc mặc định bằng **tiền của 1 giờ hát đầu tiên**.
- Backend gọi module `PaymentService` để sinh mã giao dịch (VD: MoMo QR URL hoặc Stripe PaymentIntent) và trả về Frontend.

---

## 3. Luồng Thanh Toán (Payment Webhook)

Hệ thống tích hợp cổng thanh toán bên thứ 3 (MoMo, VNPay, Stripe).

- Khi khách hàng quét mã MoMo và thanh toán thành công, MoMo sẽ gửi một HTTP Request (Webhook) ngầm về server NestJS.
- **Xử lý Webhook**:
  1. Backend nhận payload từ MoMo.
  2. Xác thực chữ ký `signature` bằng Secret Key để chống giả mạo.
  3. Trích xuất `orderId` (chính là `paymentSessionRef` của Booking).
  4. Đổi trạng thái Booking từ `PENDING` sang `CONFIRMED`.

---

## 4. Luồng Check-in Của Nhân Viên

Khi khách hàng đến quán:
1. Nhân viên tìm kiếm Booking bằng SĐT hoặc Tên khách.
2. Hệ thống hiển thị Booking và Phòng vật lý đã được gán sẵn (ví dụ: Phòng 101).
3. Nhân viên bấm "Check-in" (`POST /bookings/:id/check-in`).
4. **Transaction (Xử lý đồng thời):**
   - Đổi trạng thái Booking thành `ARRIVED`.
   - Đổi trạng thái Room 101 thành `IN_USE`.
   - Tạo một Hóa Đơn (`Invoice`) mới tinh trạng thái `UNPAID` với `start_time = NOW()`, trừ đi tiền cọc khách đã trả vào tổng tiền `final_total`.

---

## 5. Các Kịch Bản Ngoại Lệ (Edge Cases)

- **Timeout cọc**: Nếu Booking ở trạng thái `PENDING` quá 15 phút mà không có Webhook báo thanh toán thành công, hệ thống (CronJob) sẽ tự động chuyển thành `CANCELLED` để giải phóng `roomId` cho khách khác.
- **Khách đổi ý muốn ở lại lâu hơn**: Nếu khách đang hát và báo muốn tăng giờ, nhân viên không cần sửa Booking. Nhân viên chỉ cần không check-out hóa đơn. Hóa đơn sẽ cứ tính tiền dựa trên `NOW() - start_time`. (Tuy nhiên, nhân viên phải báo khách nếu khung giờ sau đã có khách khác Booking phòng này).
