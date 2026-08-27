"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Users, Volume2, Sofa, Music, Sliders, DollarSign, Eye, CalendarCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/presentation/shared_ui/button";

export interface RoomFeature {
  icon: "users" | "audio" | "sofa" | "music" | "dj" | "price";
  text: string;
}

export interface RoomCardProps {
  title: string;
  tagline: string;
  badge?: {
    text: string;
    variant: "primary" | "secondary" | "tertiary";
  };
  features: RoomFeature[];
  imageUrl: string;
  onBookClick?: () => void;
  onDetailsClick?: () => void;
  className?: string;
}

const iconMap = {
  users: Users,
  audio: Volume2,
  sofa: Sofa,
  music: Music,
  dj: Sliders,
  price: DollarSign,
};

export default function RoomCard({
  title,
  tagline,
  badge,
  features,
  imageUrl,
  onBookClick,
  onDetailsClick,
  className,
}: RoomCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20; // limit rotation
    const rotateY = (centerX - x) / 20;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: "transform 0.15s ease-out" }}
      className={cn(
        "bg-surface-variant/20 backdrop-blur-xl border border-primary/10 rounded-xl overflow-hidden flex flex-col group transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(236,178,255,0.25)]",
        className
      )}
    >
      {/* Image Section */}
      <div className="h-48 md:h-64 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized // Allow external URLs
          />
        ) : (
          <div className="w-full h-full bg-surface-container flex items-center justify-center">
            <Music className="size-12 text-outline-variant animate-pulse" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Badge */}
        {badge && (
          <div
            className={cn(
              "absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider",
              badge.variant === "primary" && "bg-primary-container/20 border-primary/30 text-primary",
              badge.variant === "secondary" && "bg-secondary-container/20 border-secondary/30 text-secondary",
              badge.variant === "tertiary" && "bg-tertiary-container/20 border-tertiary/30 text-tertiary"
            )}
          >
            {badge.text}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-md flex-1 flex flex-col">
        <h3 className="font-heading text-xl font-bold text-foreground mb-xs tracking-tight">
          {title}
        </h3>
        <p className="text-sm font-semibold text-secondary-fixed-dim/80 mb-md italic">
          &ldquo;{tagline}&rdquo;
        </p>

        {/* Feature List */}
        <ul className="space-y-sm mb-lg flex-1">
          {features.map((feature, idx) => {
            const Icon = iconMap[feature.icon] || Music;
            return (
              <li key={idx} className="flex items-center gap-xs text-sm text-on-surface-variant font-medium">
                <Icon className="text-primary size-[18px] shrink-0" />
                <span>{feature.text}</span>
              </li>
            );
          })}
        </ul>

        {/* Action Buttons */}
        <div className="flex gap-sm">
          <Button
            variant="outline"
            onClick={onDetailsClick}
            className="flex-1 cursor-pointer bg-surface-container-high/40 hover:bg-surface-container-high border-outline-variant/30 text-on-surface-variant hover:text-primary transition-all text-xs font-bold py-2.5 h-10 rounded-lg flex items-center justify-center gap-1.5"
          >
            <Eye className="size-4" />
            Chi Tiết
          </Button>
          <Button
            onClick={onBookClick}
            className="flex-1 cursor-pointer bg-gradient-to-br from-primary-container to-secondary-container text-white border-0 shadow-[0_4px_12px_rgba(189,0,255,0.3)] hover:shadow-[0_6px_18px_rgba(189,0,255,0.5)] hover:-translate-y-0.5 transition-all text-xs font-bold py-2.5 h-10 rounded-lg flex items-center justify-center gap-1.5"
          >
            <CalendarCheck className="size-4" />
            Đặt Ngay
          </Button>
        </div>
      </div>
    </div>
  );
}
