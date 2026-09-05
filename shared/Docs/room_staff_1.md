# Kế Hoạch Triển Khai: Staff Dashboard (KTV Manager)

Dựa trên file `stich/code.html` và `stich/DESIGN.md`, tôi sẽ tiến hành chuyển đổi giao diện tĩnh thành cấu trúc React/Next.js components chuẩn cho ứng dụng quản lý Staff.

## 1. Kiến Trúc Components (Component Architecture)

Hệ thống sẽ được chia thành Layout Component (dùng chung) và Feature Components (dành riêng cho Dashboard).

### Layout Components
- `src/presentation/shared_ui/sidebar.tsx`: Thanh điều hướng bên trái (Navigation).
- `src/presentation/shared_ui/footer.tsx`: Chân trang chung.
- `app/(dashboard)/layout.tsx`: Layout bọc ngoài các trang nội bộ, chứa Sidebar và thẻ `<main>`.

### Feature Components (Dashboard)
Thư mục: `src/presentation/features/dashboard/components/`
- `floor-status.tsx`: Thanh công cụ lọc và tiêu đề của sơ đồ phòng.
- `room-card.tsx`: Component hiển thị từng phòng, nhận props để render trạng thái (Trống, Đang hát, Chờ dọn, Bảo trì).
- `upcoming-bookings.tsx`: Danh sách khách hàng sắp đến (Next 2 Hours).
- `service-requests.tsx`: Danh sách yêu cầu phục vụ realtime.
- `shift-status.tsx`: Bảng thông tin ca làm việc (Cột phải).

### Page Component
- `app/(dashboard)/page.tsx`: Lắp ráp tất cả các Feature Components lại thành màn hình Dashboard hoàn chỉnh.

---

## 2. Đồng Bộ Màu Sắc (Color Mapping)

Mockup HTML sử dụng các màu status hardcode (`status-red`, `status-green`). Tôi sẽ map chúng sang biến màu chuẩn của **Neon Pulse** đã cấu hình trong `tailwind.config.ts`:

- 🔴 `status-red` (In Use) -> `error` (Neon Red/Pink: `#ffb4ab`)
- 🟢 `status-green` (Available) -> `success` (Neon Emerald: `#69ffa8`)
- 🟡 `status-yellow` (Clearing) -> `warning` (Neon Amber: `#ffc83d`)
- 🔵 `status-blue` (Maintenance) -> `notificate` (Neon Light Blue: `#73c3ff`)
- Glassmorphism: Sử dụng `bg-surface-container/60 backdrop-blur-xl` kết hợp CSS `@utility glass`.

---

## 3. Sử dụng Shadcn/ui & Shared Components

- **Button**: Tái sử dụng `Button` từ Shadcn (đã cài đặt).
- **Select**: Cài đặt thêm `Select` component từ Shadcn để dùng cho các Filter (Loại phòng, Trạng thái).
- **ScrollArea**: Cài đặt thêm `ScrollArea` để hiển thị cuộn mượt cho Grid phòng và Danh sách thông báo thay vì dùng custom scrollbar CSS thuần.
- **Icons**: Sử dụng `lucide-react` (đang có sẵn) thay vì Google Material Symbols để đồng bộ chuẩn React Icon nhẹ và dễ custom hơn.

---

## 4. Danh sách API / Dữ liệu cần tích hợp sau này

Khi tích hợp dữ liệu thật, các components này sẽ cần các API sau từ Backend:
1. `GET /api/v1/rooms`: Lấy danh sách phòng và trạng thái hiện tại (dùng WebSocket để update realtime).
2. `GET /api/v1/bookings/upcoming`: Lấy danh sách khách hàng đặt trước trong 2-4 giờ tới.
3. `GET /api/v1/orders/requests`: Lấy danh sách yêu cầu dịch vụ (chuông gọi, gọi món).
4. `GET /api/v1/shifts/current`: Lấy thông tin ca làm việc hiện tại của nhân viên đang đăng nhập (thời gian, tiền trong két).
5. `POST /api/v1/shifts/end`: Chốt ca làm việc.

---

## ⚠️ User Review Required

Bạn có đồng ý với cấu trúc chia nhỏ Components và cách mapping màu sắc chuẩn Neon Pulse như trên không? 
*Lưu ý: Tôi sẽ dùng `lucide-react` thay vì `Material Symbols` như trong HTML cũ để tối ưu performance cho Next.js.*

Nếu bạn đồng ý, tôi sẽ tiến hành cài đặt thêm các component shadcn cần thiết và bắt đầu chia nhỏ code ngay lập tức.
