"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {
    Home,
    Search,
    Calendar,
    UserCircle,
    ChevronRight,
    Sparkles, TicketSlashIcon
} from "lucide-react";
import {useAuthStore} from "@/shared/stores/use-auth-store";
import {useStore} from "@/shared/stores/use-store";
import VoucherList from "./voucher-list";
import {Voucher} from "./voucher-card";
import {UnderConstruction} from "@/presentation/shared_ui/under-construction";
import {useMyVouchers} from "../../hooks/use-my-vouchers";

export default function VoucherClient() {
    const router = useRouter();
    const isAuthenticated = useStore(useAuthStore, (state) => state.isAuthenticated);
    const { data: myVouchers = [], isLoading, isError } = useMyVouchers({
        enabled: !!isAuthenticated
    });
    
    const [activeTab, setActiveTab] = useState<"unused" | "used" | "expired">("unused");

    const vouchers: Voucher[] = myVouchers.map(uv => ({
        id: uv.id,
        title: uv.voucher.discountType === 'PERCENTAGE' ? `GIẢM ${uv.voucher.discountValue}%` : `GIẢM ${uv.voucher.discountValue / 1000}K`,
        subtitle: uv.voucher.title,
        description: uv.voucher.description || "",
        code: uv.voucher.code,
        expiryDate: new Date(uv.voucher.validTo).toLocaleDateString('vi-VN'),
        status: uv.status.toLowerCase() as "unused" | "used" | "expired",
        category: uv.voucher.scope,
        iconType: "payments",
        borderClass: "border-l-primary",
        colorClass: "text-primary",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300"
    }));

    const handleUseVoucher = (code: string) => {
        alert(`Áp dụng mã Voucher: ${code}. Mã đã được lưu vào phiên đặt phòng.`);
    };

    const filteredVouchers = vouchers.filter((v) => v.status === activeTab);

    if (isLoading || isAuthenticated === undefined) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"/>
                    <p className="text-on-surface-variant font-medium text-sm">Đang tải kho voucher...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="bg-surface-container/60 border border-primary/15 rounded-3xl p-8 w-1/3 text-center backdrop-blur-xl shadow-2xl">
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <UserCircle className="size-10 text-primary"/>
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Yêu cầu đăng nhập</h2>
                    <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                        Vui lòng đăng nhập để xem danh sách voucher ưu đãi của bạn.
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push("/auth")}
                        className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(189,0,255,0.4)] active:scale-95 transition-all duration-300 cursor-pointer text-sm"
                    >
                        Đăng nhập ngay
                    </button>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <UnderConstruction
                    title="Lỗi kết nối"
                    description="Vui lòng thử lại sau."
                    showBackButton={false}
                    icon={TicketSlashIcon}
                />
            </div>
        );
    }

    return (
        <div className="w-full relative flex flex-col pt-6 pb-28 px-4 sm:px-6 md:px-12">
            {/* Background Blurs */}
            <div
                className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"/>
            <div
                className="absolute bottom-0 left-0 w-80 h-80 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none -z-10"/>

            {/* Title Header and Tabs Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                    <h2 className="font-heading text-3xl md:text-headline-xl text-white font-extrabold tracking-tight mb-3 drop-shadow-[0_0_8px_rgba(236,178,255,0.2)]">
                        My Vouchers
                    </h2>
                    <p className="text-on-surface-variant text-sm md:text-body-lg">
                        Quản lý các ưu đãi độc quyền dành riêng cho bạn.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div
                    className="flex p-1 bg-surface-container-highest/50 rounded-xl backdrop-blur-md border border-white/5 self-start md:self-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab("unused")}
                        className={`px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all cursor-pointer ${
                            activeTab === "unused"
                                ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(189,0,255,0.4)]"
                                : "text-on-surface-variant hover:text-white"
                        }`}
                    >
                        Chưa sử dụng
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("used")}
                        className={`px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all cursor-pointer ${
                            activeTab === "used"
                                ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(189,0,255,0.4)]"
                                : "text-on-surface-variant hover:text-white"
                        }`}
                    >
                        Đã sử dụng
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("expired")}
                        className={`px-5 py-2 rounded-lg font-bold text-xs md:text-sm transition-all cursor-pointer ${
                            activeTab === "expired"
                                ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(189,0,255,0.4)]"
                                : "text-on-surface-variant hover:text-white"
                        }`}
                    >
                        Hết hạn
                    </button>
                </div>
            </div>

            {/* Main Voucher List */}
            <VoucherList vouchers={filteredVouchers} onUse={handleUseVoucher}/>

            {/* Desktop Promo Banner (Promotional) */}
            <div
                className="hidden md:flex mt-12 relative rounded-3xl overflow-hidden h-64 items-center shadow-2xl border border-white/5">
                <div className="absolute inset-0 z-0">
                    <img
                        className="w-full h-full object-cover"
                        alt="Promotion banner"
                        src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"/>
                </div>
                <div className="relative z-10 px-8 md:px-12 max-w-2xl">
          <span
              className="bg-primary text-on-primary text-[10px] font-bold px-2.5 py-1 rounded mb-4 inline-block tracking-wider uppercase">
            LIMITED TIME
          </span>
                    <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white mb-3">
                        Gói Tiệc Cuối Năm
                    </h2>
                    <p className="text-on-surface-variant text-sm md:text-base mb-6 leading-relaxed">
                        Giảm đến 40% cho các nhóm trên 10 người. Đặt phòng ngay hôm nay để nhận thêm quà tặng!
                    </p>
                    <button
                        type="button"
                        className="bg-primary hover:bg-primary-fixed-dim text-on-primary px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer"
                    >
                        Khám phá ngay
                    </button>
                </div>
            </div>

            {/* Mobile Promo Section */}
            <div
                className="md:hidden mt-6 p-6 rounded-3xl bg-gradient-to-br from-primary-container/20 to-secondary-container/20 border border-white/10 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-container rounded-lg">
                        <Sparkles className="size-5 text-on-primary-container fill-on-primary-container/25"/>
                    </div>
                    <div>
                        <p className="font-heading text-sm font-bold text-on-surface">Đổi điểm lấy quà</p>
                        <p className="text-[11px] text-on-surface-variant">Bạn đang có 1,250 Luna Points</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => router.push("/profile/memberships")}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-xs text-primary flex items-center justify-center gap-2 hover:bg-white/10 transition-colors cursor-pointer"
                >
                    Đổi Voucher ngay
                    <ChevronRight className="size-4"/>
                </button>
            </div>

            {/* Mobile Bottom Navigation Bar (Visual Sync) */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center h-20 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
                <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
                >
                    <Home className="size-5"/>
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/rooms")}
                    className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
                >
                    <Search className="size-5"/>
                    <span className="text-[10px] font-bold">Search</span>
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/booking")}
                    className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
                >
                    <Calendar className="size-5"/>
                    <span className="text-[10px] font-bold">Bookings</span>
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/profile")}
                    className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
                >
                    <UserCircle className="size-5"/>
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </nav>
        </div>
    );
}
