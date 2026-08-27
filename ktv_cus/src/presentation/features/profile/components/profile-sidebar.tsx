"use client";

import {LayoutDashboard, Award, Ticket, History} from "lucide-react";
import {useAuthStore} from "@/shared/stores/use-auth-store";
import {useStore} from "@/shared/stores/use-store";
import {usePathname} from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const sidebarLinks = [
    {label: "Dashboard", icon: <LayoutDashboard className="size-5"/>, href: "/profile"},
    {label: "Membership", icon: <Award className="size-5"/>, href: "/profile/memberships"},
    {label: "Vouchers", icon: <Ticket className="size-5"/>, href: "/profile/vouchers"},
    {label: "History", icon: <History className="size-5"/>, href: "/profile/history"},
];

export default function ProfileSidebar() {
    const user = useStore(useAuthStore, (state) => state.user);
    const pathname = usePathname();

    return (
        <aside
            className="hidden lg:flex flex-col py-8 fixed left-0 top-16 md:top-20 h-[calc(100vh-80px)] w-64 bg-surface-container-lowest/85 backdrop-blur-2xl border-r border-outline-variant/10 shadow-2xl z-30">
            <div className="px-6 mb-8 mt-4">
                <div
                    className="flex items-center gap-3 p-4 bg-surface-container/50 border border-outline-variant/10 rounded-2xl">
                    <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden flex-shrink-0 relative">
                        <Image
                            className="object-cover"
                            fill
                            sizes="40px"
                            alt={user?.fullName || "User Avatar"}
                            src={user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"}
                            priority
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-sans text-xs text-primary font-bold truncate">
                            {user?.fullName || "Khách"}
                        </p>
                        <p className="text-[10px] text-on-surface-variant font-medium truncate">Member</p>
                    </div>
                </div>
            </div>

            <nav className="flex flex-col gap-1 px-4">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-sans text-sm font-semibold transition-all duration-300 ${
                                isActive
                                    ? "bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary text-primary font-bold"
                                    : "text-on-surface-variant hover:bg-white/5 hover:text-secondary"
                            }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
