"use client";

import { Clock, Info } from "lucide-react";
import { TimeStepProps } from "./types";
import { Calendar } from "@/presentation/shared_ui/calendar";
import { vi } from "date-fns/locale";

export default function TimeStep({
    selectedDate,
    setSelectedDate,
    startSliderValue,
    setStartSliderValue,
    endSliderValue,
    setEndSliderValue,
    startTime,
    endTime,
    duration,
    holdPeriodLabel,
    minSliderValue = 0,
    bookedSlots = [],
    isOverlapping = false,
}: TimeStepProps) {
    return (
        <section className="space-y-6 animate-in fade-in duration-300">
            <div>
                <h3 className="font-heading text-headline-md text-on-surface">Lên lịch cuộc hẹn</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Chọn ngày hát và khoảng thời gian thăng hoa của bạn.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Date Picker Calendar Card */}
                <div className="md:col-span-1 glass bg-surface-container/60 p-4 rounded-3xl border border-outline-variant/10 flex justify-center items-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                        }}
                        locale={vi}
                        className="w-full"
                    />
                </div>

                {/* Time Selectors Card */}
                <div className="md:col-span-2 glass bg-surface-container/60 p-5 rounded-3xl border border-outline-variant/10 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-center mb-5 pb-2 border-b border-outline-variant/10">
                            <span className="font-heading text-sm font-semibold flex items-center gap-1.5">
                                <Clock className="size-4 text-primary" />
                                Thời Gian Đặt Phòng
                            </span>
                            <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-semibold">
                                Thời lượng: {duration} giờ
                            </span>
                        </div>

                        {/* Start & End Time picker (Dual-handle Range Slider 9h - 3h sáng hôm sau) */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
                                <div>
                                    <span className="uppercase font-bold tracking-wider block text-[10px] text-muted-foreground">
                                        GIỜ BẮT ĐẦU
                                    </span>
                                    <span className="text-primary font-bold text-sm bg-primary/10 border border-primary/20 px-3 py-1 rounded-full font-heading inline-block mt-1">
                                        {startTime}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="uppercase font-bold tracking-wider block text-[10px] text-muted-foreground">
                                        GIỜ KẾT THÚC
                                    </span>
                                    <span className="text-secondary font-bold text-sm bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full font-heading inline-block mt-1">
                                        {endTime}
                                    </span>
                                </div>
                            </div>

                            <div className="relative pt-6 pb-2 px-2 h-16">
                                {/* Track background */}
                                <div className="absolute top-[32%] left-2 right-2 h-2 bg-surface-container-highest rounded-lg -translate-y-1/2 overflow-hidden">
                                    {/* Booked slots indicator */}
                                    {bookedSlots.map((slot, index) => {
                                        const leftPercent = (slot.start / 36) * 100;
                                        const widthPercent = ((slot.end - slot.start) / 36) * 100;
                                        return (
                                            <div
                                                key={index}
                                                className="absolute h-full bg-red-500/50"
                                                style={{
                                                    left: `${leftPercent}%`,
                                                    width: `${widthPercent}%`,
                                                }}
                                                title="Đã có người đặt"
                                            />
                                        );
                                    })}
                                </div>

                                {/* Highlighted range track */}
                                <div
                                    className={`absolute top-[32%] h-2 rounded-lg -translate-y-1/2 ${
                                        isOverlapping ? "bg-red-500" : "bg-gradient-to-r from-primary to-secondary"
                                    }`}
                                    style={{
                                        left: `${(startSliderValue / 36) * 100}%`,
                                        width: `${((endSliderValue - startSliderValue) / 36) * 100}%`,
                                    }}
                                />

                                {/* Start Slider Handle */}
                                <input
                                    type="range"
                                    min={0}
                                    max={36}
                                    value={startSliderValue}
                                    onChange={(e) => {
                                        const val = Math.max(minSliderValue, Math.min(Number(e.target.value), endSliderValue - 1));
                                        setStartSliderValue(val);
                                    }}
                                    className="absolute top-[32%] left-0 w-full h-2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                />

                                {/* End Slider Handle */}
                                <input
                                    type="range"
                                    min={0}
                                    max={36}
                                    value={endSliderValue}
                                    onChange={(e) => {
                                        const val = Math.max(minSliderValue + 1, Math.max(Number(e.target.value), startSliderValue + 1));
                                        setEndSliderValue(val);
                                    }}
                                    className="absolute top-[32%] left-0 w-full h-2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-secondary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/20 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-secondary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                />
                                <div className="flex justify-between text-[10px] text-muted-foreground font-semibold mt-6 select-none">
                                    <span>09:00</span>
                                    <span>12:00</span>
                                    <span>15:00</span>
                                    <span>18:00</span>
                                    <span>21:00</span>
                                    <span>00:00</span>
                                    <span>03:00 (Hôm sau)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Note & Warning Panel */}
                    <div className="mt-6 space-y-3">
                        {isOverlapping && (
                            <div className="p-3 bg-red-500/10 rounded-xl flex items-center gap-2.5 border border-red-500/20">
                                <Info className="size-4 text-red-400 shrink-0" />
                                <p className="text-xs text-red-200/90 leading-relaxed font-semibold">
                                    Thời gian bạn chọn đã có khách đặt. Vui lòng chọn khung giờ khác.
                                </p>
                            </div>
                        )}
                        <div className="p-3 bg-surface-container-high/30 rounded-xl flex items-center gap-2.5 border border-white/5">
                            <Info className="size-4 text-primary shrink-0" />
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                Thời gian hát kết thúc vào lúc <span className="text-secondary font-bold">{endTime}</span>.
                                Vui lòng có mặt đúng giờ để check-in.
                            </p>
                        </div>
                        <div className="p-3 bg-amber-500/10 rounded-xl flex items-center gap-2.5 border border-amber-500/20">
                            <Clock className="size-4 text-amber-400 shrink-0 animate-pulse" />
                            <p className="text-xs text-amber-200/90 leading-relaxed font-semibold">
                                Chú ý: Phòng của bạn sẽ được giữ từ{" "}
                                <span className="text-amber-400 font-bold">
                                    {startTime} - {holdPeriodLabel.split(" - ")[1]}
                                </span>{" "}
                                (vui lòng check-in đúng thời hạn).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
