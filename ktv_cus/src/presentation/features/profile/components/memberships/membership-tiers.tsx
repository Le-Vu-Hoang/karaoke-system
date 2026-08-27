"use client";

import { useState } from "react";
import { Award, Gem, Crown, ChevronDown, CheckCircle, Shield } from "lucide-react";
import { useAuthStore } from "@/shared/stores/use-auth-store";
import { useStore } from "@/shared/stores/use-store";

interface Tier {
  id: string;
  name: string;
  subtitle: string;
  pointsRequired?: string;
  isActive?: boolean;
  glowClass: string;
  bgClass: string;
  colorClass: string;
  icon: React.ReactNode;
  benefits: string[];
  actionText: string;
  actionClass: string;
}

export default function MembershipTiers() {
  // state for mobile accordion toggle
  const [expandedTier, setExpandedTier] = useState<string | null>("gold");

  const user = useStore(useAuthStore, (state) => state.user);
  const currentTier = user?.membershipTier?.name?.toLowerCase() || "member";

  const tiers: Tier[] = [
    {
      id: "silver",
      name: "Silver",
      subtitle: "MEMBER LEVEL",
      pointsRequired: "Registered Member",
      glowClass: "shadow-[0_0_20px_rgba(218,226,253,0.1)] border-white/20",
      bgClass: "bg-surface-container/40",
      colorClass: "text-foreground/80",
      icon: <Award className="size-6 text-on-surface-variant" />,
      benefits: [
        "Earn 1 L-Point for every 10,000 VND spent",
        "5% discount on room bookings",
        "Basic birthday voucher",
      ],
      actionText: currentTier === "silver" ? "Current Status" : "Upgrade",
      actionClass: currentTier === "silver" ? "border border-white/20 text-white cursor-not-allowed hover:bg-white/5" : "bg-white/10 hover:bg-white/20 text-white cursor-pointer",
    },
    {
      id: "gold",
      name: "Gold",
      subtitle: "MOST POPULAR",
      pointsRequired: "Spend 5,000,000 VND",
      glowClass: "shadow-[0_0_30px_rgba(255,217,224,0.2)] border-secondary/40 ring-1 ring-secondary/20",
      bgClass: "bg-secondary/5",
      colorClass: "text-secondary",
      icon: <Crown className="size-6 text-secondary" />,
      benefits: [
        "10% discount on room bookings",
        "Priority room reservation",
        "Complimentary standard fruit platter",
        "Free basic room decoration for birthdays",
      ],
      actionText: currentTier === "gold" ? "Active Plan" : "Upgrade",
      actionClass: currentTier === "gold" ? "bg-secondary/20 border border-secondary/30 text-secondary cursor-default font-bold" : "bg-secondary/80 hover:bg-secondary text-white cursor-pointer font-bold",
    },
    {
      id: "platinum",
      name: "Platinum",
      subtitle: "ELITE SINGERS",
      pointsRequired: "Spend 20,000,000 VND",
      glowClass: "shadow-[0_0_30px_rgba(0,219,233,0.2)] border-tertiary/40",
      bgClass: "bg-surface-container/40",
      colorClass: "text-tertiary",
      icon: <Gem className="size-6 text-tertiary" />,
      benefits: [
        "15% discount on room bookings",
        "Guaranteed room availability (book 24h prior)",
        "Complimentary premium snack & drink combo",
        "Free 1 extra hour on birthday bookings",
      ],
      actionText: currentTier === "platinum" ? "Active Plan" : "Upgrade Now",
      actionClass: currentTier === "platinum" ? "bg-tertiary/20 border border-tertiary/30 text-tertiary cursor-default font-bold" : "bg-tertiary-container hover:bg-tertiary-container/90 text-white font-bold shadow-[0_0_15px_rgba(0,219,233,0.3)] hover:scale-105 transition-transform duration-300 cursor-pointer",
    },
    {
      id: "diamond",
      name: "Diamond",
      subtitle: "THE ULTIMATE",
      pointsRequired: "Spend 50,000,000 VND",
      glowClass: "shadow-[0_0_35px_rgba(236,178,255,0.25)] border-primary/40",
      bgClass: "bg-primary/5",
      colorClass: "text-primary",
      icon: <Shield className="size-6 text-primary" />,
      benefits: [
        "20% discount on all bookings & services",
        "Dedicated VIP service staff",
        "Priority check-in & VIP entrance",
        "Complimentary premium champagne on arrival",
      ],
      actionText: currentTier === "diamond" ? "Active Plan" : "Request Invite",
      actionClass: currentTier === "diamond" ? "bg-primary/20 border border-primary/30 text-primary cursor-default font-bold" : "bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-[0_0_20px_rgba(236,178,255,0.4)] hover:shadow-[0_0_30px_rgba(236,178,255,0.6)] hover:scale-105 transition-all duration-300 cursor-pointer",
    },
  ].map(t => ({ ...t, isActive: t.id === currentTier }));

  const toggleTierMobile = (id: string) => {
    if (expandedTier === id) {
      setExpandedTier(null);
    } else {
      setExpandedTier(id);
    }
  };

  return (
    <section className="mb-16 md:mb-20">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-heading text-lg md:text-headline-md text-white flex items-center gap-3 font-bold">
          <Award className="size-6 text-primary" /> Tier Benefits
        </h3>
      </div>

      {/* Desktop view (Grid) */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`glass-card rounded-2xl p-8 flex flex-col h-full relative overflow-hidden border backdrop-blur-xl transition-all duration-400 ${tier.bgClass} ${tier.glowClass}`}
          >
            {tier.isActive && (
              <div className="absolute top-4 right-4 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg animate-pulse z-20">
                Active
              </div>
            )}
            
            <div className="absolute top-0 right-0 p-4 opacity-10">
              {tier.icon}
            </div>

            <h3 className={`font-heading text-2xl font-bold mb-2 ${tier.colorClass}`}>
              {tier.name}
            </h3>
            
            <div className="text-on-surface-variant/80 font-semibold text-xs tracking-wider mb-8 uppercase">
              {tier.subtitle}
            </div>

            <ul className="space-y-4 mb-10 flex-grow">
              {tier.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <CheckCircle className={`size-4 mt-0.5 flex-shrink-0 ${tier.isActive ? "text-secondary fill-secondary/20" : "text-on-surface-variant/50"}`} />
                  <span className="text-on-background/90">{benefit}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`w-full py-3 rounded-xl transition-all text-sm font-bold cursor-pointer ${tier.actionClass}`}
            >
              {tier.actionText}
            </button>
          </div>
        ))}
      </div>

      {/* Mobile view (Expandable List) */}
      <div className="flex md:hidden flex-col gap-4">
        {tiers.map((tier) => {
          const isExpanded = expandedTier === tier.id;
          return (
            <div
              key={tier.id}
              className={`glass-card rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all duration-300 border ${
                tier.isActive ? "border-primary/40 bg-primary/5" : "border-outline-variant/10"
              }`}
            >
              {tier.isActive && (
                <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-on-primary font-bold text-[9px] uppercase tracking-wider rounded-bl-lg">
                  Current Status
                </div>
              )}

              <button
                type="button"
                onClick={() => toggleTierMobile(tier.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                    tier.isActive ? "bg-primary/20 border-primary/30" : "bg-surface-container-highest border-white/5"
                  }`}>
                    {tier.icon}
                  </div>
                  <div>
                    <h3 className={`font-heading text-base font-bold ${tier.isActive ? "text-primary" : "text-foreground"}`}>
                      {tier.name}
                    </h3>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      {tier.pointsRequired || tier.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`size-5 text-on-surface-variant transition-transform duration-300 ${
                    isExpanded ? "rotate-180 text-primary" : ""
                  }`}
                />
              </button>

              {/* Accordion content */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="space-y-3 pt-3 border-t border-outline-variant/10">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                      <CheckCircle className="size-4 text-primary fill-primary/10 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
