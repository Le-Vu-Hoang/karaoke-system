import Image from "next/image";
import { GlassWater, Beer, Pizza, Wine } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface MenuCardProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  icon?: "cocktail" | "beer" | "food" | "wine";
  layout?: "banner" | "card";
  className?: string;
  onClick?: () => void;
}

const iconMap = {
  cocktail: GlassWater,
  beer: Beer,
  food: Pizza,
  wine: Wine,
};

export default function MenuCard({
  title,
  subtitle,
  imageUrl,
  icon,
  layout = "banner",
  className,
  onClick,
}: MenuCardProps) {
  const Icon = icon && iconMap[icon] ? iconMap[icon] : null;

  if (layout === "card") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex-shrink-0 w-44 bg-surface-variant/20 backdrop-blur-md border border-primary/10 rounded-xl p-4 cursor-pointer hover:border-primary/40 hover:shadow-[0_0_15px_rgba(236,178,255,0.2)] active:scale-95 transition-all duration-300",
          className
        )}
      >
        <div className="h-32 w-full rounded-lg mb-3 overflow-hidden relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="176px"
              className="object-cover transition-transform duration-500 hover:scale-110"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <Pizza className="size-8 text-outline-variant" />
            </div>
          )}
        </div>
        {Icon && <Icon className="text-tertiary mb-1 size-5" />}
        <h4 className="font-heading text-sm font-bold text-foreground line-clamp-1">{title}</h4>
        {subtitle && <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{subtitle}</p>}
      </div>
    );
  }

  // "banner" layout (default)
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-2xl h-80 w-full border border-outline-variant/10 hover:border-primary/40 transition-all duration-500 shadow-md hover:shadow-[0_8px_25px_rgba(189,0,255,0.2)]",
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
          <Pizza className="size-16 text-outline-variant" />
        </div>
      )}

      {/* Dark gradient overlay for title contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

      {/* Content overlay */}
      <div className="absolute bottom-0 p-md w-full">
        <h4 className="font-heading text-xl font-extrabold text-foreground mb-1 group-hover:text-primary transition-colors">
          {title}
        </h4>
        {subtitle && (
          <p className="text-sm font-semibold text-primary/90 tracking-wide">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
