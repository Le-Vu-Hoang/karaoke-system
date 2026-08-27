export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar sẽ được implement tại đây */}
      <aside className="w-64 shrink-0 bg-sidebar-background border-r border-sidebar-border" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
