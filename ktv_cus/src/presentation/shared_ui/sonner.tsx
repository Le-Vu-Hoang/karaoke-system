"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            position="top-right"
            gap={10}
            icons={{
                success: <CircleCheckIcon className="size-4 shrink-0" />,
                info: <InfoIcon className="size-4 shrink-0" />,
                warning: <TriangleAlertIcon className="size-4 shrink-0" />,
                error: <OctagonXIcon className="size-4 shrink-0" />,
                loading: <Loader2Icon className="size-4 shrink-0 animate-spin" />,
            }}
            toastOptions={{
                classNames: {
                    toast: "group toast w-full rounded-lg border py-2.5 px-4 flex gap-2.5 items-center shadow-2xl transition-all duration-300 backdrop-blur-2xl",
                    content: "flex flex-col items-start gap-0.5 flex-1 min-w-0",
                    title: "text-xs font-bold font-heading tracking-wide break-words line-clamp-2",
                    description: "text-xs opacity-90 font-medium break-words line-clamp-2",

                    actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-semibold rounded-md px-3 py-1.5 text-[11px] hover:opacity-90 transition-opacity ml-auto shrink-0",
                    cancelButton: "group-[.toast]:bg-surface-bright group-[.toast]:text-foreground font-medium rounded-md px-3 py-1.5 text-[11px] hover:group-[.toast]:bg-surface-highest transition-colors shrink-0",
                    closeButton: "group-[.toast]:bg-surface-container group-[.toast]:text-foreground border-outline-variant/30 hover:group-[.toast]:bg-surface-bright opacity-0 group-hover:opacity-100 transition-opacity",

                    success: "!bg-gradient-to-b from-success-foreground to-success-container border border-success/20 !text-success [&_svg]:!text-success shadow-[0_8px_30px_rgba(105,255,168,0.2)]",
                    error: "!bg-gradient-to-b from-error-foreground to-error-container border border-error/20 !text-error [&_svg]:!text-error shadow-[0_8px_30px_rgba(255,180,171,0.2)]",
                    warning: "!bg-gradient-to-b from-warning-foreground to-warning-container border border-warning/20 !text-warning [&_svg]:!text-warning shadow-[0_8px_30px_rgba(255,200,61,0.2)]",
                    info: "!bg-gradient-to-b from-notificate-foreground to-notificate-container border border-notificate/20 !text-notificate [&_svg]:!text-notificate shadow-[0_8px_30px_rgba(115,195,255,0.2)]",
                },
            }}
            {...props}
        />
    )
}

export { Toaster, toast }