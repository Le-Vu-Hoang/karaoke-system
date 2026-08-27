"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import { Tabs, TabsList, TabsTrigger } from "@/presentation/shared_ui/tabs";
import { useAuthStore } from "@/shared/stores/use-auth-store";
import { useRouter } from "next/navigation";

import QrLoginDesktop from "./qr-login-desktop";

type AuthMode = "login" | "register" | "qr";

export default function AuthCard() {
    const [mode, setMode] = useState<AuthMode>("login");
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (isAuthenticated) {
        return (
            <div className="w-[90%] sm:w-full min-w-[320px] sm:min-w-[400px] max-w-md bg-surface-container/60 border border-primary/15 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(189,0,255,0.05)] z-10 flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-[90%] sm:w-full min-w-[320px] sm:min-w-[400px] max-w-md bg-surface-container/60 border border-primary/15 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(189,0,255,0.05)] z-10 flex flex-col">
            {/* Logo / Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-wide">
                    LUNA KARAOKE
                </h1>
                <p className="text-on-surface-variant text-sm mt-2 font-medium">
                    {mode === "login"
                        ? "Chào mừng bạn trở lại thiên đường âm nhạc"
                        : "Đăng ký thành viên để nhận ưu đãi đặc quyền"}
                </p>
            </div>

            <Tabs
                value={mode}
                onValueChange={(val) => setMode(val as AuthMode)}
                className="w-full mb-6"
            >
                <TabsList className="grid w-full h-12 grid-cols-3 p-0 leading-0 bg-surface-container/40 border border-outline-variant/30 rounded-sm">
                    <TabsTrigger
                        value="login"
                        className="flex items-center justify-center w-full h-full text-sm font-semibold transition-all rounded-sm cursor-pointer"
                    >
                        Đăng nhập
                    </TabsTrigger>
                    <TabsTrigger
                        value="register"
                        className="flex items-center justify-center w-full h-full text-sm font-semibold transition-all rounded-sm cursor-pointer"
                    >
                        Đăng ký
                    </TabsTrigger>
                    <TabsTrigger
                        value="qr"
                        className="flex items-center justify-center w-full h-full text-sm font-semibold transition-all rounded-sm cursor-pointer"
                    >
                        Mã QR
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* AnimatePresence mode="wait" chuyển đổi mượt mà giữa LoginForm và RegisterForm */}
            <div className="w-full relative">
                <AnimatePresence mode="wait" initial={false}>
                    {mode === "login" ? (
                        <motion.div
                            key="login-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <LoginForm />
                        </motion.div>
                    ) : mode === "register" ? (
                        <motion.div
                            key="register-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <RegisterForm />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="qr-view"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <QrLoginDesktop />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Social Logins - Đăng nhập bằng mạng xã hội */}
            <div className="mt-6 flex flex-col items-center w-full">
                <div className="flex items-center w-full mb-4">
                    <div className="flex-grow h-px bg-outline-variant/20"></div>
                    <span className="px-3 text-xs text-on-surface-variant font-medium uppercase tracking-wider whitespace-nowrap">
                        Hoặc tiếp tục với
                    </span>
                    <div className="flex-grow h-px bg-outline-variant/20"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                    {/* Google Login Button */}
                    <button
                        type="button"
                        onClick={() => window.location.href = "http://localhost:3001/api/v1/auth/google"}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 rounded-xl text-on-surface text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(189,0,255,0.05)]"
                    >
                        <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        <span className="truncate">Google</span>
                    </button>

                    {/* Facebook Login Button */}
                    <button
                        type="button"
                        onClick={() => window.location.href = "http://localhost:3001/api/v1/auth/facebook"}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 rounded-xl text-on-surface text-sm font-semibold transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(189,0,255,0.05)]"
                    >
                        <svg className="size-5 shrink-0 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span className="truncate">Facebook</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
