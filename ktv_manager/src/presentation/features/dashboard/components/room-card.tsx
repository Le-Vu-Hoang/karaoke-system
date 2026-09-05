import { Mic, CheckCircle2, Sparkles, Wrench, Timer, Hourglass, AlertCircle, LogIn } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/presentation/shared_ui/button";
import { useEffect, useState } from "react";

export type RoomStatus = "in_use" | "available" | "clearing" | "maintenance";

export interface RoomCardProps {
  roomNumber: string;
  roomType: string;
  status: RoomStatus;
  capacity?: number;
  // In Use
  startTime?: Date | string | number; // Added for ticking
  timeElapsed?: string; // Fallback or static version
  partySize?: number;
  currentBill?: number;
  // Clearing
  estimatedTime?: string;
  staffName?: string;
  // Maintenance
  issue?: string;
  // Actions
  onCheckIn?: () => void;
}

export function RoomCard({
  roomNumber,
  roomType,
  status,
  capacity,
  startTime,
  timeElapsed,
  partySize,
  currentBill,
  estimatedTime,
  staffName,
  issue,
  onCheckIn,
}: RoomCardProps) {
  // Styles and icons based on status
  const statusConfig = {
    in_use: {
      borderColor: "border-error/50",
      shadow: "shadow-[0_0_15px_rgba(255,180,171,0.2)]",
      textColor: "text-error",
      bgColor: "bg-error/10",
      topBar: "bg-error shadow-[0_0_10px_rgba(255,180,171,0.8)]",
      glow: "bg-error/10",
      label: "Đang hát",
      icon: Mic,
    },
    available: {
      borderColor: "border-success/30 hover:border-success/60",
      shadow: "",
      textColor: "text-success",
      bgColor: "bg-success/10",
      topBar: "",
      glow: "bg-success/10",
      label: "Sẵn sàng",
      icon: CheckCircle2,
    },
    clearing: {
      borderColor: "border-warning/40",
      shadow: "shadow-[0_0_10px_rgba(255,200,61,0.1)]",
      textColor: "text-warning",
      bgColor: "bg-warning/10",
      topBar: "",
      glow: "",
      label: "Chờ dọn",
      icon: Sparkles,
    },
    maintenance: {
      borderColor: "border-notificate/30",
      shadow: "",
      textColor: "text-notificate",
      bgColor: "bg-notificate/10",
      topBar: "",
      glow: "",
      label: "Bảo trì",
      icon: Wrench,
    },
  };

  const config = statusConfig[status] || statusConfig["available"];
  const Icon = config.icon;

  const [tickingTime, setTickingTime] = useState<string | undefined>(timeElapsed);

  useEffect(() => {
    if (status !== "in_use" || !startTime) {
      setTickingTime(timeElapsed);
      return;
    }

    const interval = setInterval(() => {
      const past = new Date(startTime).getTime();
      const now = new Date().getTime();
      const diff = now - past;
      
      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

      setTickingTime(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [status, startTime, timeElapsed]);

  return (
    <div
      className={cn(
        "group relative flex h-62.5 flex-col justify-between overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 glass",
        config.borderColor,
        config.shadow,
        status === "maintenance" && "bg-surface-container/50",
      )}
    >
      {/* Top Border Glow for In Use */}
      {config.topBar && <div className={cn("absolute left-0 top-0 h-1 w-full", config.topBar)} />}

      {/* Background Glow */}
      {config.glow && (
        <div
          className={cn(
            "absolute -right-10 -top-10 size-32 rounded-full blur-2xl transition-opacity duration-500",
            config.glow,
            status === "available" ? "opacity-0 group-hover:opacity-100" : "",
          )}
        />
      )}

      {/* Header */}
      <div className="z-10 flex items-start justify-between">
        <div>
          <h3 className={cn("text-2xl font-bold", status === "maintenance" ? "text-on-surface-variant" : "text-on-surface")}>
            {roomNumber}
          </h3>
          <span
            className={cn(
              "mt-1 block text-xs tracking-widest uppercase",
              status === "in_use" ? "text-error" : status === "maintenance" ? "text-outline" : "text-on-surface-variant",
            )}
          >
            {roomType}
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            config.bgColor,
            config.textColor,
            status === "clearing" && "animate-pulse",
          )}
          style={{ borderColor: `currentColor` }} // Fallback for border color matching text
        >
          <Icon className="size-3.5" />
          {config.label}
        </div>
      </div>

      {/* Content area based on status */}
      <div className="z-10 mt-auto">
        {status === "in_use" && (
          <>
            <div className="mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-on-surface animate-pulse">
                <Timer className="size-4 text-error" /> {tickingTime || "00:00:00"}
              </span>
              {(partySize !== undefined) && <span className="text-sm text-on-surface-variant">Khách: {partySize || "N/A"}</span>}
            </div>
            <div className="mb-3 text-right">
              <span className="text-xs font-bold text-error">
                Tạm tính: {currentBill?.toLocaleString("vi-VN") || 0}đ
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-outline-variant/30 bg-surface-variant text-on-surface hover:bg-surface-bright"
              >
                Gọi món
              </Button>
              <Button className="bg-error font-bold text-surface shadow-[0_0_10px_rgba(255,180,171,0.4)] hover:scale-[1.02] active:scale-95">
                Thanh toán
              </Button>
            </div>
          </>
        )}

        {status === "available" && (
          <>
            <div className="mb-4 flex items-center justify-between opacity-50">
              <span className="flex items-center gap-1.5 text-on-surface-variant">
                <Timer className="size-4" /> --:--:--
              </span>
              <span className="text-sm text-on-surface-variant">Sức chứa: {capacity}</span>
            </div>
            <Button onClick={onCheckIn}
              className="w-full gap-2 border border-outline-variant/30 bg-surface-variant text-on-surface transition-all duration-300 hover:border-success/50 hover:bg-success/20 hover:text-success">
              <LogIn className="size-4" /> Nhận phòng
            </Button>
          </>
        )}

        {status === "clearing" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                <Hourglass className="size-4" /> {estimatedTime || "Sắp xong"}
              </span>
              {staffName && <span className="text-sm text-on-surface-variant">NV: {staffName}</span>}
            </div>
            <Button className="w-full border border-outline-variant/30 bg-surface-variant text-on-surface transition-all duration-300 hover:border-warning/50 hover:bg-warning/20 hover:text-warning">
              Hoàn thành
            </Button>
          </>
        )}

        {status === "maintenance" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm text-outline">
                <AlertCircle className="size-4 text-notificate" /> {issue || "Đang bảo trì"}
              </span>
            </div>
            <Button
              disabled
              className="w-full border border-outline-variant/10 bg-surface-container-lowest text-outline"
            >
              Không khả dụng
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
