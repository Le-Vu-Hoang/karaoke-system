"use client";

import { Sparkles, Music, Calendar, Gift, ShieldAlert } from "lucide-react";

export default function LunaStandard() {
  const standards = [
    {
      title: "Next-Gen Audio",
      description: "Studio-grade equipment in every room for the most professional vocal experience.",
      icon: <Music className="size-5 text-tertiary" />,
      bg: "bg-tertiary/10",
    },
    {
      title: "Exclusive Events",
      description: "Invitations to singer showcases, themed parties, and celebrity masterclasses.",
      icon: <Calendar className="size-5 text-primary" />,
      bg: "bg-primary/10",
    },
    {
      title: "Partner Perks",
      description: "Discounts at nearby partner restaurants, cocktail bars, and boutiques.",
      icon: <Gift className="size-5 text-secondary" />,
      bg: "bg-secondary/10",
    },
    {
      title: "Personal Storage",
      description: "High-tier members get personal liquor lockers and custom mic storage.",
      icon: <ShieldAlert className="size-5 text-foreground" />,
      bg: "bg-white/10",
    },
  ];

  return (
    <section className="mb-10">
      <div className="glass-card rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-10 border border-outline-variant/10 backdrop-blur-xl">
        {/* Decorative image card */}
        <div className="w-full lg:w-1/3">
          <div className="relative w-full aspect-video lg:aspect-square rounded-2xl overflow-hidden border border-outline-variant/10 shadow-2xl">
            <img
              className="w-full h-full object-cover"
              alt="Experience the Luna Standard"
              src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <div className="absolute bottom-4 left-4 z-20">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[10px] font-bold text-primary tracking-wider uppercase">
                <Sparkles className="size-3" /> Luna Standard
              </span>
            </div>
          </div>
        </div>

        {/* Content detail */}
        <div className="w-full lg:w-2/3">
          <h4 className="font-heading text-xl md:text-headline-lg font-bold text-white mb-6">
            Experience the Luna Standard
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {standards.map((std, idx) => (
              <div key={idx} className="space-y-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border border-white/5 ${std.bg}`}>
                  {std.icon}
                </div>
                <h5 className="font-heading text-sm md:text-base font-bold text-white">
                  {std.title}
                </h5>
                <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed">
                  {std.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
