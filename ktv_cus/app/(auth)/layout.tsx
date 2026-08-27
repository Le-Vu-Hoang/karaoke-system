import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Luna Karaoke - Đăng nhập & Đăng ký",
  description: "Hệ thống đặt phòng Karaoke VIP.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
