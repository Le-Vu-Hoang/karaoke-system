# Báo Cáo Triển Khai: Giao Diện Staff Dashboard

Tôi đã hoàn tất việc chuyển đổi bản mockup HTML thành các React Components chuẩn xác cho dự án `ktv_manager`. Dưới đây là báo cáo chi tiết theo yêu cầu của bạn.

## 1. Trả Lời Câu Hỏi Của Bạn (Polling vs WebSockets)
> **Câu hỏi:** *Nên để thời gian request 1 lần thấp cỡ 10s để lấy Service Request (gọi món/hỗ trợ) hay dùng Socket? Cái nào lợi hơn, hại hơn?*

**Trả lời:** Đối với nghiệp vụ hệ thống Karaoke (yêu cầu tốc độ phản hồi cực nhanh khi khách gọi đồ), **bạn BẮT BUỘC nên dùng WebSockets (Socket.IO)**. 
- **Tại sao Polling 10s lại có hại?** Nếu quán có 10 nhân viên cùng mở Dashboard, mỗi 10 giây hệ thống sẽ nhận 10 request (1 phút = 60 request chỉ để hỏi "có gì mới không?"). 90% các request này sẽ trả về dữ liệu rỗng nếu không có khách gọi. Điều này gây tốn tài nguyên Server vô ích và làm tăng tải Database không cần thiết. Thêm nữa, độ trễ tối đa lên tới 10s là quá chậm cho ngành dịch vụ (khách bấm chuông mà 10s sau máy lễ tân mới tinh teng).
- **Lợi ích của WebSockets:** Bạn chỉ cần mở 1 kết nối duy nhất (như cách bạn đã làm ở chức năng quét mã QR `qr-login.tsx`). Khi nào khách thao tác ở phòng, Backend chủ động "bắn" (emit) tín hiệu `new-service-request` về màn hình lễ tân. Tốc độ nhận là **ngay lập tức (<100ms)** và Backend không phải chịu tải "hỏi thăm" liên tục.

---

## 2. Danh Sách Các File Đã Tạo & Chứa Gì

Tôi đã chia nhỏ giao diện thành cấu trúc FSD (Feature-Sliced Design) để dễ quản lý:

### Layout & Navigation
- **`app/(dashboard)/layout.tsx`**: File gốc bọc toàn bộ giao diện sau khi đăng nhập. Khai báo Layout khung Grid (thanh điều hướng trái, phần thân chính giữa và footer).
- **`src/presentation/shared_ui/sidebar.tsx`**: Chứa thanh Menu điều hướng bên trái (Icon, Tên Quán, Thông tin User).
- **`src/presentation/shared_ui/select.tsx`** & **`scroll-area.tsx`**: (Cài từ Shadcn) Dùng cho các thẻ cuộn mượt và Dropdown bộ lọc.

### Feature Components (Dashboard)
 Nằm tại `src/presentation/features/dashboard/components/`
- **`floor-status.tsx`**: Chứa Header "Sơ đồ phòng", thanh chú thích màu sắc, ô Tìm kiếm và 2 bộ lọc (Select) Shadcn.
- **`room-card.tsx`**: Component cốt lõi. Tôi đã code nó thành **Dùng chung (Reusable)**. Nó nhận `props` là `status` (in_use, available, clearing, maintenance) và tự động thay đổi màu sắc, icon, giao diện hiển thị cho phù hợp chuẩn Neon Pulse.
- **`upcoming-bookings.tsx`**: Chứa danh sách khách đặt trước. **(Đã thêm biến `roomNumber` vào UI theo yêu cầu của bạn)**.
- **`service-requests.tsx`**: Chứa thông báo chuông gọi của khách hàng.
- **`shift-status.tsx`**: Giao diện trạng thái ca làm việc, hiển thị tiền mặt và nút Kết thúc ca ở thanh bên phải.

### Trang Chính (Page)
- **`app/(dashboard)/page.tsx`**: Đây là màn hình trang chủ mà Lễ tân thấy đầu tiên. Chứa toàn bộ các Feature Component ở trên sắp xếp vào Grid 4 cột.

---

## 3. Liên Kết Dữ Liệu & API (Cần Cập Nhật Sau Này)

Để màn hình này "sống" được bằng dữ liệu thật, bạn sẽ cần chuẩn bị các API sau từ Backend (NestJS):

| Component / Chức năng | API Endpoint / Socket Event | Nhiệm vụ |
| :--- | :--- | :--- |
| **Sơ đồ phòng (RoomGrid)** | `GET /api/v1/rooms/live` | Trả về mảng danh sách phòng kèm trạng thái hiện tại (Đang hát, giờ vào, hóa đơn tạm tính). |
| **Sơ đồ phòng (Realtime)** | Socket: `room-status-changed` | Lắng nghe khi có phòng nào đổi trạng thái (bật nhạc, thanh toán xong) để render lại thẻ phòng. |
| **Upcoming Bookings** | `GET /api/v1/bookings/upcoming` | Lọc các booking có thời gian trong 2-4 giờ tới. Cần populate (join) thêm trường `roomNumber`. |
| **Service Requests** | Socket: `new-service-request` | Lắng nghe khi khách bấm chuông ở iPad trong phòng hát (Gọi bia, gọi nhân viên kỹ thuật). |
| **Shift Status** | `GET /api/v1/shifts/current` | Lấy dữ liệu tiền mặt đầu ca (`startingCash`), doanh thu tạm tính trong ca (`expectedCash`). |
| **Shift Status (Nút +/-)** | `POST /api/v1/shifts/petty-cash` | API để lễ tân ghi lại các khoản xuất tiền két mua lặt vặt (Petty cash). |

---

## 4. Các Thông Tin Bạn Cần Cập Nhật Thêm

1. **Routing:** Hiện tại các thanh Menu đang gắn `href="/..."`. Sau này bạn cần tạo các trang `/bookings`, `/rooms`, `/reports` tương ứng.
2. **Icons:** Tôi đã chủ động thay thế icon Google Material cũ thành `lucide-react` để tương thích 100% với Shadcn và Next.js.
3. **Màu sắc:** Các màu trạng thái tĩnh trong bản HTML đã được chuyển đổi hoàn toàn sang hệ màu chuẩn của dự án:
   - Red In Use $\rightarrow$ `bg-error`
   - Green Available $\rightarrow$ `bg-success`
   - Yellow Clearing $\rightarrow$ `bg-warning`
   - Blue Maintenance $\rightarrow$ `bg-notificate`
