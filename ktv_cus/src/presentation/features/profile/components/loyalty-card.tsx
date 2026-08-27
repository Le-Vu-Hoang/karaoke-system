"use client";

import { Award } from "lucide-react";

export default function LoyaltyCard() {
  const currentPoints = 12450;
  const pointsToNextRank = 2550;
  const percentage = Math.round((currentPoints / (currentPoints + pointsToNextRank)) * 100);

  return (
    <div className="bg-surface-container/70 border border-outline-variant/10 p-8 rounded-3xl relative overflow-hidden group shadow-2xl backdrop-blur-xl">
      {/* Decorative background icon */}
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
        <Award className="size-48 text-primary" />
      </div>

      <h3 className="font-heading text-lg md:text-headline-md text-primary mb-6 flex items-center gap-3 font-bold">
        <Award className="size-6 text-primary" /> Điểm L-Points
      </h3>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl md:text-5xl font-extrabold text-primary font-heading tracking-tight drop-shadow-[0_0_8px_rgba(236,178,255,0.4)]">
          {currentPoints.toLocaleString()}
        </span>
        <span className="text-on-surface-variant text-xs md:text-sm font-semibold uppercase tracking-widest">
          Points
        </span>
      </div>

      <p className="text-on-surface-variant text-xs md:text-sm mb-8 font-medium">
        Bạn còn <strong className="text-foreground">{pointsToNextRank.toLocaleString()} điểm</strong> để đạt hạng <strong className="text-secondary">Royal</strong>
      </p>

      <div className="space-y-4">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
          <span className="text-primary">Diamond</span>
          <span className="text-on-surface-variant">Royal</span>
        </div>

        {/* Custom Progress Bar */}
        <div className="h-4 w-full bg-surface-variant rounded-full overflow-hidden p-[2px] border border-outline-variant/10">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px] opacity-70 animate-pulse" />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => console.log("Redeem rewards")}
        className="mt-8 md:mt-10 w-full py-3.5 bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-bold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all duration-300 cursor-pointer text-sm"
      >
        Đổi phần thưởng ngay
      </button>
    </div>
  );
}
