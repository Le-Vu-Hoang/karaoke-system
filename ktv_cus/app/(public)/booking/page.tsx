import Header from "@/presentation/shared_ui/header";
import Footer from "@/presentation/shared_ui/footer";
import BookingFlow from "@/presentation/features/booking/components/booking-flow";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Đặt Phòng Karaoke - Luna Karaoke | Hệ Thống Karaoke VIP",
    description: "Đặt phòng hát Karaoke trực tuyến nhanh chóng với hệ thống phòng VIP đẳng cấp tại Luna Karaoke.",
};

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            {/* Header Navigation */}
            <Header />

            {/* Main Booking Content */}
            <main className="flex-1 flex flex-col pt-4 pb-20 md:pb-8">
                <BookingFlow />
            </main>

            {/* Page Footer */}
            <Footer />
        </div>
    );
}
