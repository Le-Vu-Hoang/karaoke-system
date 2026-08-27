import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/presentation/providers";

export const metadata: Metadata = {
  title: {
    template: "%s | KTV Staff Portal",
    default: "KTV Staff Portal — Hệ thống Quản lý Karaoke",
  },
  description:
    "Cổng quản lý nội bộ dành cho Staff và Admin của hệ thống Karaoke Luna VIP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
