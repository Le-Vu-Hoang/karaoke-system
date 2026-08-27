"use client";

import {Star, ArrowRight, Users, Utensils, GlassWater} from "lucide-react";
import {Button} from "@/presentation/shared_ui/button";
import {cn} from "@/shared/lib/utils";

interface ServiceItem {
    id: string;
    title: string;
    rating: number;
    infoDetail: string;
    price: number;
    priceUnit: string;
    imageUrl: string;
    tags: string[];
    badge?: {
        text: string;
        variant: "popular" | "best-seller";
    };
}

const FEATURED_SERVICES: ServiceItem[] = [
    {
        id: "1",
        title: "Luxury VIP Room",
        rating: 4.9,
        infoDetail: "Capacity: 25 - 35 people",
        price: 650000,
        priceUnit: "/hr",
        imageUrl: "image/Luxury-room.png",
        tags: ["JBL Sound System", "Stage Lighting", "Premium Soundproofing"],
        badge: {
            text: "HOT ROOM",
            variant: "popular",
        },
    },
    {
        id: "2",
        title: "Fruit Boat & Finger Food Platter",
        rating: 4.8,
        infoDetail: "Includes: 5 side snacks & Large seasonal fruits",
        price: 450000,
        priceUnit: "/set",
        imageUrl: "image/Fruit-Boat.jpg",
        tags: ["Fresh Fruits", "Assorted Snacks", "Perfect for Groups"],
        badge: {
            text: "BEST SELLER",
            variant: "best-seller",
        },
    },
    {
        id: "3",
        title: "Premium Beer Tower Combo",
        rating: 5.0,
        infoDetail: "Includes: 1 Heineken Case & Chilled towels",
        price: 450000,
        priceUnit: "/combo",
        imageUrl: "image/Beer-Tower.jpg",
        tags: ["Ice-Cold Beer", "Complimentary Peanuts", "Save 15%"],
        badge: {
            text: "PARTY CHOICE",
            variant: "popular",
        },
    },
];

export default function FeaturedServices() {
    return (
        <section className="max-w-7xl mx-auto px-margin py-xl" id="services">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-lg gap-4">
                <div>
                    <h2 className="text-headline-lg text-primary font-bold uppercase tracking-wide">
                        Featured Services
                    </h2>
                    <p className="text-on-surface-variant text-body-md mt-xs">
                        Experience world-class entertainment with a diverse food and beverage menu at Luna Lounge.
                    </p>
                </div>

                <button
                    className="text-tertiary text-label-md border-b border-tertiary flex items-center gap-xs hover:gap-sm transition-all duration-300 w-fit cursor-pointer">
                    View all services <ArrowRight className="size-4"/>
                </button>
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {FEATURED_SERVICES.map((item) => (
                    <div
                        key={item.id}
                        className="group relative bg-surface-container/40 backdrop-blur-md rounded-2xl overflow-hidden border border-outline-variant/20 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(189,0,255,0.15)] flex flex-col"
                    >
                        {/* Card Media Wrapper */}
                        <div className="h-64 relative overflow-hidden shrink-0">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{backgroundImage: `url('${item.imageUrl}')`}}
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-surface-container/60 via-transparent to-transparent"/>

                            {/* Badge */}
                            {item.badge && (
                                <div
                                    className={cn(
                                        "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider select-none text-white",
                                        item.badge.variant === "popular"
                                            ? "bg-secondary-container/90 shadow-[0_0_10px_rgba(255,75,137,0.4)]"
                                            : "bg-tertiary-container/90 shadow-[0_0_10px_rgba(0,131,139,0.4)]"
                                    )}
                                >
                                    {item.badge.text}
                                </div>
                            )}
                        </div>

                        {/* Card details */}
                        <div className="p-md flex-1 flex flex-col justify-between">
                            <div>
                                {/* Header Row */}
                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <h3 className="text-headline-md text-foreground font-semibold group-hover:text-primary transition-colors duration-300 line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-secondary shrink-0 pt-0.5">
                                        <Star className="size-4 fill-secondary"/>
                                        <span className="text-label-md font-bold">
                      {item.rating.toFixed(1)}
                    </span>
                                    </div>
                                </div>

                                {/* Detail Row with Dynamic Icon based on Service Type */}
                                <p className="text-on-surface-variant text-label-sm mb-4 flex items-center gap-1.5">
                                    {item.id === "1" && <Users className="size-4 text-primary"/>}
                                    {item.id === "2" && <Utensils className="size-4 text-secondary"/>}
                                    {item.id === "3" && <GlassWater className="size-4 text-tertiary"/>}
                                    {item.infoDetail}
                                </p>

                                {/* Category tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {item.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-surface-variant/50 text-on-surface-variant rounded-full text-label-sm border border-outline-variant/10"
                                        >
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price & Action */}
                            <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
                                <div className="flex flex-col">
                  <span className="text-xs text-on-surface-variant/75">
                    Price
                  </span>
                                    <span className="text-primary text-lg font-bold">
                    {item.price.toLocaleString("vi-VN")}đ
                    <span className="text-label-sm text-on-surface-variant font-normal ml-0.5">
                      {item.priceUnit}
                    </span>
                  </span>
                                </div>

                                <Button
                                    variant="default"
                                    className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-label-sm hover:scale-105 active:scale-95 transition-all duration-300 border-none shadow-[0_0_15px_rgba(189,0,255,0.2)]"
                                >
                                    {item.id === "1" ? "Book Now" : "Add to Order"}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}