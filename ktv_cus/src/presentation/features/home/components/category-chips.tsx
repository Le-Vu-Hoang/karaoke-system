"use client";

import {Crown, Users, Gem, Music, Mic2} from "lucide-react";
import {cn} from "@/shared/lib/utils";
import React from "react";

interface Category {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: Category[] = [
    {id: "VVIP", label: "VVIP ROOM", icon: Crown},
    {id: "VIP", label: "VIP ROOM", icon: Gem},
    {id: "STANDARD", label: "STANDARD ROOM", icon: Music},
    {id: "CAMPUS BOX", label: "CAMPUS BOX", icon: Users},
    {id: "POCKET BOX", label: "POCKET BOX", icon: Mic2},
];

export default function CategoryChips() {
    return (
        <div className="w-full max-w-7xl mx-auto px-margin py-6">
            <div className="flex gap-sm overflow-x-auto pb-2 scrollbar-none md:justify-center">
                {CATEGORIES.map((category) => {
                    const Icon = category.icon;

                    return (
                        <button
                            key={category.id}
                            className={cn(
                                "px-5 py-2.5 rounded-full flex items-center gap-2 whitespace-nowrap active:scale-95 transition-all text-sm font-semibold border cursor-pointer select-none",
                                "bg-surface-variant/40 text-on-surface-variant border-transparent hover:bg-surface-variant/60 hover:text-foreground"
                            )}
                        >
                            <Icon className="size-4 shrink-0"/>
                            <span>{category.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
