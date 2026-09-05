# Báo Cáo Tính Năng: Check-in (Nhận Phòng) Dành Cho Staff
**Dự án:** K-Master Karaoke Management System
**Cập nhật lần cuối:** 2026-09-03

## 1. Phân Tích Những Sai Sót Logic Ban Đầu

Qua quá trình rà soát logic (Backend & Frontend) liên quan đến việc tạo Invoice khi nhận phòng, hệ thống bộc lộ 3 sai sót lớn:

1. **Thất thoát tiền cọc (Deposit):** Trong module `invoice.service.ts`, hàm `checkout` hoàn toàn bỏ qua khoản cọc (`booking.deposit`) của khách hàng khi đặt trước. Điều này khiến cho hệ thống tính toán sai lệch và khách hàng có thể bị thu tiền hai lần đối với khoản đặt cọc.
2. **Lỗ hổng xử lý khách vãng lai (Walk-in):** Khi khách vãng lai tới hát, nhân viên tạo `Invoice` nhưng trạng thái phòng vật lý (`Room`) không hề được cập nhật sang `IN_USE`. Phòng đó trên màn hình Dashboard vẫn báo trạng thái `AVAILABLE`. Hơn nữa, bảng `Invoice` không lưu trữ trường `guestName` và `guestPhone`, dẫn đến việc không ghi nhận được thông tin khách hàng nếu họ không tạo tài khoản.
3. **Frontend giao diện "chết" (Mock UI):** Màn hình Check-in (`checkin-dialog.tsx` và `page.tsx`) tại `ktv_manager` mới chỉ vẽ giao diện, hàm submit chỉ dùng `setTimeout` giả lập chứ chưa thực sự kết nối với API backend qua `TanStack Query`.

## 2. Kế Hoạch Đề Xuất (Plan)

Để giải quyết triệt để mà không cần sửa đổi Schema Prisma (tránh rủi ro migration), phương án được thống nhất là:

- **Backend:** 
  - Khấu trừ `deposit` vào hóa đơn lúc checkout.
  - Tạo một luồng API đặc biệt dành riêng cho khách vãng lai (`POST /bookings/walk-in`). Khi gọi API này, hệ thống tự động sinh ra một bản ghi `Booking` giả (trạng thái `ARRIVED`, cọc `0`, ghi chú `WALK_IN`). Sau đó dùng bản ghi này để tạo `Invoice` và cập nhật phòng thành `IN_USE`. Luồng này giúp tái sử dụng hoàn toàn cấu trúc dữ liệu hiện tại, đồng nhất dữ liệu cho hệ thống báo cáo (Bất kì Invoice nào cũng trỏ về 1 Booking).
- **Frontend:** 
  - Thêm một field là `durationHours` (Dự kiến hát) vào form Check-in để backend có cơ sở tính toán `endTime` của booking vãng lai.
  - Tích hợp `useMutation` để gọi API thật.

## 3. Các Bước Đã Thực Hiện (Execution)

1. **Khởi tạo Shared Contract:** Tạo `shared/api-types.ts` để định nghĩa `WalkInCheckInRequest` (Single source of truth).
2. **Xử lý khấu trừ tiền cọc:** Sửa hàm `checkout` trong `invoice.service.ts`, query kèm thông tin `booking` và trừ `booking.deposit` vào `finalTotal`.
3. **Phát triển Backend logic:**
   - Trong `booking.service.ts`, thêm hàm `walkInCheckIn` bọc trong `$transaction`. Hàm này tiếp nhận thời gian hát dự kiến (`durationHours`), tạo Booking từ mốc thời gian hiện tại, cập nhật trạng thái phòng và tạo hóa đơn.
   - Thêm decorator `@Post('walk-in')` vào `booking.controller.ts`.
4. **Kết nối Frontend (`ktv_manager`):**
   - Chỉnh sửa file API constants `api-endpoints.ts` và functions tại `bookings.ts`.
   - Cập nhật schema `zod` và giao diện `checkin-dialog.tsx` để hiển thị input "Dự kiến hát (Giờ)" với khách vãng lai.
   - Tại `page.tsx`, thêm TanStack `useMutation` và gọi hàm Check-in Booking (`checkInBooking`) hoặc Walk-in (`walkInCheckIn`) dựa theo mode trên form. Sau khi thành công, gọi `invalidateQueries` để cập nhật lại dashboard theo thời gian thực.

## 4. Những Thứ Có Thể Phát Triển Thêm (Future Development)

- **Gia hạn thời gian hát (Extend Time):** Với khách vãng lai đang hát và hết thời gian dự kiến (`endTime`), thêm tính năng cảnh báo và nút "Gia hạn thêm giờ" trên giao diện quản lý.
- **Tự động hủy phòng khi quá hạn Check-in (No-show):** Cài đặt một CRON Job chạy ngầm, nếu sau 30 phút so với giờ bắt đầu (`startTime`) mà khách đặt trước chưa đến, hệ thống sẽ tự động đổi trạng thái Booking sang `CANCELLED` (ghi chú `AUTO_CANCEL_TIMEOUT`), không hoàn cọc và trả phòng về trạng thái `AVAILABLE`.
- **In hóa đơn tạm tính (Pre-checkout receipt):** Tích hợp tính năng xuất PDF cho hóa đơn tạm tính (bao gồm tiền giờ đã qua + các món ăn, dịch vụ đã gọi) trước khi khách chính thức checkout.
- **WebSocket cập nhật Live:** Thay vì chỉ phụ thuộc vào cơ chế poll dữ liệu của `React Query`, có thể đẩy sự kiện thông qua WebSockets (Socket.io) để tất cả máy tính của nhân viên thu ngân khác đều chớp nháy/cập nhật màu phòng ngay lập tức khi phòng đó vừa được check-in.
