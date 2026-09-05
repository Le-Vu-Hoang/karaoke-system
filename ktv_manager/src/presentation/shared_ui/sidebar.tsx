"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mic2,
  LayoutDashboard,
  CalendarDays,
  DoorOpen,
  BarChart2,
  Settings,
  UserCircle,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Bảng điều khiển", icon: LayoutDashboard },
  { href: "/bookings", label: "Đặt phòng", icon: CalendarDays },
  { href: "/rooms", label: "Sơ đồ phòng", icon: DoorOpen },
  { href: "/reports", label: "Báo cáo", icon: BarChart2 },
  { href: "/settings", label: "Cài đặt", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-outline-variant/20 bg-surface/80 p-6 shadow-[0_0_20px_rgba(189,0,255,0.15)] backdrop-blur-xl">
      {/* Brand */}
      <div className="mb-10 flex items-center gap-3">
        <Mic2 className="size-6 text-primary" />
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-[20px] font-extrabold text-transparent">
          LUNA KARAOKE
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-grow flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 font-medium transition-all",
                isActive
                  ? "border-l-2 border-primary bg-primary/10 font-bold text-primary"
                  : "text-on-surface-variant hover:bg-surface-bright hover:text-secondary",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto flex items-center gap-3 border-t border-outline-variant/20 pt-6">
        <UserCircle className="size-8 text-primary" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-on-surface">Hoàng Admin</span>
          <span className="text-xs text-on-surface-variant">Lễ tân</span>
        </div>
      </div>
    </aside>
  );
}
