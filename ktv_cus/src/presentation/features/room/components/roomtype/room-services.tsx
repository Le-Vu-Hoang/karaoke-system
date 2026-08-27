"use client";

import HighlightCard from "./highlight-card";
import {Volume2, Sparkles} from "lucide-react";
import {cn} from "@/shared/lib/utils";

export default function RoomServices() {
    const highlights = [
        {
            icon: "support" as const,
            title: "Hỗ Trợ 24/7",
            description: "Đội ngũ nhân viên tận tâm luôn sẵn sàng phục vụ bia, đồ ăn nhẹ hoặc hỗ trợ kỹ thuật chỉ qua một nút chạm.",
            variant: "primary" as const,
        },
        {
            icon: "sound" as const,
            title: "Âm Thanh Đỉnh Cao",
            description: "Microphone chất lượng phòng thu, bộ xử lý âm thanh dải động lớn và cân chỉnh âm thanh chuyên nghiệp.",
            variant: "secondary" as const,
        },
        {
            icon: "control" as const,
            title: "Điều Khiển Thông Minh",
            description: "Chọn bài hát, điều chỉnh ánh sáng và yêu cầu dịch vụ trực tiếp từ máy tính bảng tại phòng hoặc điện thoại của bạn.",
            variant: "tertiary" as const,
        },
    ];

    return (
        <section
            className={cn(
                "py-16 md:py-24 px-margin max-w-7xl mx-auto",
                "flex flex-col gap-16 md:gap-24"
            )}
        >
            {/* 3 Main Service Highlights Grid */}
            <div>
                <div className="text-center mb-12 md:mb-16">
                    <h2
                        className={cn(
                            "font-heading text-3xl md:text-headline-lg font-extrabold",
                            "text-foreground mb-4 tracking-tight"
                        )}
                    >
                        Tiện Ích Cao Cấp
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4 rounded-full"/>
                    <p
                        className={cn(
                            "text-on-surface-variant max-w-[576px] mx-auto",
                            "text-sm md:text-base leading-relaxed font-medium"
                        )}
                    >
                        Chúng tôi chăm chút từng chi tiết để mang lại cho bạn trải nghiệm ca hát hoàn hảo và trọn vẹn
                        nhất.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {highlights.map((hl) => (
                        <HighlightCard
                            key={hl.title}
                            icon={hl.icon}
                            title={hl.title}
                            description={hl.description}
                            variant={hl.variant}
                        />
                    ))}
                </div>
            </div>

            {/* Immersive Neon Experience Section */}
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl p-8 md:p-12",
                    "bg-gradient-to-br from-surface-variant/40 to-surface-variant/20",
                    "border border-primary/20"
                )}
            >
                {/* Glow Spheres */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"/>
                <div className="absolute -left-20 -top-20 w-80 h-80 bg-secondary/15 rounded-full blur-3xl"/>

                <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* Text Content */}
                    <div className="md:col-span-7 flex flex-col items-start text-left">
                        <span
                            className={cn(
                                "inline-block px-3.5 py-1 rounded-full mb-4",
                                "bg-primary/15 border border-primary/30",
                                "text-xs font-semibold text-primary uppercase tracking-widest"
                            )}
                        >
                            Neon Experience
                        </span>
                        <h3
                            className={cn(
                                "font-heading text-2xl md:text-3xl font-bold",
                                "text-foreground mb-4 tracking-tight"
                            )}
                        >
                            Trải Nghiệm Không Gian Nhập Vai Độc Đáo
                        </h3>
                        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-medium mb-6">
                            Mỗi phòng hát tại Luna Karaoke đều được trang bị hệ thống đèn neon thông minh tích hợp trí
                            tuệ nhân tạo, tự động đồng bộ ánh sáng theo nhịp điệu bài hát cùng vòm âm thanh 360 độ sống
                            động, tạo nên bữa tiệc âm nhạc đỉnh cao cho mọi giác quan.
                        </p>
                    </div>

                    {/* Interactive Badges Grid */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-4">
                        <div
                            className={cn(
                                "bg-surface-variant/30 backdrop-blur-md p-5",
                                "border border-primary/20 rounded-xl",
                                "flex flex-col items-center justify-center text-center",
                                "transition-all duration-300",
                                "hover:border-primary/50 hover:shadow-[0_0_15px_rgba(189,0,255,0.2)] cursor-pointer"
                            )}
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <Volume2 className="text-primary size-6"/>
                            </div>
                            <span className="text-sm font-bold text-foreground">Âm Thanh 360°</span>
                            <span
                                className="text-[10px] text-on-surface-variant mt-1">Bao trùm toàn bộ không gian</span>
                        </div>

                        <div
                            className={cn(
                                "bg-surface-variant/30 backdrop-blur-md p-5",
                                "border border-secondary/20 rounded-xl",
                                "flex flex-col items-center justify-center text-center",
                                "transition-all duration-300",
                                "hover:border-secondary/50 hover:shadow-[0_0_15px_rgba(255,75,137,0.2)] cursor-pointer"
                            )}
                        >
                            <div
                                className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                                <Sparkles className="text-secondary size-6"/>
                            </div>
                            <span className="text-sm font-bold text-foreground">Đèn Nháy Cảm Biến</span>
                            <span className="text-[10px] text-on-surface-variant mt-1">Đồng bộ theo nhạc thực tế</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
