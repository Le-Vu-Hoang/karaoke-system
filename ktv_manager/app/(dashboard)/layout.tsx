import { Sidebar } from "@/presentation/shared_ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Sidebar />
      <div className="ml-64 flex flex-grow flex-col">
        {/* Main Content Area */}
        <main className="w-full max-w-[calc(1920px-256px)] flex-grow p-8 pb-20">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="mt-auto w-full border-t border-outline-variant/10 bg-surface-container-lowest py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-8 md:grid-cols-4">
            <div>
              <span className="mb-3 block font-headline-md text-2xl font-bold text-primary">
                LUNA KARAOKE
              </span>
              <p className="text-xs text-on-surface-variant">
                © 2026 LUNA KARAOKE. SING YOUR HEART OUT.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-on-surface-variant transition-all hover:text-primary">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-sm text-on-surface-variant transition-all hover:text-primary">
                Điều khoản dịch vụ
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-on-surface-variant transition-all hover:text-primary">
                Đối tác địa điểm
              </a>
              <a href="#" className="text-sm text-on-surface-variant transition-all hover:text-primary">
                Hỗ trợ liên hệ
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
