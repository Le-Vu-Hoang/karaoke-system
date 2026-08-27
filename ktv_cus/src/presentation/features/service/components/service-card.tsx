"use client";

import Image from "next/image";
import { Star, Award, GlassWater, Wine, Pizza, Utensils } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
  tag?: string;
  iconType?: "star" | "recommend" | "snack" | "drink" | "wine" | "meal";
  className?: string;
}

const iconMap = {
  star: Star,
  recommend: Award,
  snack: Pizza,
  drink: GlassWater,
  wine: Wine,
  meal: Utensils,
};

export default function ServiceCard({
  title,
  description,
  price,
  imageUrl,
  tag,
  iconType,
  className,
}: ServiceCardProps) {
  const Icon = iconType ? iconMap[iconType] : null;

  return (
    <div
      className={cn(
        "group flex flex-col bg-surface-container/65 backdrop-blur-md border border-primary/10 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary/45 hover:shadow-[0_10px_30px_rgba(0,0,0,0.55),0_0_20px_rgba(236,178,255,0.2)]",
        className
      )}
    >
      {/* Card Image Area */}
      <div className="h-48 relative overflow-hidden bg-surface-container-low">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline-variant">
            <Utensils className="size-12" />
          </div>
        )}

        {/* Floating Tag */}
        {tag && (
          <span
            className={cn(
              "absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md",
              tag === "Popular" && "bg-secondary text-on-secondary",
              tag === "Chef's Choice" && "bg-tertiary text-on-tertiary",
              tag !== "Popular" && tag !== "Chef's Choice" && "bg-primary-container text-on-primary-container"
            )}
          >
            {tag}
          </span>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h4 className="font-heading text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h4>
          {Icon && (
            <Icon
              className={cn(
                "size-5 shrink-0",
                iconType === "drink" && "text-primary",
                iconType === "wine" && "text-secondary",
                iconType === "snack" && "text-tertiary",
                iconType === "meal" && "text-secondary",
                iconType === "recommend" && "text-secondary",
                iconType === "star" && "text-tertiary"
              )}
            />
          )}
        </div>

        <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-5 flex-grow line-clamp-2">
          {description}
        </p>

        {/* Card Action footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="font-heading text-lg font-bold text-primary tracking-tight">
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}
