import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tổng quan" };

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-foreground">Tổng quan</h1>
      <p className="text-muted-foreground mt-1">Chào mừng bạn đến với KTV Staff Portal.</p>
    </div>
  );
}
