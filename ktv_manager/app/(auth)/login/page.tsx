import type { Metadata } from "next";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="glass rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          KTV Staff Portal
        </h1>
        <p className="text-muted-foreground text-sm mb-6">
          Đăng nhập để tiếp tục quản lý hệ thống
        </p>
        {/* LoginForm component sẽ được implement tại đây */}
        <div className="rounded-md bg-surface-container p-4 text-muted-foreground text-sm">
          🚧 Tính năng đang được phát triển...
        </div>
      </div>
    </main>
  );
}
