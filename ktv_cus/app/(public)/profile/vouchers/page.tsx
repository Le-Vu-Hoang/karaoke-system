import VoucherClient from "@/presentation/features/profile/components/vouchers/voucher-client";

export const metadata = {
  title: "Kho Voucher Của Tôi | LUNA KARAOKE",
  description: "Quản lý và sử dụng các mã giảm giá, voucher quà tặng ưu đãi độc quyền dành riêng cho thành viên Luna Karaoke.",
};

export default function VouchersPage() {
  return <VoucherClient />;
}
