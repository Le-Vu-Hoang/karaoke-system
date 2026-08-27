import QrScanner from "@/presentation/features/auth/components/qr-scanner";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quét QR Đăng nhập | Luna Karaoke",
    description: "Quét mã QR để đăng nhập vào Web",
};

export default function ScanQrPage() {
    return (
        <div className="w-full flex items-center justify-center">
            <QrScanner />
        </div>
    );
}
