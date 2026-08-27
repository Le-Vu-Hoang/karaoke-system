"use client";

import { useRouter } from "next/navigation";
import { 
  Home, 
  Search, 
  Calendar, 
  UserCircle 
} from "lucide-react";
import { useAuthStore } from "@/shared/stores/use-auth-store";
import { useStore } from "@/shared/stores/use-store";
import ProfileHeader from "./profile-header";
import LoyaltyCard from "./loyalty-card";
import VoucherList from "./voucher-list";
import AccountManagement from "./account-management";

export default function ProfileClient() {
  const router = useRouter();
  const user = useStore(useAuthStore, (state) => state.user);
  const isAuthenticated = useStore(useAuthStore, (state) => state.isAuthenticated);

  if (isAuthenticated === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-on-surface-variant font-medium text-sm">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  // If not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-surface-container/60 border border-primary/15 rounded-3xl p-8 w-1/3 text-center backdrop-blur-xl shadow-2xl">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <UserCircle className="size-10 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Yêu cầu đăng nhập</h2>
          <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
            Vui lòng đăng nhập để xem thông tin tài khoản, tích lũy điểm L-Points và quản lý các voucher ưu đãi của bạn.
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
    <div className="w-full relative flex flex-col pt-6 px-4 sm:px-6 md:px-12">
      {/* Decorative Blurs for Neon Glow */}
      <div className="fixed top-20 right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-40 left-[-10%] w-80 h-80 bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col gap-6 w-full">
        {/* Header Photo & Name Banner */}
        <ProfileHeader user={user} />

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start mt-6">
          {/* L-Points Balance Card */}
          <div className="xl:col-span-5 w-full">
            <LoyaltyCard />
          </div>

          {/* Vouchers List */}
          <div className="xl:col-span-7 w-full">
            <VoucherList />
          </div>
        </div>

        {/* Settings / Account management grid */}
        <AccountManagement />
      </div>

      {/* Mobile Bottom Navigation Bar (Visual Sync) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-surface-container/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center h-20 px-4 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <Home className="size-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/rooms")}
          className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <Search className="size-5" />
          <span className="text-[10px] font-bold">Search</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/booking")}
          className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
        >
          <Calendar className="size-5" />
          <span className="text-[10px] font-bold">Bookings</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-1 bg-primary/20 text-primary rounded-full px-4 py-1.5 transition-all duration-200 cursor-pointer"
        >
          <UserCircle className="size-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </nav>
    </div>
  );
}
