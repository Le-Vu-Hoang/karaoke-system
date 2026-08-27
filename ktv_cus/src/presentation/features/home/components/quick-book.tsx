"use client";

import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/presentation/shared_ui/button";

export default function QuickBook() {
  return (
    <section className="max-w-7xl mx-auto px-margin py-xl">
      <div className="glass-card rounded-3xl p-8 md:p-12 border border-primary/20 relative overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
        {/* Ambient background glow inside the banner */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Glowing Badge */}
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(189,0,255,0.2)] animate-pulse">
            <Zap className="text-primary size-7 fill-primary" />
          </div>

          <h2 className="text-headline-md md:text-headline-lg text-foreground mb-3 font-bold">
            Ready to sing?
          </h2>

          <p className="text-body-md text-on-surface-variant mb-8 px-4 leading-relaxed">
            Skip the queue. Instantly book the nearest available premium room and start your session right away.
          </p>

          <Button
            variant="default"
            className="w-full md:w-auto md:px-12 h-14 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-heading text-lg font-bold shadow-[0_0_20px_rgba(189,0,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 border-none cursor-pointer"
          >
            Quick Book Now
            <ArrowRight className="size-5 shrink-0 animate-pulse" />
          </Button>
        </div>
      </div>
    </section>
  );
}
