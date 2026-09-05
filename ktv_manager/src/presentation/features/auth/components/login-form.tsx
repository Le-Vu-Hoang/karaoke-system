"use client";

import React, { useState } from "react";
import { Button } from "@/presentation/shared_ui/button";
import { Lock, Loader2, Phone } from "lucide-react";
import { useLoginMutation } from "@/presentation/features/auth/hooks/use-login";

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !password) return;

    login({ phoneNumber, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Phone Input */}
      <div className="relative">
        <Phone className="text-on-surface-variant absolute top-1/2 left-3 size-6 -translate-y-1/2" />
        <input
          type="tel"
          placeholder="Nhập số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isPending}
          className="bg-surface-container-low border-outline-variant/30 placeholder:text-primary-fixed w-full rounded-lg border py-3 pr-4 pl-11 transition-all duration-300 focus:outline-none"
          required
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <Lock className="text-on-surface-variant absolute top-1/2 left-3 size-5 -translate-y-1/2" />
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          className="bg-surface-container-low border-outline-variant/30 placeholder:text-primary-fixed w-full rounded-lg border py-3 pr-4 pl-11 transition-all duration-300 focus:outline-none"
          required
        />
      </div>

      {/* Nút Đăng nhập */}
      <Button
        type="submit"
        disabled={isPending}
        className="from-primary to-secondary mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r py-3 font-bold text-white transition-all hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] disabled:opacity-50"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Đang xác thực...
          </span>
        ) : (
          "Đăng Nhập"
        )}
      </Button>
    </form>
  );
}
