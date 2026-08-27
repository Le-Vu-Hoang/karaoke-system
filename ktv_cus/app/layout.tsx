import "@/env";
import type { Metadata } from "next";
import { Sora, Hanken_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/presentation/providers";
import { cn } from "@/shared/lib/utils";
import { ThemeProvider } from "@/presentation/shared_ui/theme-provider";

const soraFont = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const hankenFont = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUNA KARAOKE | Hệ Thống Đặt Phòng Karaoke VIP",
  description: "Trang đặt phòng, quản lý dịch vụ Karaoke chuyên nghiệp hàng đầu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={cn(
        "dark",
        "h-full",
        "antialiased",
        soraFont.variable,
        hankenFont.variable,
        monoFont.variable
      )}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
