"use client";

import {Check, Plus} from "lucide-react";
import Image from "next/image";
import {cn} from "@/shared/lib/utils";
import {RoomTypeStepProps, formatCurrency} from "./types";

export default function RoomTypeStep({
                                         roomTypesList,
                                         selectedRoomTypeId,
                                         setSelectedRoomTypeId,
                                         isLoading,
                                         isError,
                                     }: RoomTypeStepProps) {

    return (
        <section className="space-y-md animate-in fade-in duration-300">
            {isLoading && (
                <div className="flex flex-col items-center justify-center p-12 text-on-surface-variant font-medium">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                    <span>Đang tải danh sách loại phòng...</span>
                </div>
            )}

            {isError && (
                <div
                    className="glass bg-surface-container/60 p-8 rounded-3xl text-center border border-outline-variant/10">
                    <p className="text-on-surface-variant mb-4">
                        Không thể tải danh sách loại phòng. Vui lòng thử lại sau.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-on-primary rounded-xl hover:brightness-110 transition-all font-semibold"
                    >
                        Tải lại trang
                    </button>
                </div>
            )}

            {!isLoading && !isError && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {roomTypesList.map((rt) => (
                        <div
                            key={rt.id}
                            onClick={() => setSelectedRoomTypeId(rt.id)}
                            className={cn(
                                "glass bg-surface-container/60 p-5 rounded-3xl group border-2 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between",
                                selectedRoomTypeId === rt.id
                                    ? "border-primary shadow-[0_0_20px_rgba(236,178,255,0.25)] bg-surface-container-high/70"
                                    : "border-outline-variant/10 hover:border-primary/50"
                            )}
                        >
                            <div
                                className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 blur-3xl group-hover:bg-primary/15 transition-all"></div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4
                                                className={cn(
                                                    "font-heading text-headline-md transition-colors",
                                                    selectedRoomTypeId === rt.id
                                                        ? "text-primary"
                                                        : "text-on-surface group-hover:text-primary"
                                                )}
                                            >
                                                {rt.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 text-on-surface-variant mt-1">
                                                <span className="text-base text-secondary">
                                                    Sức chứa: {rt.capacity} khách
                                                </span>
                                            </div>
                                        </div>
                                        <span
                                            className={cn(
                                                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                rt.name.toLowerCase().includes("vip")
                                                    ? "bg-primary-container text-white"
                                                    : "bg-surface-container-highest text-on-surface-variant"
                                            )}
                                        >
                                            {rt.name.toLowerCase().includes("vip") ? "VIP" : "Standard"}
                                        </span>
                                    </div>

                                    <div
                                        className="h-44 rounded-2xl mb-4 overflow-hidden relative border border-white/5 bg-surface-container-lowest">
                                        <Image
                                            fill
                                            src={rt.imageUrl}
                                            alt={rt.name}
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            unoptimized
                                        />
                                    </div>

                                    <p className="text-xs text-on-surface-variant/90 line-clamp-2 mb-4 leading-relaxed">
                                        {rt.description}
                                    </p>
                                </div>

                                <div>
                                    {/* Mini features */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {rt.features?.map((f, i) => (
                                            <span
                                                key={i}
                                                className="text-[10px] bg-surface-container-low px-2 py-1 rounded-md text-on-surface-variant/80 border border-outline-variant/10"
                                            >
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    <div
                                        className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                                        <div className="flex flex-col">
                                            <span
                                                className="text-[10px] text-muted-foreground uppercase tracking-widest">
                                                Đơn giá
                                            </span>
                                            <span className="text-xl font-bold text-on-surface">
                                                {formatCurrency(rt.pricePerHour)}
                                                <span className="text-xs font-normal text-on-surface-variant">
                                                    /giờ
                                                </span>
                                            </span>
                                        </div>
                                        <div
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                                selectedRoomTypeId === rt.id
                                                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-110"
                                                    : "bg-surface-container-highest text-on-surface-variant hover:text-primary"
                                            )}
                                        >
                                            {selectedRoomTypeId === rt.id ? (
                                                <Check className="size-4 stroke-[3px]"/>
                                            ) : (
                                                <Plus className="size-4 stroke-[3px]"/>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
