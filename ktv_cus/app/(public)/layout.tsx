import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "K-Master Portal | Hệ Thống Đặt Phòng Karaoke VIP",
  description: "Trang đặt phòng, quản lý dịch vụ Karaoke chuyên nghiệp hàng đầu.",
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
