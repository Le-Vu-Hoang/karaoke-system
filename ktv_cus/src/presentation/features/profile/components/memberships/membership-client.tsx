"use client";

import { useRouter } from "next/navigation";
import {
Home,
Search,
Calendar,
    UserCircle,
Coins,
ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/shared/stores/use-auth-store";
import { useStore } from "@/shared/stores/use-store";
import MembershipTiers from "./membership-tiers";
import RedeemRewards from "./redeem-rewards";
import LunaStandard from "./luna-standard";

export default function MembershipClient() {
  const router = useRouter();
  const isAuthenticated = useStore(useAuthStore, (state) => state.isAuthenticated);
  const user = useStore(useAuthStore, (state) => state.user);

  if (isAuthenticated === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-on-surface-variant font-medium text-sm">Đang tải thông tin thành viên...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-surface-container/60 border border-primary/15 rounded-3xl p-8 w-1/3 text-center backdrop-blur-xl shadow-2xl">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <UserCircle className="size-10 text-primary" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Yêu cầu đăng nhập</h2>
          <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
            Vui lòng đăng nhập để xem thông tin thẻ thành viên, tích lũy điểm L-Points và đổi quà tặng đặc quyền.
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

  const points = user?.loyaltyPoints || 0;
  const tierName = user?.membershipTier?.name || "MEMBER";
  
  // Fake next milestone if not available in data
  const pointsToNext = user?.membershipTier?.minPoints ? Math.max(0, user.membershipTier.minPoints * 2 - points) : 1000;
  const progressPercent = Math.min(100, (points / (points + pointsToNext)) * 100);

  return (
<div className="w-full relative flex flex-col pt-6 pb-28 px-4 sm:px-6 md:px-12">
  {/* Decorative Blurs for Neon Glow */}
  <div className="fixed top-20 right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
  <div className="fixed bottom-40 left-[-10%] w-80 h-80 bg-secondary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

  {/* Header Section */}
  <header className="mb-10 flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
    <div className="max-w-3xl">
      <h2 className="font-heading text-3xl md:text-headline-xl text-white font-extrabold tracking-tight mb-4 drop-shadow-[0_0_8px_rgba(236,178,255,0.2)]">
        Membership &amp; Rewards
      </h2>
      <p className="text-on-surface-variant text-sm md:text-body-lg leading-relaxed">
        Elevate your singing experience. Unlock premium lounges, earn L-Points with every visit, and redeem them for exclusive perks.
      </p>
    </div>

    {/* L-Points Balance Card (Responsive desktop / mobile) */}
    <div className="glass-card rounded-2xl p-5 border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-between min-w-[280px] xl:max-w-sm">
      <div>
        <h4 className="font-sans text-[10px] md:text-xs text-on-surface-variant/80 uppercase tracking-widest font-bold mb-1">
          Available Balance
        </h4>
        <div className="flex items-baseline gap-2">
          <span className="font-heading text-2xl md:text-3xl font-extrabold text-primary">
            {points.toLocaleString('vi-VN')}
          </span>
          <span className="text-xs font-bold text-primary/80">L-Points</span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
        <Coins className="size-6 text-primary" />
      </div>
    </div>
  </header>

  {/* Progress to Next Tier Card */}
  <div className="mb-10 glass-card rounded-2xl p-6 relative overflow-hidden border border-outline-variant/10">
    <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-primary via-transparent to-secondary" />
    <div className="relative z-10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h4 className="font-sans text-xs text-on-surface-variant/80 uppercase tracking-widest font-bold">
            Current Tier
          </h4>
          <p className="font-heading text-lg md:text-xl font-bold text-white mt-1">
            {tierName}
          </p>
        </div>
        <span className="font-sans text-xs md:text-sm font-bold text-primary">
          {pointsToNext.toLocaleString('vi-VN')} <span className="text-on-surface-variant/80 font-normal">to next milestone</span>
        </span>
      </div>

      <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(236,178,255,0.5)] relative transition-all duration-1000" style={{ width: `${progressPercent}%` }}>
          <div className="absolute right-0 top-0 h-full w-2 bg-white blur-[2px] opacity-80" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-on-surface-variant">
          Tích lũy thêm điểm bằng cách sử dụng các dịch vụ đặt phòng và gọi đồ uống tại hệ thống Luna.
        </p>
        <button
          type="button"
          className="flex items-center gap-1 text-primary text-xs font-bold hover:underline cursor-pointer flex-shrink-0"
        >
          Earn More Points <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  </div>

  {/* Component Sections */}
  <div className="flex flex-col gap-6">
    {/* 1. Tiers Benefits Grid */}
    <MembershipTiers />

    {/* 2. Redeem rewards catalog */}
    <RedeemRewards />

    {/* 3. The standard perks list */}
    <LunaStandard />
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
      onClick={() => router.push("/profile")}
      className="flex flex-col items-center justify-center gap-1 text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
    >
      <UserCircle className="size-5" />
      <span className="text-[10px] font-bold">Profile</span>
    </button>
  </nav>
</div>
  );
}
