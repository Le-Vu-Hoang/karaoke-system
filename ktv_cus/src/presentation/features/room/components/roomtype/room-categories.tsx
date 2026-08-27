"use client";

import RoomCard from "./room-card";
import {useRoomTypes} from "@/presentation/features/booking/hooks/use-roomType";
import { cn } from "@/shared/lib/utils";

const badge = { text: "Luxury", variant: "primary" as const };
const defaultTagline = "Intimate & Luxurious";

export interface RoomCategoriesProps {
    onBookRoom?: (roomType: string) => void;
    onDetailsRoom?: (roomType: string) => void;
}

export default function RoomCategories({
    onBookRoom,
    onDetailsRoom,
}: RoomCategoriesProps) {
    const {data: rooms, isLoading: roomLoading, isError: roomError} = useRoomTypes();

    return (
        <section id="rooms-section" className="py-16 md:py-24 px-margin max-w-7xl mx-auto">
            {/* Header Info */}
            <div className="text-center mb-12 md:mb-16">
                <h2 
                    className={cn(
                        "font-heading text-3xl md:text-headline-lg font-extrabold",
                        "text-foreground mb-4 tracking-tight"
                    )}
                >
                    Chọn Phòng Riêng Của Bạn
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4 rounded-full"/>
                <p 
                    className={cn(
                        "text-on-surface-variant max-w-[576px] mx-auto",
                        "text-sm md:text-base leading-relaxed font-medium"
                    )}
                >
                    Mỗi phòng hát đều được thiết kế mang phong cách neon hiện đại, cách âm tuyệt đối và trang bị hệ
                    thống âm thanh ánh sáng đỉnh cao.
                </p>
            </div>

            {/* Loading / Error States */}
            {roomLoading && (
                <div className="py-12 flex justify-center items-center">
                    <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin"/>
                </div>
            )}
            
            {roomError && (
                <div className="py-12 text-center text-destructive font-medium">
                    Không thể tải danh sách phòng. Vui lòng thử lại sau.
                </div>
            )}

            {/* Cards Grid */}
            {!roomLoading && !roomError && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(rooms || []).map((room) => (
                        <RoomCard
                            key={room.id}
                            title={room.name}
                            tagline={room.description || defaultTagline}
                            badge={badge}
                            imageUrl={room.imageUrl || "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069"}
                            features={[
                                {icon: "users" as const, text: `Sức chứa: ${room.capacity} khách`},
                                ...(room.tags || []).map(tag => ({ icon: "audio" as const, text: tag })),
                                {icon: "price" as const, text: `${room.basePricePerHour.toLocaleString('vi-VN')}đ / giờ`},
                            ]}
                            onBookClick={() => onBookRoom?.(room.name)}
                            onDetailsClick={() => onDetailsRoom?.(room.name)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
