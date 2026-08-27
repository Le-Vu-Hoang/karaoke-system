"use client";

import { useState } from "react";
import { User, Phone, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/presentation/shared_ui/button";
import { useRegisterMutation } from "@/presentation/features/auth/hooks/use-register";

export default function RegisterForm() {
    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: register, isPending } = useRegisterMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !phoneNumber || !password) return;

        register({
            fullname: fullName,
            phone: phoneNumber,
            email: email || undefined,
            password,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ và tên */}
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-5" />
                <input
                    type="text"
                    placeholder="Họ và tên"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isPending}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-primary-fixed focus:outline-none focus:border-primary transition-all duration-300"
                    required
                />
            </div>

            {/* Số điện thoại */}
            <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-5" />
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

            {/* Email (Không bắt buộc) */}
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-5" />
                <input
                    type="email"
                    placeholder="Địa chỉ email (Tùy chọn)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface placeholder:text-primary-fixed focus:outline-none focus:border-primary transition-all duration-300"
                />
            </div>

            {/* Mật khẩu */}
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-5" />
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

            {/* Nút Đăng ký */}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full py-6 mt-2 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] text-white font-bold cursor-pointer"
            >
                {isPending ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Đang tạo tài khoản...
                    </span>
                ) : (
                    "Đăng Ký Ngay"
                )}
            </Button>
        </form>
    );
}
