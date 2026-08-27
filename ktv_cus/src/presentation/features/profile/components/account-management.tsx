"use client";

import { Lock, Shield, Link as LinkIcon, LogOut, Settings } from "lucide-react";
import { useAuthStore } from "@/shared/stores/use-auth-store";
import { useRouter } from "next/navigation";

export default function AccountManagement() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/auth");
  };

  return (
    <section className="mt-12 md:mt-16">
      <h3 className="font-heading text-lg md:text-headline-md text-on-background mb-6 flex items-center gap-3 font-bold">
        <Settings className="size-6 text-primary" /> Quản lý tài khoản
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Change Password */}
        <button
          type="button"
          onClick={() => console.log("Change password")}
          className="bg-surface-container/70 border border-outline-variant/10 p-6 rounded-2xl flex flex-col items-center gap-4 hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer group shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Lock className="size-5" />
          </div>
          <span className="font-sans text-sm font-semibold text-foreground">
            Đổi mật khẩu
          </span>
        </button>

        {/* Privacy Settings */}
        <button
          type="button"
          onClick={() => console.log("Privacy settings")}
          className="bg-surface-container/70 border border-outline-variant/10 p-6 rounded-2xl flex flex-col items-center gap-4 hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer group shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
            <Shield className="size-5" />
          </div>
          <span className="font-sans text-sm font-semibold text-foreground">
            Cài đặt quyền riêng tư
          </span>
        </button>

        {/* Linked Accounts */}
        <button
          type="button"
          onClick={() => console.log("Linked accounts")}
          className="bg-surface-container/70 border border-outline-variant/10 p-6 rounded-2xl flex flex-col items-center gap-4 hover:bg-white/5 transition-all duration-300 active:scale-95 cursor-pointer group shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
            <LinkIcon className="size-5" />
          </div>
          <span className="font-sans text-sm font-semibold text-foreground">
            Tài khoản đã liên kết
          </span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="bg-surface-container/70 border border-error/20 p-6 rounded-2xl flex flex-col items-center gap-4 hover:bg-error/10 transition-all duration-300 active:scale-95 cursor-pointer group shadow-md"
        >
          <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center text-error group-hover:scale-110 transition-transform">
            <LogOut className="size-5" />
          </div>
          <span className="font-sans text-sm font-semibold text-error">
            Đăng xuất
          </span>
        </button>
      </div>
    </section>
  );
}
