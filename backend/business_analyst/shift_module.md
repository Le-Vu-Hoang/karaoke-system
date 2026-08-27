# Tài liệu phân tích nghiệp vụ (BA) - Module Shift (Quản lý ca làm việc)

## 1. Giới thiệu tổng quan
Module `Shift` được thiết kế để quản lý ca làm việc của nhân viên (staff) trong hệ thống, bao gồm việc theo dõi thời gian làm việc và kiểm soát dòng tiền mặt thu/chi trong ca làm việc đó.

## 2. Các thực thể liên quan
- **Shift (Ca làm việc)**: Lưu thông tin một ca trực của nhân viên.
- **User (Nhân viên)**: Người thực hiện mở ca và đóng ca.
- **Invoice (Hóa đơn)**: Các hóa đơn được thanh toán trong thời gian ca trực diễn ra (để tính toán doanh thu trong ca).

### Cấu trúc dữ liệu Shift
- `id`: Định danh ca làm việc (UUID).
- `staffId`: ID của nhân viên mở ca.
- `startTime`: Thời điểm bắt đầu ca.
- `endTime`: Thời điểm kết thúc ca.
- `status`: Trạng thái ca (`OPEN` - đang mở, `CLOSED` - đã đóng).
- `startingCash`: Tiền mặt ban đầu trong két khi bắt đầu ca.
- `endingCash`: Tiền mặt thực tế đếm được khi kết thúc ca.
- `expectedCash`: Tiền mặt dự kiến hệ thống tính toán (đầu ca + doanh thu thu được trong ca).

## 3. Luồng nghiệp vụ (Business Flows)

### 3.1 Mở ca (Open Shift)
- **Actor**: Nhân viên (Staff).
- **Điều kiện**: Nhân viên không có ca nào đang ở trạng thái `OPEN`. (Mỗi nhân viên chỉ được mở 1 ca tại 1 thời điểm).
- **Hành động**: Nhân viên khai báo số tiền mặt hiện có trong két (`startingCash`). Hệ thống ghi nhận thời điểm mở ca `startTime = NOW()` và gán trạng thái `status = OPEN`.

### 3.2 Bán hàng / Quản lý hóa đơn trong ca
- Trong suốt quá trình ca trực ở trạng thái `OPEN`, các hóa đơn mà nhân viên này xử lý và thu tiền (chuyển sang trạng thái `PAID`) sẽ được hệ thống ghi nhận để tính toán tổng doanh thu.

### 3.3 Đóng ca (Close Shift)
- **Actor**: Nhân viên (Staff) hoặc Quản lý (Admin).
- **Điều kiện**: Ca làm việc phải đang ở trạng thái `OPEN`.
- **Hành động**:
  1. Nhân viên kiểm đếm tiền mặt thực tế trong két và nhập vào hệ thống (`endingCash`).
  2. Hệ thống ghi nhận `endTime = NOW()`.
  3. Hệ thống truy xuất tổng số tiền mặt thu được từ các hóa đơn (`Invoices`) do nhân viên này chốt (`status = PAID`) trong khoảng thời gian từ `startTime` đến `endTime`.
  4. Hệ thống tự động tính toán `expectedCash = startingCash + Tổng doanh thu thu được`.
  5. Cập nhật `status = CLOSED`.
- **Lưu ý**: Việc so khớp `endingCash` (thực tế) và `expectedCash` (hệ thống tính) sẽ giúp quản lý phát hiện dư/thiếu tiền mặt (chênh lệch).

### 3.4 Quản lý ca làm việc (View Shifts)
- Nhân viên có thể xem lịch sử các ca làm việc của chính mình.
- Quản trị viên (Admin) có thể xem lịch sử ca làm việc của tất cả nhân viên, kết hợp các bộ lọc tìm kiếm theo ngày, nhân viên, và trạng thái.

## 4. Danh sách APIs
1. `POST /shifts/open`: Mở ca mới.
2. `POST /shifts/:id/close`: Đóng ca hiện tại, tự động tính toán dòng tiền.
3. `GET /shifts`: Lấy danh sách ca (hỗ trợ lọc và phân trang).
4. `GET /shifts/:id`: Xem chi tiết 1 ca.
