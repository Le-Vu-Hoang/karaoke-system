"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {
    Home,
    Search as SearchIcon,
    Calendar as CalendarIcon,
    UserCircle,
    ChevronDown,
    AlertCircle,
} from "lucide-react";
import {useAuthStore} from "@/shared/stores/use-auth-store";
import {useStore} from "@/shared/stores/use-store";
import HistoryList from "./history-list";
import {useMyBooking} from "@/presentation/features/profile/hooks/use-my-booking";
import {UnderConstruction} from "@/presentation/shared_ui/under-construction";

export default function HistoryComponent() {
    const router = useRouter();
    const isAuthenticated = useStore(useAuthStore, (state) => state.isAuthenticated);

    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");

    //< query from api
    const {data: bookings, isLoading: bookingLoading, isError: bookingError} = useMyBooking();


    const handleBookingAction = (bookingId: string, actionType: string) => {
        alert(`Thực hiện hành động: ${actionType} cho đơn đặt phòng #${bookingId}`);
    };

    // Default to empty array if bookings is undefined (e.g. during loading)
    const filteredBookings = (bookings || []).filter((b) => {
        // Search query filter
        const matchesSearch = b.roomType.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Tab filter
        if (activeTab === "all") return true;
        if (activeTab === "upcoming") return b.status === "upcoming" || b.status === "pending";
        return b.status === activeTab;
    });

    if (isAuthenticated === undefined || bookingLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"/>
                    <p className="text-on-surface-variant font-medium text-sm">Đang tải lịch sử đặt phòng...</p>
                </div>
            </div>
        );
    }

    if (bookingError) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <UnderConstruction 
                    title="Lỗi tải dữ liệu" 
                    description="Đã xảy ra lỗi khi tải lịch sử đặt phòng của bạn. Vui lòng thử lại sau." 
                    showBackButton={false}
                    icon={AlertCircle}
                />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div
                    className="bg-surface-container/60 border border-primary/15 rounded-3xl p-8 w-full md:max-w-md text-center backdrop-blur-xl shadow-2xl">
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <UserCircle className="size-10 text-primary"/>
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Yêu cầu đăng nhập</h2>
                    <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                        Vui lòng đăng nhập để xem lịch sử và quản lý đặt phòng của bạn.
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

    return (
        <div className="w-full relative flex flex-col pt-6 pb-28 px-4 sm:px-6 md:px-12">
            {/* Background Blurs */}
            <div
                className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"/>
            <div
                className="absolute bottom-0 left-0 w-80 h-80 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none -z-10"/>

            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <h2 className="font-heading text-3xl md:text-headline-xl text-white font-extrabold tracking-tight mb-2 drop-shadow-[0_0_8px_rgba(236,178,255,0.2)]">
                        Lịch sử đặt phòng
                    </h2>
                    <p className="text-on-surface-variant text-sm md:text-body-lg">
                        Xem và quản lý các buổi karaoke rực rỡ của bạn tại Luna.
                    </p>
                </div>

                {/* Search controls */}
                <div className="flex gap-4 items-center">
                    <div className="relative w-full md:w-64">
                        <SearchIcon
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-5"/>
                        <input
                            type="text"
                            placeholder="Tìm tên phòng..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface-container-high border-none text-on-surface pl-10 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-primary/50 transition-all outline-none text-sm placeholder:text-on-surface-variant/60"
                        />
                    </div>
                </div>
            </header>

            {/* Filters Bar */}
            <section className="flex flex-wrap items-center gap-3 mb-8">
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    <button
                        type="button"
                        onClick={() => setActiveTab("all")}
                        className={`px-6 py-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
                            activeTab === "all"
                                ? "bg-primary text-on-primary-fixed shadow-md shadow-primary/30"
                                : "glass text-on-surface-variant hover:text-white"
                        }`}
                    >
                        Tất cả
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-6 py-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
                            activeTab === "upcoming"
                                ? "bg-primary text-on-primary-fixed shadow-md shadow-primary/30"
                                : "glass text-on-surface-variant hover:text-white"
                        }`}
                    >
                        Sắp tới
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("completed")}
                        className={`px-6 py-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
                            activeTab === "completed"
                                ? "bg-primary text-on-primary-fixed shadow-md shadow-primary/30"
                                : "glass text-on-surface-variant hover:text-white"
                        }`}
                    >
                        Đã hoàn thành
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("cancelled")}
                        className={`px-6 py-2 rounded-full font-bold text-xs md:text-sm whitespace-nowrap transition-all cursor-pointer ${
                            activeTab === "cancelled"
                                ? "bg-primary text-on-primary-fixed shadow-md shadow-primary/30"
                                : "glass text-on-surface-variant hover:text-white"
                        }`}
                    >
                        Đã hủy
                    </button>
                </div>

                {/* Date Selector */}
                <div
                    className="ml-auto flex items-center gap-2 glass px-4 py-2 rounded-xl cursor-pointer hover:bg-surface-bright transition-colors text-xs md:text-sm font-semibold text-on-surface-variant">
                    <CalendarIcon className="size-4"/>
                    <span>Tháng này</span>
                    <ChevronDown className="size-4"/>
                </div>
            </section>

            {/* Bookings List */}
            <HistoryList bookings={filteredBookings} onAction={handleBookingAction}/>

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
                    <SearchIcon className="size-5"/>
                    <span className="text-[10px] font-bold">Search</span>
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/profile/vouchers")}
                    className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
                >
                    <CalendarIcon className="size-5"/>
                    <span className="text-[10px] font-bold">Vouchers</span>
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