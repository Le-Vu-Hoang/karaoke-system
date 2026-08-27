import { Headset, AudioLines, Smartphone, Sparkles, Volume2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export interface HighlightCardProps {
  icon: "support" | "sound" | "control" | "light" | "audio3d";
  title: string;
  description: string;
  variant?: "primary" | "secondary" | "tertiary";
  className?: string;
}

const iconMap = {
  support: Headset,
  sound: AudioLines,
  control: Smartphone,
  light: Sparkles,
  audio3d: Volume2,
};

export default function HighlightCard({
  icon,
  title,
  description,
  variant = "primary",
  className,
}: HighlightCardProps) {
  const Icon = iconMap[icon] || AudioLines;

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center p-md rounded-xl bg-surface-variant/10 border border-outline-variant/10 group transition-all duration-300 hover:-translate-y-1",
        variant === "primary" && "hover:border-primary/40",
        variant === "secondary" && "hover:border-secondary/40",
        variant === "tertiary" && "hover:border-tertiary/40",
        className
      )}
    >
      <div
        className={cn(
          "w-16 h-16 rounded-full bg-surface-variant/30 flex items-center justify-center mb-md border transition-all duration-300",
          variant === "primary" && "border-primary/40 group-hover:bg-primary/20 text-primary group-hover:shadow-[0_0_15px_rgba(236,178,255,0.4)]",
          variant === "secondary" && "border-secondary/40 group-hover:bg-secondary/20 text-secondary group-hover:shadow-[0_0_15px_rgba(255,177,195,0.4)]",
          variant === "tertiary" && "border-tertiary/40 group-hover:bg-tertiary/20 text-tertiary group-hover:shadow-[0_0_15px_rgba(0,219,233,0.4)]"
        )}
      >
        <Icon className="size-8" />
      </div>
      <h5 className="font-heading text-lg font-bold text-on-surface mb-xs tracking-tight">
        {title}
      </h5>
      <p className="text-sm leading-relaxed text-on-surface-variant font-medium">
        {description}
      </p>
    </div>
  );
}
