"use client";

import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/lib/utils";

interface UnderConstructionProps {
    title?: string;
    description?: string;
    className?: string;
    showBackButton?: boolean;
    icon?: React.ElementType;
}

export function UnderConstruction({
    title = "Chức năng đang phát triển",
    description = "Tính năng này hiện đang được chúng tôi xây dựng và sẽ sớm ra mắt. Cảm ơn bạn đã kiên nhẫn chờ đợi!",
    className,
    showBackButton = true,
    icon: Icon = Construction,
}: UnderConstructionProps) {
    const router = useRouter();

    return (
        <div className={cn("flex flex-col items-center justify-center min-h-[50vh] p-8 text-center", className)}>
            <div className="relative mb-8">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                {/* Icon container */}
                <div
                    className="relative flex items-center justify-center bg-background/50 backdrop-blur-sm p-5 rounded-full border border-primary/20 shadow-lg">
                    <Icon className="size-12 text-primary" strokeWidth={1.5} />
                </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-foreground">
                {title}
            </h2>

            <p className="text-muted-foreground text-sm md:text-base w-full mb-8 leading-relaxed">
                {description}
            </p>

            {showBackButton && (
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="gap-2 shadow-sm rounded-full px-6"
                >
                    <ArrowLeft className="size-4" />
                    Quay lại trang trước
                </Button>
            )}
        </div>
    );
}
