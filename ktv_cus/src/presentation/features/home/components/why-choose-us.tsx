"use client";

import { Zap, Mic2, Headphones } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Benefit {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
    bgGlowClass: string;
    iconColorClass: string;
}

const BENEFITS: Benefit[] = [
    {
        title: "Instant Booking",
        description:
            "No more waiting for confirmation callbacks. Check real-time room availability and secure your spot in just a few seconds.",
        icon: Zap,
        accentClass: "border-primary/20 hover:border-primary/40 hover:shadow-[0_8px_32px_rgba(189,0,255,0.15)]",
        bgGlowClass: "bg-primary/10 shadow-[0_0_15px_rgba(189,0,255,0.3)]",
        iconColorClass: "text-primary",
    },
    {
        title: "Premium Sound",
        description:
            "Sing with confidence on professional JBL audio setups paired with top-tier wireless mics for effortless vocals and zero howling.",
        icon: Mic2,
        accentClass: "border-secondary/20 hover:border-secondary/40 hover:shadow-[0_8px_32px_rgba(255,75,137,0.15)]",
        bgGlowClass: "bg-secondary/10 shadow-[0_0_15px_rgba(255,75,137,0.3)]",
        iconColorClass: "text-secondary",
    },
    {
        title: "24/7 Support",
        description:
            "Plans changed unexpectedly? Our dedicated online concierge team is available around the clock to adjust your reservations seamlessly.",
        icon: Headphones,
        accentClass: "border-tertiary/20 hover:border-tertiary/40 hover:shadow-[0_8px_32px_rgba(0,219,233,0.15)]",
        bgGlowClass: "bg-tertiary/10 shadow-[0_0_15px_rgba(0,219,233,0.3)]",
        iconColorClass: "text-tertiary",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-surface-container-low py-xl">
            <div className="max-w-7xl mx-auto px-margin text-center">
                {/* Title */}
                <h2 className="text-headline-lg text-foreground font-bold mb-lg uppercase tracking-wide">
                    Why Choose Luna Karaoke?
                </h2>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                    {BENEFITS.map((benefit, idx) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "p-lg rounded-2xl glass-card border flex flex-col items-center text-center transition-all duration-300",
                                    benefit.accentClass
                                )}
                            >
                                {/* Glowing Icon Container */}
                                <div
                                    className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center mb-md transition-all duration-500",
                                        benefit.bgGlowClass
                                    )}
                                >
                                    <Icon className={cn("size-8", benefit.iconColorClass)} />
                                </div>

                                {/* Content */}
                                <h4 className="text-headline-md text-foreground mb-sm font-semibold">
                                    {benefit.title}
                                </h4>
                                <p className="text-on-surface-variant text-body-md leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}