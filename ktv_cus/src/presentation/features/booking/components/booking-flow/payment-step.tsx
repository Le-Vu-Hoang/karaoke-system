"use client";

import { Info, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { PaymentStepProps } from "./types";

export default function PaymentStep({
    isAuthenticated,
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    guestCount,
    setGuestCount,
    notes,
    setNotes,
    paymentProvider,
    setPaymentProvider,
}: PaymentStepProps) {
    return (
        <section className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h3 className="font-heading text-headline-md text-on-surface">Thanh Toán &amp; Ghi Chú</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Xác nhận thông tin đặt phòng và chọn phương thức thanh toán.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guest info and Notes Area */}
                <div className="glass bg-surface-container/60 p-5 rounded-3xl border border-outline-variant/10 flex flex-col gap-5 justify-between">
                    <div>
                        {!isAuthenticated && (
                            <div className="space-y-3 pb-4 border-b border-outline-variant/10">
                                <h4 className="font-heading text-sm font-semibold text-on-surface flex items-center gap-2">
                                    <Info className="size-4 text-primary" />
                                    Thông tin liên hệ (Khách vãng lai)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-muted-foreground uppercase font-bold">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                            placeholder="Nguyễn Văn A"
                                            className="w-full bg-surface-container-highest rounded-xl px-3 py-2 text-xs text-on-surface border border-outline-variant/10 focus:ring-1 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-muted-foreground uppercase font-bold">
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="text"
                                            value={guestPhone}
                                            onChange={(e) => setGuestPhone(e.target.value)}
                                            placeholder="0901234567"
                                            className="w-full bg-surface-container-highest rounded-xl px-3 py-2 text-xs text-on-surface border border-outline-variant/10 focus:ring-1 focus:ring-primary focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className={cn(!isAuthenticated && "mt-4")}>
                            <h4 className="font-heading text-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
                                <Info className="size-4 text-primary" />
                                Số lượng khách & Ghi chú đặc biệt
                            </h4>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-muted-foreground uppercase font-bold">
                                        Số lượng khách dự kiến
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={guestCount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setGuestCount(val === "" ? "" : Number(val));
                                        }}
                                        placeholder="Ví dụ: 5"
                                        className="w-full bg-surface-container-highest rounded-xl px-3 py-2 text-sm text-on-surface border border-outline-variant/10 focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-muted-foreground"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Bạn có yêu cầu đặc biệt gì không? Hãy điền vào đây (ví dụ: trang trí sinh nhật, thêm đá, v.v.)
                                    </p>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={!isAuthenticated ? 3 : 5}
                                        placeholder="Nhập ghi chú của bạn tại đây..."
                                        className="w-full bg-surface-container-highest rounded-2xl p-4 text-sm text-on-surface border border-outline-variant/10 focus:ring-1 focus:ring-primary focus:outline-none resize-none placeholder:text-muted-foreground"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method Selection */}
                <div className="glass bg-surface-container/60 p-5 rounded-3xl border border-outline-variant/10">
                    <h4 className="font-heading text-sm font-semibold text-on-surface mb-4 flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" />
                        Phương thức thanh toán
                    </h4>

                    <div className="space-y-3">
                        {/* Stripe */}
                        <button
                            onClick={() => setPaymentProvider("STRIPE")}
                            className={cn(
                                "w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer",
                                paymentProvider === "STRIPE"
                                    ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(236,178,255,0.2)]"
                                    : "bg-surface-container border-outline-variant/10 hover:border-primary/40"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 font-extrabold text-base">
                                    S
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-on-surface">Stripe</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        Thanh toán quốc tế qua thẻ Visa/Mastercard
                                    </p>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-full border flex items-center justify-center",
                                    paymentProvider === "STRIPE" ? "border-primary bg-primary" : "border-muted-foreground"
                                )}
                            >
                                {paymentProvider === "STRIPE" && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-on-primary" />
                                )}
                            </div>
                        </button>

                        {/* Momo */}
                        <button
                            onClick={() => setPaymentProvider("MOMO")}
                            className={cn(
                                "w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer",
                                paymentProvider === "MOMO"
                                    ? "bg-secondary-container/10 border-secondary shadow-[0_0_15px_rgba(255,75,137,0.2)]"
                                    : "bg-surface-container border-outline-variant/10 hover:border-secondary/40"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#A50064]/10 flex items-center justify-center text-[#A50064] font-extrabold text-base">
                                    M
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-on-surface">Ví MoMo</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        Thanh toán nhanh chóng bằng mã QR MoMo
                                    </p>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-full border flex items-center justify-center",
                                    paymentProvider === "MOMO"
                                        ? "border-secondary bg-secondary"
                                        : "border-muted-foreground"
                                )}
                            >
                                {paymentProvider === "MOMO" && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-on-secondary" />
                                )}
                            </div>
                        </button>

                        {/* VNPay */}
                        <button
                            onClick={() => setPaymentProvider("VNPAY")}
                            className={cn(
                                "w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer",
                                paymentProvider === "VNPAY"
                                    ? "bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                    : "bg-surface-container border-outline-variant/10 hover:border-blue-500/40"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-extrabold text-base">
                                    V
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-on-surface">Cổng VNPay</p>
                                    <p className="text-[10px] text-muted-foreground">
                                        Thanh toán ATM nội địa / Internet Banking
                                    </p>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-full border flex items-center justify-center",
                                    paymentProvider === "VNPAY" ? "border-blue-500 bg-blue-500" : "border-muted-foreground"
                                )}
                            >
                                {paymentProvider === "VNPAY" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
