"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "./login-form";
import QrLogin from "./qr-login";
import { useAuthStore } from "@/shared/stores/use-auth-store";
import { useRouter, useSearchParams } from "next/navigation";

type AuthMode = "login" | "qr";

export default function AuthCard() {
    const [mode, setMode] = useState<AuthMode>("login");
    const [isChecking, setIsChecking] = useState(true);
    
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // If we are redirected here by middleware (indicated by the 'from' query param),
        // but local Zustand state says we are authenticated, it means the cookie is missing/expired.
        // We must clear the local state to break the infinite redirect loop.
        const fromParam = searchParams.get("from");
        
        if (fromParam && isAuthenticated) {
             console.log("Middleware redirected us despite local auth state. Clearing stale state...");
             logout();
             setIsChecking(false);
             return;
        }

        if (isAuthenticated && !fromParam) {
            router.push('/');
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, router, searchParams, logout]);

    if (isAuthenticated || isChecking) {
        return (
            <div className="w-[90%] sm:w-full min-w-80 sm:min-w-100 max-w-md bg-surface-container/60 border border-primary/15 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(189,0,255,0.05)] z-10 flex items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-[90%] sm:w-full min-w-80 sm:min-w-100 max-w-md bg-surface-container/60 border border-primary/15 rounded-3xl p-8 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(189,0,255,0.05)] z-10 flex flex-col">
            {/* Logo / Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary tracking-wide">
                    KTV STAFF
                </h1>
                <p className="text-on-surface-variant text-sm mt-2 font-medium">
                    Hệ thống quản lý nội bộ
                </p>
            </div>

            {/* Custom Tabs */}
            <div className="flex w-full h-12 bg-surface-container/40 border border-outline-variant/30 rounded-lg p-1 mb-6 relative">
                {/* Tab Indicator */}
                <motion.div 
                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-surface-container-high rounded-md shadow-sm border border-outline-variant/20"
                    animate={{ 
                        x: mode === "login" ? 0 : "100%",
                        width: "calc(50% - 4px)" 
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                
                <button
                    onClick={() => setMode("login")}
                    className={`flex-1 relative z-10 flex items-center justify-center text-sm font-semibold transition-colors ${
                        mode === "login" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Đăng nhập
                </button>
                <button
                    onClick={() => setMode("qr")}
                    className={`flex-1 relative z-10 flex items-center justify-center text-sm font-semibold transition-colors ${
                        mode === "qr" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Mã QR
                </button>
            </div>

            {/* Form Container */}
            <div className="w-full relative min-h-55">
                <AnimatePresence mode="wait">
                    {mode === "login" ? (
                        <motion.div
                            key="login-view"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <LoginForm />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="qr-view"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <QrLogin />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
