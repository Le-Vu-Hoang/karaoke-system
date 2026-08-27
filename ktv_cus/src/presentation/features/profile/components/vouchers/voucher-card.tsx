"use client";

import {Percent, Beer, Utensils, Ticket, Clock} from "lucide-react";

export interface Voucher {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    code: string;
    expiryDate: string;
    status: "unused" | "used" | "expired";
    category: string;
    badgeText?: string;
    iconType: "celebration" | "local_bar" | "workspace_premium" | "payments";
    image: string;
    borderClass: string;
    colorClass: string;
}

interface VoucherCardProps {
    voucher: Voucher;
    onUse: (code: string) => void;
}

export default function VoucherCard({voucher, onUse}: VoucherCardProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "celebration":
                return <Percent className={`size-8 ${voucher.colorClass}`}/>;
            case "local_bar":
                return <Beer className={`size-8 ${voucher.colorClass}`}/>;
            case "workspace_premium":
                return <Utensils className={`size-8 ${voucher.colorClass}`}/>;
            case "payments":
                return <Ticket className={`size-8 ${voucher.colorClass}`}/>;
            default:
                return <Ticket className={`size-8 ${voucher.colorClass}`}/>;
        }
    };

    const isInactive = voucher.status !== "unused";

    return (
        <div className="relative group">
            {/* ----------------- DESKTOP CARD VIEW ----------------- */}
            <div
                className={`hidden md:block glass-card rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 relative border-l-4 shadow-xl ${voucher.borderClass} ${
                    isInactive ? "opacity-60 grayscale" : ""
                }`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-xl bg-white/5`}>
                            {getIcon(voucher.iconType)}
                        </div>
                        {voucher.badgeText && !isInactive && (
                            <span
                                className="bg-secondary-container/20 text-secondary text-[10px] font-bold px-3 py-1 rounded-full border border-secondary/30 uppercase tracking-wider">
                {voucher.badgeText}
              </span>
                        )}
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white mb-1">
                        {voucher.title}
                    </h3>
                    <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-6">
                        {voucher.subtitle}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-6">
                        <Clock className="size-4"/>
                        <span>Hạn dùng: {voucher.expiryDate}</span>
                    </div>

                    {voucher.status === "unused" ? (
                        <button
                            type="button"
                            onClick={() => onUse(voucher.code)}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:text-on-primary hover:shadow-[0_0_20px_rgba(189,0,255,0.4)] transition-all font-bold text-primary active:scale-95 cursor-pointer"
                        >
                            Dùng ngay
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-on-surface-variant/40 font-bold cursor-not-allowed"
                        >
                            {voucher.status === "used" ? "Đã sử dụng" : "Đã hết hạn"}
                        </button>
                    )}
                </div>
            </div>

            {/* ----------------- MOBILE CARD VIEW ----------------- */}
            <div
                className={`md:hidden glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 active:scale-[0.98] border border-white/10 ${
                    isInactive ? "opacity-60 grayscale" : ""
                }`}
            >
                {/* Decorative Voucher Cutouts */}
                <div
                    className="absolute left-[-10px] top-[128px] w-5 h-5 bg-background rounded-full border-r border-white/10 z-10"/>
                <div
                    className="absolute right-[-10px] top-[128px] w-5 h-5 bg-background rounded-full border-l border-white/10 z-10"/>

                <div className="flex h-32">
                    {/* Visual Left Block */}
                    <div className="w-1/3 relative h-full">
                        <img
                            className="w-full h-full object-cover"
                            alt={voucher.title}
                            src={voucher.image}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-container/80"/>
                    </div>

                    {/* Details Right Block */}
                    <div className="w-2/3 p-4 flex flex-col justify-center">
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${voucher.colorClass}`}>
              {voucher.category}
            </span>
                        <h3 className="font-heading text-lg font-bold text-white leading-tight">
                            {voucher.title}
                        </h3>
                        <p className="text-on-surface-variant text-[11px]">
                            {voucher.description}
                        </p>
                    </div>
                </div>

                {/* Bottom Voucher Code / CTA Block */}
                <div
                    className="border-t border-dashed border-white/10 px-4 py-4 flex items-center justify-between bg-white/5">
                    <div className="flex flex-col">
                        <span
                            className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Mã voucher</span>
                        <span className="font-sans font-bold text-sm text-on-surface tracking-wider">
              {voucher.code}
            </span>
                    </div>

                    {voucher.status === "unused" ? (
                        <button
                            type="button"
                            onClick={() => onUse(voucher.code)}
                            className="px-6 py-2 rounded-full bg-primary-container text-on-primary-container font-bold text-xs shadow-lg shadow-primary-container/20 active:scale-90 transition-transform cursor-pointer"
                        >
                            Sử dụng
                        </button>
                    ) : (
                        <span className="text-xs font-bold text-on-surface-variant/40">
              {voucher.status === "used" ? "Đã dùng" : "Hết hạn"}
            </span>
                    )}
                </div>
            </div>
        </div>
    );
}
