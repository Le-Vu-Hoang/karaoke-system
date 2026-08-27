"use client";

import { Ticket, Wine } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Promo {
  id: string;
  badge: string;
  headline: React.ReactNode;
  subtitle: string;
  tag: string;
  gradientClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PROMOS: Promo[] = [
  {
    id: "1",
    badge: "Member Only",
    headline: (
      <>
        50% OFF<br />
        <span className="text-on-primary-container/85 text-lg font-medium">
          First VIP Booking
        </span>
      </>
    ),
    subtitle: "First VIP Booking",
    tag: "CODE: SING50",
    gradientClass:
      "from-primary-container to-secondary-container shadow-[0_4px_20px_rgba(189,0,255,0.25)]",
    icon: Ticket,
  },
  {
    id: "2",
    badge: "Midweek Special",
    headline: (
      <>
        UNLIMITED<br />
        <span className="text-white/75 text-lg font-medium">
          Cocktails for 2 Hours
        </span>
      </>
    ),
    subtitle: "Cocktails for 2 Hours",
    tag: "Every Wed-Thu",
    gradientClass:
      "from-tertiary-container to-surface-container-highest shadow-[0_4px_20px_rgba(0,131,139,0.25)]",
    icon: Wine,
  },
];

export default function SpecialOffers() {
  return (
    <section className="py-xl" id="offers">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Section Header */}
        <div className="mb-lg">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest block mb-1">
            Exclusive Perks
          </span>
          <h2 className="text-headline-lg text-foreground font-bold">
            Special Offers
          </h2>
        </div>

        {/* Promo Container: Horizontal scroll on mobile, flex row on desktop */}
        <div className="flex md:grid md:grid-cols-2 gap-gutter overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {PROMOS.map((promo) => {
            const Icon = promo.icon;
            return (
              <div
                key={promo.id}
                className={cn(
                  "flex-shrink-0 w-[85vw] md:w-auto h-48 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center snap-center select-none border border-white/5",
                  promo.gradientClass
                )}
              >
                {/* Floating Icon Background Decorator */}
                <div className="absolute -right-6 -bottom-6 opacity-15 transform rotate-12 pointer-events-none">
                  <Icon className="size-36 text-white" />
                </div>

                {/* Content */}
                <span className="font-label-md text-label-md text-white/80 mb-2 font-semibold">
                  {promo.badge}
                </span>

                <h3 className="font-heading text-2xl md:text-headline-md font-bold text-white mb-4 leading-tight">
                  {promo.headline}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full font-label-md text-label-md text-white border border-white/30 w-fit">
                    {promo.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
