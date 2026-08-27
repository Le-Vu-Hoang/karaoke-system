"use client";

import { GlassWater } from "lucide-react";

export default function ServiceHero() {
  return (
    <section className="relative min-h-[45vh] md:min-h-[50vh] flex items-center justify-start overflow-hidden py-16 md:py-0">
      {/* Background Cover Image with moody look */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=2000')",
        }}
      />
      {/* Ambient Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 md:via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,219,233,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(189,0,255,0.15),transparent_50%)]" />

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto px-margin w-full z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-9 flex flex-col items-start text-left">
          {/* Animated category badge */}
          <div className="flex items-center gap-2 mb-4 bg-tertiary/10 border border-tertiary/30 px-3.5 py-1 rounded-full shadow-[0_0_12px_rgba(0,219,233,0.25)] animate-pulse">
            <GlassWater className="size-4 text-tertiary" />
            <span className="font-heading text-xs font-bold text-tertiary uppercase tracking-widest">
              Gastronomy & Entertainment
            </span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-display-md lg:text-[4.5rem] font-extrabold leading-[1.1] mb-6 text-foreground tracking-tight">
            Our Services &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary drop-shadow-[0_0_20px_rgba(236,178,255,0.35)]">
              Gourmet Menu
            </span>
          </h1>

          <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Elevate your performance with our curated selection of premium spirits, artisan
            cocktails, and gourmet platters designed to fuel your vocal spotlight in a luxurious atmosphere.
          </p>
        </div>
      </div>
    </section>
  );
}
