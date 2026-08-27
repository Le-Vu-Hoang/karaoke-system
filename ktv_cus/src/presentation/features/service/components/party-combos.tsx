"use client";

import { ArrowRight } from "lucide-react";
import ComboCard from "./combo-card";
import { Button } from "@/presentation/shared_ui/button";

export interface PartyCombosProps { }

const combos = [
  {
    title: "Galaxy Bash Combo",
    discountTag: "-25% OFF",
    items: [
      "3 Hours VIP Room Access",
      "2 Bottles of Premium Gin/Vodka",
      "Grande Gourmet Platter",
    ],
    originalPrice: "6,500k VND",
    price: "4,850k VND",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800",
    variant: "primary" as const,
  },
  {
    title: "Stellar Night Combo",
    discountTag: "-20% OFF",
    items: [
      "2 Hours Standard Room Access",
      "12 Craft Beer Buckets",
      "Luna Snack Tower",
    ],
    originalPrice: "3,200k VND",
    price: "2,500k VND",
    imageUrl: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800",
    variant: "secondary" as const,
  },
];

export default function PartyCombos({ }: PartyCombosProps) {
  return (
    <section id="combos-section" className="bg-surface-container-low/40 border-t border-outline-variant/10 py-16 md:py-24 px-margin">
      <div className="max-w-7xl mx-auto">
        {/* Header content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="max-w-[576px] w-full">
            <span className="text-secondary font-heading text-xs font-black tracking-widest uppercase mb-2 block">
              Bundles of Joy
            </span>
            <h2 className="font-heading text-3xl md:text-headline-lg font-extrabold text-foreground tracking-tight">
              Special Party Combos
            </h2>
            <div className="w-12 h-1 bg-gradient-to-r from-secondary to-primary my-3 rounded-full" />
            <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-medium">
              Ultimate value packages designed for groups. Includes private room booking, unlimited mixers, and a premium culinary catering spread.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={() => console.log("Navigate to all packages")}
            className="group cursor-pointer text-tertiary hover:text-tertiary hover:bg-tertiary/10 font-bold flex items-center gap-2 p-0 px-4 h-10 rounded-lg transition-all"
          >
            View All Packages
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {combos.map((combo) => (
            <ComboCard
              key={combo.title}
              title={combo.title}
              discountTag={combo.discountTag}
              items={combo.items}
              originalPrice={combo.originalPrice}
              price={combo.price}
              imageUrl={combo.imageUrl}
              variant={combo.variant}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
