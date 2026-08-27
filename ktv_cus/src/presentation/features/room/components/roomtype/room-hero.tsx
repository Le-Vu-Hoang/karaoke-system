"use client";

import { Mic, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/presentation/shared_ui/button";

export interface RoomHeroProps {
  onExploreRoomsClick?: () => void;
  onViewMenuClick?: () => void;
}

export default function RoomHero({
  onExploreRoomsClick,
  onViewMenuClick,
}: RoomHeroProps) {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden py-16 md:py-0">
      {/* Background Image with Parallax-like Cover */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070')",
        }}
      />
      {/* Ambient Radial Gradient Glows */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 md:via-background/70 to-background/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(189,0,255,0.2),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,75,137,0.15),transparent_50%)]" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-margin w-full z-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Text Content */}
        <div className="md:col-span-8 flex flex-col items-center md:items-start text-center md:text-left">
          {/* Mobile Pulsing Mic Icon */}
          <div className="md:hidden w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_15px_rgba(189,0,255,0.3)]">
            <Mic className="text-primary size-8" />
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl md:text-display-lg lg:text-[5rem] font-extrabold leading-[1.1] mb-6 text-foreground tracking-tight">
            The Ultimate Stage <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary drop-shadow-[0_0_20px_rgba(189,0,255,0.35)]">
              For Your Voice
            </span>
          </h1>

          <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-[576px] mb-8 md:mb-10 leading-relaxed">
            Trải nghiệm karaoke đẳng cấp tại Luna với hệ thống âm thanh vòm chuẩn studio,
            phòng hát neon sang trọng được thiết kế riêng tư và menu ẩm thực độc đáo.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button
              onClick={onExploreRoomsClick}
              className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-[0_4px_20px_rgba(189,0,255,0.4)] hover:shadow-[0_6px_25px_rgba(189,0,255,0.6)] hover:-translate-y-0.5 transition-all text-sm font-bold px-8 py-3.5 h-12 rounded-xl flex items-center justify-center gap-2"
            >
              Khám Phá Phòng
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              onClick={onViewMenuClick}
              className="w-full sm:w-auto cursor-pointer bg-surface-variant/20 backdrop-blur-xl border border-primary/20 hover:border-primary/50 text-foreground transition-all text-sm font-bold px-8 py-3.5 h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <BookOpen className="size-4" />
              Xem Thực Đơn
            </Button>
          </div>
        </div>

        {/* Desktop Side Graphic */}
        <div className="hidden md:flex md:col-span-4 justify-center items-center">
          <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 animate-spin-slow shadow-[0_0_40px_rgba(189,0,255,0.3)]">
            <div className="w-full h-full bg-background rounded-full flex flex-col items-center justify-center gap-4">
              <Mic className="size-20 text-primary animate-pulse" />
              <span className="font-heading text-xs font-black tracking-widest text-secondary">
                LUNA KTV
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
