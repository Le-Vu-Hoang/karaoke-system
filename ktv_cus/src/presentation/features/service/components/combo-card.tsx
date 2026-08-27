"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface ComboCardProps {
  title: string;
  discountTag?: string;
  items: string[];
  price: string;
  originalPrice?: string;
  imageUrl: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function ComboCard({
  title,
  discountTag,
  items,
  price,
  originalPrice,
  imageUrl,
  variant = "primary",
  className,
}: ComboCardProps) {
  return (
    <div className={cn("relative group w-full", className)}>
      {/* Outer Neon Glow Layer */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl blur opacity-20 group-hover:opacity-65 transition duration-700",
          variant === "primary"
            ? "bg-gradient-to-r from-primary to-tertiary"
            : "bg-gradient-to-r from-tertiary to-secondary"
        )}
      />

      {/* Main Container */}
      <div className="relative flex flex-col md:flex-row bg-surface-container/60 backdrop-blur-md border border-primary/10 rounded-xl overflow-hidden h-full">
        {/* Image Area */}
        <div className="w-full md:w-1/3 min-h-[200px] md:min-h-full relative overflow-hidden bg-surface-container-low">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <CheckCircle2 className="size-10 text-outline-variant" />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8 w-full md:w-2/3 flex flex-col justify-between">
          <div>
            {/* Header / Discount Title */}
            <div className="flex justify-between items-center gap-4 mb-4">
              <h3 className="font-heading text-xl md:text-2xl font-extrabold text-on-surface group-hover:text-primary transition-colors tracking-tight">
                {title}
              </h3>
              {discountTag && (
                <span className="bg-error-container text-on-error-container text-xs font-bold px-3 py-1 rounded shadow-sm shrink-0 uppercase tracking-wide">
                  {discountTag}
                </span>
              )}
            </div>

            {/* Included Items Checklist */}
            <ul className="space-y-2 mb-6">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-on-surface-variant font-medium leading-normal"
                >
                  <CheckCircle2
                    className={cn(
                      "size-4 shrink-0 mt-0.5",
                      variant === "primary" ? "text-primary" : "text-tertiary"
                    )}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing & Selection Footer */}
          <div className="flex items-end justify-between gap-4 mt-auto pt-4 border-t border-white/5">
            <div>
              {originalPrice && (
                <span className="block text-xs text-on-surface-variant line-through mb-0.5">
                  {originalPrice}
                </span>
              )}
              <span
                className={cn(
                  "font-heading text-lg md:text-xl font-black tracking-tight",
                  variant === "primary" ? "text-secondary" : "text-tertiary"
                )}
              >
                {price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
