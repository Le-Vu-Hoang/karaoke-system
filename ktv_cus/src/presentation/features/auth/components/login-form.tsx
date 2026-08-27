"use client";

import React, {useState} from "react";
import {Button} from "@/presentation/shared_ui/button";
import {Phone, Lock, Loader2} from "lucide-react"; // Đổi Mail thành Phone
import {useLoginMutation} from "@/presentation/features/auth/hooks/use-login";

export default function LoginForm() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const {mutate: login, isPending} = useLoginMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber || !password) return;

        login({phoneNumber, password});
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-6"/>
                <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isPending}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-primary-fixed focus:outline-none focus:border-primary transition-all duration-300"
                    required
                />
            </div>

            {/* Password Input */}
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-5"/>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-primary-fixed focus:outline-none focus:border-primary transition-all duration-300"
                    required
                />
            </div>

            {/* Nút Đăng nhập */}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full py-6 mt-2 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] text-white font-bold cursor-pointer"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin"/>
                        Đang xác thực...
                    </span>
                ) : (
                    "Đăng Nhập Ngay"
                )}
            </Button>
        </form>
    );
}