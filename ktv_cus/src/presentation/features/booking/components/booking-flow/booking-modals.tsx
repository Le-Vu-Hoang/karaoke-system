"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { BookingModalsProps, formatCurrency } from "./types";

export default function BookingModals({
    isConfirmOpen,
    setIsConfirmOpen,
    isSuccessOpen,
    bookingResult,
    isSubmitting,
    selectedRoomType,
    selectedDate,
    startTime,
    endTime,
    duration,
    isAuthenticated,
    user,
    guestName,
    guestPhone,
    totalCost,
    handleCreateBooking,
    handleBackToHome,
    handleGoToHistory,
}: BookingModalsProps) {
    return (
        <>
            {/* ================= MODAL: PAYMENT / CONFIRMATION OVERLAY ================= */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="glass bg-surface-container-high w-full p-6 rounded-3xl border border-outline-variant/20 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <h4 className="font-heading text-headline-md text-primary mb-4 flex items-center gap-2">
                            Xác Nhận Đặt Phòng
                        </h4>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/10">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">
                                    Thông tin phòng
                                </p>
                                <p className="font-bold text-base text-on-surface">{selectedRoomType?.name}</p>
                                <p className="text-xs text-on-surface-variant mt-1">
                                    Sức chứa: {selectedRoomType?.capacity} người
                                </p>
                            </div>

                            <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/10">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">
                                    Thời gian sử dụng
                                </p>
                                <p className="font-bold text-on-surface">
                                    {selectedDate.toLocaleDateString("vi-VN", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                                <p className="text-xs text-on-surface-variant mt-1 font-semibold">
                                    Khung giờ: {startTime} - {endTime} ({duration} giờ)
                                </p>
                            </div>

                            <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/10">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-2">
                                    Thông tin khách hàng
                                </p>
                                {isAuthenticated ? (
                                    <>
                                        <p className="font-bold text-on-surface">{user?.fullName}</p>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            SĐT: {user?.phoneNumber}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="font-bold text-on-surface">{guestName || "Chưa nhập"}</p>
                                        <p className="text-xs text-on-surface-variant mt-1">
                                            SĐT: {guestPhone || "Chưa nhập"}
                                        </p>
                                    </>
                                )}
                            </div>



                            <div className="pt-2 border-t border-outline-variant/10 flex justify-between items-end">
                                <span className="font-bold text-on-surface">Tổng số tiền cần thanh toán:</span>
                                <span className="text-xl font-extrabold text-primary font-heading">
                                    {formatCurrency(totalCost)}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="flex-1 py-3 bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-bold rounded-xl transition-all cursor-pointer text-center text-xs"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleCreateBooking}
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-primary text-secondary-container-foreground font-extrabold rounded-xl hover:brightness-110 shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                            >
                                {isSubmitting ? (
                                    <span>Đang xử lý...</span>
                                ) : (
                                    <>
                                        Thanh Toán
                                        <ArrowRight className="size-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= MODAL: SUCCESS CONFIRMATION ================= */}
            {isSuccessOpen && bookingResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="glass bg-surface-container-high max-w-md w-full p-6 rounded-3xl border border-primary/30 shadow-[0_0_50px_rgba(189,0,255,0.25)] relative text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30">
                            <CheckCircle2 className="size-10 text-primary animate-bounce" />
                        </div>

                        <h4 className="font-heading text-headline-md text-primary mb-2">Đặt Phòng Thành Công!</h4>
                        <p className="text-xs text-on-surface-variant mb-6">
                            Luna Karaoke đã nhận được đơn đặt phòng của bạn. Vui lòng kiểm tra mã check-in dưới đây.
                        </p>

                        {/* Booking Receipt Card */}
                        <div className="bg-surface-container p-5 rounded-2xl border border-outline-variant/10 text-left space-y-3.5 mb-6 text-xs relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-8 -translate-y-8"></div>

                            <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                                <span className="text-muted-foreground uppercase font-bold tracking-widest text-[9px]">
                                    Mã đơn
                                </span>
                                <span className="font-extrabold text-primary font-mono text-sm">{bookingResult.id}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Phòng hát</span>
                                <span className="font-bold text-on-surface">{bookingResult.room?.name}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Thời gian nhận</span>
                                <span className="font-bold text-on-surface">{bookingResult.startTime}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Khung giờ trả</span>
                                <span className="font-bold text-on-surface">{bookingResult.endTime}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-on-surface-variant">Ngày đặt</span>
                                <span className="font-bold text-on-surface">{bookingResult.date}</span>
                            </div>


                            <div className="flex justify-between border-t border-outline-variant/10 pt-2.5 items-end">
                                <span className="font-bold text-on-surface">Tổng tiền thanh toán</span>
                                <span className="text-base font-extrabold text-primary font-heading">
                                    {formatCurrency(bookingResult.totalPrice)}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleBackToHome}
                                className="flex-1 py-3 bg-surface-container hover:bg-surface-container-highest text-on-surface-variant font-bold rounded-xl transition-all cursor-pointer text-xs"
                            >
                                Về Trang Chủ
                            </button>
                            <button
                                onClick={handleGoToHistory}
                                className="flex-1 py-3 bg-primary text-on-primary font-extrabold rounded-xl hover:brightness-110 shadow-lg shadow-primary/10 transition-all cursor-pointer text-xs"
                            >
                                Lịch Sử Đặt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
