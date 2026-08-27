"use client";

import { Sparkles, Ticket, Check, ArrowRight, ChevronLeft } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { BillingSidebarProps, MobileNavigationFooterProps, formatCurrency } from "./types";

export function BillingSidebar({
    currentStep,
    setCurrentStep,
    selectedRoomType,
    selectedDate,
    startTime,
    endTime,
    duration,
    roomCost,
    promoCode,
    setPromoCode,
    applyPromo,
    appliedPromo,
    subtotal,
    discountAmount,
    totalCost,
    onSubmit,
    isNextDisabled,
}: BillingSidebarProps) {
    return (
        <aside className="w-full lg:w-80 shrink-0 mt-6 lg:mt-0">
            <div className="sticky top-24 glass bg-surface-container/60 p-6 rounded-3xl border border-primary/20 shadow-[0_0_30px_rgba(189,0,255,0.08)]">
                <h3 className="font-heading text-headline-md text-primary mb-4 flex items-center gap-2">
                    <Sparkles className="size-5" />
                    Hóa Đơn Tạm Tính
                </h3>

                {/* Booking brief rows */}
                <div className="space-y-3.5 mb-6 text-xs">
                    <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Loại phòng</span>
                        <span className="font-bold text-on-surface">{selectedRoomType?.name || "Chưa chọn"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Ngày đặt</span>
                        <span className="font-bold text-on-surface">
                            {selectedDate.toLocaleDateString("vi-VN", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Khung giờ</span>
                        <span className="font-bold text-on-surface">
                            {startTime} - {endTime}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant">Thời lượng</span>
                        <span className="font-bold text-on-surface">{duration} giờ</span>
                    </div>

                    {/* Room subtotal */}
                    <div className="flex justify-between py-1 text-[11px] text-muted-foreground italic">
                        <span>Tiền phòng ({formatCurrency(selectedRoomType?.pricePerHour || 0)}/h)</span>
                        <span>{formatCurrency(roomCost)}</span>
                    </div>


                </div>

                {/* Promo code area */}
                <div className="mb-6 p-3 rounded-2xl bg-surface-container-low border border-dashed border-primary/30">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Ticket className="size-3.5 text-primary" />
                        <span className="text-xs font-bold text-primary">Mã Giảm Giá</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="LUNA2026, GOLD20..."
                            className="bg-background text-xs px-2.5 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-primary w-full text-on-surface outline-none"
                        />
                        <button
                            onClick={applyPromo}
                            className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-xs font-semibold rounded-lg transition-all cursor-pointer"
                        >
                            Dùng
                        </button>
                    </div>
                    {appliedPromo && (
                        <p className="text-[10px] text-green-400 mt-2 font-medium flex items-center gap-1">
                            <Check className="size-3" />
                            Đã áp dụng mã {appliedPromo.code} (-{appliedPromo.discount * 100}%)
                        </p>
                    )}
                </div>

                {/* Pricing Summary */}
                <div className="space-y-2 mb-6 pt-2 border-t border-outline-variant/10">
                    <div className="flex justify-between items-center text-xs text-on-surface-variant">
                        <span>Tạm tính</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {appliedPromo && (
                        <div className="flex justify-between items-center text-xs text-green-400">
                            <span>Chiết khấu</span>
                            <span>-{formatCurrency(discountAmount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-end pt-1">
                        <span className="text-xs text-on-surface-variant uppercase font-bold">Tổng thanh toán</span>
                        <span className="text-2xl font-extrabold text-primary font-heading">
                            {formatCurrency(totalCost)}
                        </span>
                    </div>
                </div>

                {/* Steps Actions */}
                <div className="space-y-3">
                    {currentStep < 3 ? (
                        <button
                            onClick={() => setCurrentStep((prev) => prev + 1)}
                            disabled={currentStep === 2 && isNextDisabled}
                            className={cn(
                                "w-full py-3.5 bg-primary text-on-primary font-extrabold rounded-2xl flex items-center justify-center gap-2 font-heading transition-all",
                                currentStep === 2 && isNextDisabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:brightness-110 shadow-lg shadow-primary/15 hover:scale-[1.01] active:scale-95 cursor-pointer"
                            )}
                        >
                            Tiếp Tục
                            <ArrowRight className="size-4" />
                        </button>
                    ) : (
                        <button
                            onClick={onSubmit}
                            className="w-full py-3.5 bg-primary text-on-primary font-extrabold rounded-2xl hover:brightness-110 shadow-lg shadow-primary/15 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-heading"
                        >
                            Xác Nhận Đặt Phòng
                        </button>
                    )}

                    {currentStep > 1 && (
                        <button
                            onClick={() => setCurrentStep((prev) => prev - 1)}
                            className="w-full py-3 bg-surface-container hover:bg-surface-container-highest text-on-surface font-semibold rounded-2xl border border-outline-variant/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                        >
                            <ChevronLeft className="size-4" />
                            Quay Lại
                        </button>
                    )}

                    <p className="text-[10px] text-center text-muted-foreground leading-normal mt-2">
                        Hủy đặt phòng miễn phí tối đa 24 giờ trước thời gian nhận phòng.
                    </p>
                </div>
            </div>
        </aside>
    );
}

export function MobileNavigationFooter({
    currentStep,
    setCurrentStep,
    totalCost,
    onSubmit,
    isNextDisabled,
}: MobileNavigationFooterProps) {
    return (
        <footer className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container/95 border-t border-outline-variant/20 px-6 py-4 pb-safe flex items-center justify-between backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] gap-4">
            <div className="flex flex-col shrink-0">
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">
                    Tổng cộng
                </span>
                <span className="font-heading text-headline-md text-primary font-extrabold">
                    {formatCurrency(totalCost)}
                </span>
            </div>

            <div className="flex gap-2 items-center">
                {currentStep > 1 && (
                    <button
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="bg-surface-container-highest hover:bg-surface-container text-on-surface-variant px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-1.5 transition-all active:scale-95 border border-outline-variant/10 font-heading cursor-pointer whitespace-nowrap"
                    >
                        Quay Lại
                    </button>
                )}

                {currentStep < 3 ? (
                    <button
                        onClick={() => setCurrentStep((prev) => prev + 1)}
                        disabled={currentStep === 2 && isNextDisabled}
                        className={cn(
                            "bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-1.5 transition-all font-heading whitespace-nowrap",
                            currentStep === 2 && isNextDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : "active:scale-95 shadow-md shadow-primary/15 cursor-pointer"
                        )}
                    >
                        Tiếp Tục
                        <ArrowRight className="size-4" />
                    </button>
                ) : (
                    <button
                        onClick={onSubmit}
                        className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-primary/15 font-heading cursor-pointer whitespace-nowrap"
                    >
                        Xác Nhận
                    </button>
                )}
            </div>
        </footer>
    );
}
