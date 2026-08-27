import AuthCard from "@/presentation/features/auth/components/auth-card";
import Link from "next/link";
import { Home } from "lucide-react";

export default function AuthPage() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
            {/* Back to Home Button */}
            <Link 
                href="/" 
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-surface-container/60 hover:bg-surface-container-high/90 border border-outline-variant/30 hover:border-primary/50 text-on-surface hover:text-primary rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg active:scale-95 group"
            >
                <Home className="size-4 group-hover:scale-110 transition-transform" />
                <span>Về trang chủ</span>
            </Link>

            <div className="absolute top-1/4 left-1/4 size-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 size-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
            <AuthCard />
        </main>
    );
}