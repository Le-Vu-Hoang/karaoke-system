"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { io } from "socket.io-client";
import { apiClient } from "@/infrastructure/api/http-client";
import { env } from "@/env";

export default function QrLoginDesktop() {
    const [qrValue, setQrValue] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "scanned" | "success" | "error">("loading");

    useEffect(() => {
        // Safely get the backend origin
        let socketUrl = "http://localhost:3001";
        try {
            if (env.NEXT_PUBLIC_BACKEND_URL) {
                socketUrl = new URL(env.NEXT_PUBLIC_BACKEND_URL).origin;
            }
        } catch (e) {
            console.error("Invalid NEXT_PUBLIC_BACKEND_URL:", env.NEXT_PUBLIC_BACKEND_URL);
        }

        const socket = io(socketUrl, {
            transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
            console.log("Connected to QR Socket");
            socket.emit("request-qr");
        });

        socket.on("qr-generated", (data: { sessionId: string }) => {
            setQrValue(`KTV-LOGIN:${data.sessionId}`);
            setStatus("ready");
        });

        socket.on("qr-scanned-success", async (data: { authCode: string }) => {
            setStatus("scanned");

            try {
                // Submit auth code to get cookies
                await apiClient.post("/auth/qr/exchange", { authCode: data.authCode });

                setStatus("success");
                // Reload the window to fetch user profile using the newly set cookie
                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
            } catch (err) {
                console.error("Exchange error:", err);
                setStatus("error");
            }
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from QR Socket");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20">
            <h3 className="text-base font-semibold text-foreground mb-4">Đăng nhập nhanh bằng mã QR</h3>

            <div className="w-48 h-48 bg-white p-3 rounded-2xl flex items-center justify-center shadow-sm relative">
                {status === "loading" && (
                    <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center flex-col gap-2 z-10">
                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-primary font-medium">Đang tạo mã...</span>
                    </div>
                )}

                {status === "scanned" && (
                    <div className="absolute inset-0 bg-white/95 rounded-2xl flex items-center justify-center flex-col gap-3 z-10">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-emerald-600 font-semibold">Đang đăng nhập...</span>
                    </div>
                )}

                {status === "success" && (
                    <div className="absolute inset-0 bg-emerald-50/95 rounded-2xl flex items-center justify-center flex-col gap-2 z-10">
                        <svg className="w-12 h-12 text-emerald-500 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-sm text-emerald-600 font-bold">Thành công!</span>
                    </div>
                )}

                {status === "error" && (
                    <div className="absolute inset-0 bg-red-50/95 rounded-2xl flex items-center justify-center flex-col gap-2 text-center p-2 z-10">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <span className="text-xs text-red-600 font-medium leading-tight">Mã đã hết hạn.<br />Vui lòng tải lại trang.</span>
                    </div>
                )}

                {qrValue && (
                    <QRCodeSVG
                        value={qrValue}
                        size={168}
                        bgColor="#ffffff"
                        fgColor="#000000"
                        level="M"
                        includeMargin={false}
                    />
                )}
            </div>

            <p className="text-sm text-on-surface-variant text-center mt-5 max-w-[220px] leading-relaxed">
                Mở app nhân viên trên điện thoại và chọn <strong className="text-foreground">Quét QR Đăng nhập</strong>
            </p>
        </div>
    );
}
