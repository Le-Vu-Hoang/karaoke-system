"use client";

import {useState} from "react";
import {Mic, Search, UserCircle, Menu, X, ChevronDown, User, History, LogOut, QrCode} from "lucide-react";
import {cn} from "@/shared/lib/utils";
import {useRouter, usePathname} from "next/navigation";
import {useAuthStore} from "@/shared/stores/use-auth-store";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/presentation/shared_ui/dropdown-menu";
import {apiClient} from "@/infrastructure/api/http-client";
import {API_ENDPOINTS} from "@/shared/constants/api-endpoints";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const {user, isAuthenticated, logout} = useAuthStore();

    const pathname = usePathname();

    const handleUserClick = () => {
        if (isAuthenticated) {
            router.push('/profile');
        } else {
            router.push('/auth');
        }
    };

    const handleLogout = async () => {
        try {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            logout();
            router.push('/auth');
        }
    };

    const navLinks = [
        {label: "Home", href: "/"},
        {label: "Service", href: "/services"},
        {label: "Booking", href: "/booking"},
        {label: "Room", href: "/rooms"},
    ].map(link => ({
        ...link,
        active: link.href === "/" 
            ? pathname === "/" 
            : link.href !== "#" && pathname.startsWith(link.href)
    }));

    return (
        <header
            className="sticky top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_0_20px_rgba(189,0,255,0.15)] transition-all duration-300">
            <div className="flex justify-between items-center px-margin max-w-7xl mx-auto h-16 md:h-20">
                {/* Logo */}
                <div className="flex items-center gap-xs cursor-pointer active:scale-95 transition-transform">
                    <Mic className="text-primary size-6 md:size-8 animate-pulse"/>
                    <span
                        className="font-heading text-lg md:text-headline-md font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            LUNA KARAOKE
          </span>
                </div>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-lg">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={cn(
                                "font-label-md text-label-md transition-colors duration-300 relative py-2 font-medium hover:text-secondary",
                                link.active
                                    ? "text-primary border-b-2 border-primary font-bold"
                                    : "text-on-surface-variant"
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Action Controls */}
                <div className="flex items-center gap-sm md:gap-md">
                    <button
                        className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer p-1.5 rounded-full hover:bg-surface-variant/30">
                        <Search className="size-5 md:size-6"/>
                    </button>

                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer text-foreground hover:text-primary transition-colors focus:outline-none py-1.5 px-3 rounded-full hover:bg-surface-variant/30 font-medium">
                                <span className="max-w-[120px] truncate text-sm md:text-base font-semibold">
                                    {user.fullName}
                                </span>
                                <ChevronDown className="size-4 opacity-70 shrink-0" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-surface-container border border-outline-variant/20 p-2 text-foreground rounded-lg shadow-lg">
                                <DropdownMenuItem
                                    onClick={() => router.push('/profile')}
                                    className="flex items-center gap-2 p-2.5 rounded-md cursor-pointer hover:bg-surface-variant/40 focus:bg-surface-variant/40 transition-colors"
                                >
                                    <User className="size-4 text-primary" />
                                    <span>Hồ sơ cá nhân</span>
                                </DropdownMenuItem>
                                {['STAFF', 'ADMIN'].includes(user.role) && (
                                    <DropdownMenuItem
                                        onClick={() => router.push('/scan-qr')}
                                        className="flex items-center gap-2 p-2.5 rounded-md cursor-pointer hover:bg-surface-variant/40 focus:bg-surface-variant/40 transition-colors"
                                    >
                                        <QrCode className="size-4 text-emerald-400" />
                                        <span>Quét QR Đăng nhập Web</span>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => router.push('/profile/history')}
                                    className="flex items-center gap-2 p-2.5 rounded-md cursor-pointer hover:bg-surface-variant/40 focus:bg-surface-variant/40 transition-colors"
                                >
                                    <History className="size-4 text-secondary" />
                                    <span>Lịch sử đặt lịch</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-outline-variant/20 my-1" />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 p-2.5 rounded-md cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <LogOut className="size-4" />
                                    <span>Đăng xuất</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div onClick={handleUserClick} className="cursor-pointer active:scale-95 transition-transform">
                            <UserCircle className="text-primary size-7 md:size-8 hover:text-primary/80 transition-colors"/>
                        </div>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex md:hidden text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-variant/30"
                    >
                        {isMobileMenuOpen ? <X className="size-6"/> : <Menu className="size-6"/>}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden absolute top-full left-0 w-full bg-surface-container/95 backdrop-blur-2xl border-b border-outline-variant/20 px-margin py-base flex flex-col gap-sm shadow-2xl animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col gap-sm py-xs">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "font-label-md text-label-md py-3 px-4 rounded-xl transition-all flex items-center gap-2",
                                    link.active
                                        ? "bg-primary-container/20 text-primary border border-primary/20"
                                        : "text-on-surface-variant hover:bg-surface-variant/30 hover:text-foreground"
                                )}
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
