"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useRouter } from "next/navigation";
import { apiClient } from "@/infrastructure/api/http-client";

export default function QrScanner() {
    const [scanned, setScanned] = useState(false);
    const [status, setStatus] = useState("Vui lòng đưa mã QR trên màn hình Web vào khung hình");
    const router = useRouter();

    const handleScan = async (result: any) => {
        if (scanned) return;

        // Yudiel scanner returns an array of objects or a single object depending on version.
        // Usually result is an array or object containing rawValue
        const qrValue = Array.isArray(result) ? result[0]?.rawValue : result?.rawValue || result;

        if (!qrValue || typeof qrValue !== 'string') return;

        // Kiểm tra đúng định dạng QR của hệ thống
        if (!qrValue.startsWith("KTV-LOGIN:")) return;

        setScanned(true);
        setStatus("Đang xử lý đăng nhập...");

        try {
            const sessionId = qrValue.replace("KTV-LOGIN:", "");

            // Gửi API kèm token hiện tại (apiClient tự động attach Bearer token)
            await apiClient.post("/auth/qr/scan", { sessionId });

            setStatus("✅ Đăng nhập Web thành công!");
            setTimeout(() => router.push('/'), 2000);
        } catch (error) {
            console.error(error);
            setStatus("❌ Quét QR thất bại. Mã không hợp lệ hoặc đã hết hạn.");
            setTimeout(() => setScanned(false), 3000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full pt-10">
            <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Quét Mã QR
                </h1>
                <p className="text-on-surface-variant mt-2 mx-auto font-medium">{status}</p>
            </div>

            <div className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-[3px] border-primary/50 shadow-[0_0_40px_rgba(189,0,255,0.2)] relative bg-black/10">
                {!scanned ? (
                    <Scanner
                        onScan={(result) => handleScan(result)}
                        components={{
                            finder: true
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container/90 backdrop-blur-md">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-primary font-semibold text-lg animate-pulse">Vui lòng chờ...</p>
                    </div>
                )}
            </div>

            <button
                onClick={() => router.push('/')}
                className="mt-10 px-6 py-2.5 rounded-full bg-surface-variant hover:bg-surface-variant/80 text-on-surface-variant font-medium transition-colors"
            >
                Hủy và Quay lại
            </button>
        </div>
    );
}
