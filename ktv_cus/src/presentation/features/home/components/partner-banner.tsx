"use client";

import { Briefcase } from "lucide-react";
import { Button } from "@/presentation/shared_ui/button";

export default function PartnerBanner() {
  return (
    <section className="max-w-7xl mx-auto px-margin py-xl">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 to-secondary/15 p-lg md:p-xl border border-primary/20 shadow-[0_8px_32px_rgba(189,0,255,0.08)]">
        {/* Floating Decorative Icon in Background */}
        <div className="absolute -right-16 -top-16 opacity-10 pointer-events-none transform rotate-12 hidden md:block">
          <Briefcase className="size-80 text-primary" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-headline-lg text-foreground mb-md font-bold leading-tight">
            Have a venue? Become a Partner.
          </h2>

          <p className="text-body-lg text-on-surface-variant mb-lg leading-relaxed">
            Join the world&apos;s most premium karaoke network. List your lounge, manage bookings, and grow your revenue with Luna Karaoke&apos;s powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-8 py-3 rounded-full font-label-md shadow-[0_0_15px_rgba(189,0,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 border-none h-12"
            >
              Apply Now
            </Button>
            
            <Button
              variant="outline"
              className="border-outline text-foreground hover:bg-surface-variant/40 px-8 py-3 rounded-full font-label-md hover:scale-105 active:scale-95 transition-all duration-300 h-12"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
