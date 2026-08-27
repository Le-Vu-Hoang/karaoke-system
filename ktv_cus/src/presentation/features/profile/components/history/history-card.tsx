"use client";

import { Calendar, Clock, Timer, Banknote, CheckCircle, XCircle, AlertCircle, Clock3, Tag } from "lucide-react";
import { Booking } from "@/infrastructure/dtos/booking.dto";

interface HistoryCardProps {
  booking: Booking;
  onAction?: (bookingId: string, actionType: string) => void;
}

export default function HistoryCard({ booking, onAction }: HistoryCardProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp tới";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "pending":
        return "Đang chờ";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-tertiary/10 text-tertiary border border-tertiary/30";
      case "completed":
        return "bg-primary-container/10 text-primary border border-primary-container/30";
      case "cancelled":
        return "bg-error/10 text-error border border-error/30";
      case "pending":
        return "bg-secondary-container/10 text-secondary border border-secondary-container/30";
      default:
        return "bg-white/5 text-on-surface-variant border border-white/10";
    }
  };

  const getCardStyle = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-tertiary/5 border-l-tertiary border-y-white/5 border-r-white/5 hover:border-r-tertiary/30 hover:border-y-tertiary/30";
      case "completed":
        return "bg-primary/5 border-l-primary border-y-white/5 border-r-white/5 hover:border-r-primary/30 hover:border-y-primary/30";
      case "cancelled":
        return "bg-error/5 border-l-error border-y-white/5 border-r-white/5 hover:border-r-error/30 hover:border-y-error/30 opacity-75";
      case "pending":
        return "bg-secondary-container/5 border-l-secondary border-y-white/5 border-r-white/5 hover:border-r-secondary/30 hover:border-y-secondary/30";
      default:
        return "bg-white/5 border-l-on-surface-variant border-y-white/5 border-r-white/5";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock3 className="size-3.5 mr-1.5" />;
      case "completed":
        return <CheckCircle className="size-3.5 mr-1.5" />;
      case "cancelled":
        return <XCircle className="size-3.5 mr-1.5" />;
      case "pending":
        return <AlertCircle className="size-3.5 mr-1.5" />;
      default:
        return null;
    }
  };

  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);

  const date = start.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  const startTimeStr = start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const endTimeStr = end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  const timeRange = `${startTimeStr} - ${endTimeStr}`;

  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  const duration = hours > 0 ? `${hours} giờ ${mins > 0 ? `${mins} phút` : ''}` : `${mins} phút`;

  const renderActions = (isMobile: boolean = false) => {
    const btnClass = isMobile 
      ? "flex-1 py-2 text-sm font-semibold rounded-lg transition-colors text-center cursor-pointer" 
      : "px-5 py-2 text-sm font-semibold rounded-xl transition-colors cursor-pointer w-full text-center";
      
    switch (booking.status) {
      case "upcoming":
        return (
          <div className={isMobile ? "flex gap-2 w-full mt-3" : "flex flex-col gap-2 w-32"}>
            <button
              onClick={() => onAction?.(booking.id, "details")}
              className={`${btnClass} glass border border-primary/20 text-primary hover:bg-primary/10`}
            >
              Chi tiết
            </button>
            <button
              onClick={() => onAction?.(booking.id, "cancel")}
              className={`${btnClass} bg-surface-container-highest text-on-surface-variant hover:text-white`}
            >
              Hủy đặt
            </button>
          </div>
        );
      case "completed":
        return (
          <div className={isMobile ? "flex gap-2 w-full mt-3" : "flex flex-col gap-2 w-32"}>
            <button
              onClick={() => onAction?.(booking.id, "review")}
              className={`${btnClass} glass border border-primary/20 text-primary hover:bg-primary/10`}
            >
              Đánh giá
            </button>
            <button
              onClick={() => onAction?.(booking.id, "rebook")}
              className={`${btnClass} bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20`}
            >
              Đặt lại
            </button>
          </div>
        );
      case "cancelled":
        return (
          <div className={isMobile ? "flex gap-2 w-full mt-3" : "flex flex-col gap-2 w-32"}>
            <button
              onClick={() => onAction?.(booking.id, "cancel-reason")}
              className={`${btnClass} glass border border-white/10 text-on-surface-variant hover:text-white`}
            >
              Chi tiết hủy
            </button>
          </div>
        );
      case "pending":
        return (
          <div className={isMobile ? "flex gap-2 w-full mt-3" : "flex flex-col gap-2 w-32"}>
            <button
              onClick={() => onAction?.(booking.id, "pay")}
              className={`${btnClass} bg-secondary-container hover:bg-secondary text-white`}
            >
              Thanh toán
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* ----------------- DESKTOP ROW VIEW ----------------- */}
      <article
        className={`hidden md:flex flex-row items-center justify-between p-5 rounded-2xl border-l-4 border backdrop-blur-md transition-all duration-300 ${getCardStyle(booking.status)}`}
      >
        {/* Left: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
             <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(booking.status)}`}
             >
                {getStatusIcon(booking.status)}
                {getStatusLabel(booking.status)}
             </span>
             <span className="text-on-surface-variant text-sm font-medium">#{booking.id.substring(0, 8).toUpperCase()}</span>
          </div>
          
          <h3 className={`font-heading text-2xl font-bold mb-1 ${booking.status === "cancelled" ? "text-on-surface-variant line-through" : "text-white"}`}>
            {booking.room?.roomNumber ? `Phòng ${booking.room.roomNumber}` : "Chưa xếp phòng"}
          </h3>
          <p className="text-primary text-sm font-medium flex items-center gap-1.5">
            <Tag className="size-3.5" />
            {booking.roomType.name}
          </p>
        </div>

        {/* Middle: Details Grid */}
        <div className="flex-[2] grid grid-cols-4 gap-6 px-8 border-x border-white/10 mx-6">
          <div>
             <div className="flex items-center gap-1.5 text-on-surface-variant mb-1.5">
               <Calendar className="size-3.5" />
               <p className="text-[10px] uppercase font-bold tracking-widest">Ngày đặt</p>
             </div>
             <p className="font-sans text-sm font-semibold text-on-surface">{date}</p>
          </div>
          <div>
             <div className="flex items-center gap-1.5 text-on-surface-variant mb-1.5">
               <Clock className="size-3.5" />
               <p className="text-[10px] uppercase font-bold tracking-widest">Thời gian</p>
             </div>
             <p className="font-sans text-sm font-semibold text-on-surface">{timeRange}</p>
          </div>
          <div>
             <div className="flex items-center gap-1.5 text-on-surface-variant mb-1.5">
               <Timer className="size-3.5" />
               <p className="text-[10px] uppercase font-bold tracking-widest">Thời lượng</p>
             </div>
             <p className="font-sans text-sm font-semibold text-on-surface">{duration}</p>
          </div>
          <div>
             <div className="flex items-center gap-1.5 text-on-surface-variant mb-1.5">
               <Banknote className="size-3.5" />
               <p className="text-[10px] uppercase font-bold tracking-widest">Tổng cộng</p>
             </div>
             <p className={`font-sans text-sm font-bold ${booking.status === "cancelled" ? "text-on-surface-variant" : "text-tertiary drop-shadow-[0_0_8px_rgba(0,219,233,0.3)]"}`}>
               {Number(booking.deposit).toLocaleString("vi-VN")}đ
             </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="shrink-0 flex items-center justify-center">
          {renderActions(false)}
        </div>
      </article>

      {/* ----------------- MOBILE CARD VIEW ----------------- */}
      <article
        className={`block md:hidden flex flex-col p-4 rounded-xl border-l-4 border backdrop-blur-md active:scale-[0.98] transition-all duration-200 ${getCardStyle(booking.status)}`}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <span
               className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 ${getStatusClass(booking.status)}`}
            >
               {getStatusIcon(booking.status)}
               {getStatusLabel(booking.status)}
            </span>
            <h3 className={`font-heading text-lg font-bold ${booking.status === "cancelled" ? "text-on-surface-variant line-through" : "text-white"}`}>
               {booking.room?.roomNumber ? `Phòng ${booking.room.roomNumber}` : "Chưa xếp phòng"}
            </h3>
            <p className="text-primary text-xs font-medium mt-0.5 flex items-center gap-1">
              <Tag className="size-3" />
              {booking.roomType.name}
            </p>
          </div>
          <div className="text-right">
             <p className="text-[9px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Tổng cộng</p>
             <p className={`font-sans text-sm font-bold ${booking.status === "cancelled" ? "text-on-surface-variant" : "text-tertiary drop-shadow-[0_0_8px_rgba(0,219,233,0.3)]"}`}>
               {Number(booking.deposit).toLocaleString("vi-VN")}đ
             </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-3 rounded-lg bg-surface/30 border border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Calendar className="size-3.5" />
              <span className="text-xs font-medium">{date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <Clock className="size-3.5" />
              <span className="text-xs font-medium">{timeRange}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
             <Timer className="size-3.5" />
             <span className="text-xs font-medium">{duration}</span>
          </div>
        </div>

        {renderActions(true)}
      </article>
    </>
  );
}
