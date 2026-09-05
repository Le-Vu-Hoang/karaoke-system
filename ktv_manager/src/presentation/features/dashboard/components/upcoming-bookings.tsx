"use client";

import { CalendarClock } from "lucide-react";
import { ScrollArea } from "@/presentation/shared_ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import { useUpcomingBookings } from "../hooks/use-upcoming-bookings";
import { useMemo } from "react";

export function UpcomingBookings() {
  const { data: bookingsResponse, isLoading, isError } = useUpcomingBookings();

  const activeBookings = useMemo(() => {
    if (!bookingsResponse?.data) return [];
    
    // Sort logic, if we want nearest first
    const sorted = [...bookingsResponse.data].sort((a, b) => {
       return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    // Optionally filter only for upcoming within next N hours, currently getting everything today
    return sorted;
  }, [bookingsResponse?.data]);

  return (
    <div className="glass flex h-48 flex-col rounded-xl border border-outline-variant/20 p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-on-surface">
        <CalendarClock className="size-6 text-secondary" /> Đặt phòng sắp tới
      </h2>
      <ScrollArea className="flex-grow pr-4">
        {isLoading && <div className="text-sm text-on-surface-variant text-center">Đang tải...</div>}
        {isError && <div className="text-sm text-error text-center">Lỗi khi tải lịch đặt phòng</div>}
        
        {!isLoading && !isError && activeBookings.length === 0 && (
           <div className="text-sm text-on-surface-variant text-center my-4">Không có khách đặt trước trong hôm nay</div>
        )}

        {!isLoading && !isError && activeBookings.length > 0 && (
          <div className="space-y-3">
            {activeBookings.map((booking: any) => {
              const paymentStatus = booking.deposit > 0 ? "paid" : "unpaid";
              const timeString = new Date(booking.startTime).toLocaleTimeString("vi-VN", {
                hour: '2-digit', minute: '2-digit'
              });

              return (
                <div
                  key={booking.id}
                  className={cn(
                    "cursor-pointer rounded-lg border border-outline-variant/10 bg-surface-container p-3 transition-colors hover:bg-surface-bright",
                    paymentStatus === "paid"
                      ? "border-l-2 border-l-secondary"
                      : "border-l-2 border-l-tertiary",
                  )}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <span className="font-bold text-on-surface">
                      {booking.customer?.fullName || booking.guestName || "Khách vô danh"}
                    </span>
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-xs font-semibold",
                        paymentStatus === "paid"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-tertiary/10 text-tertiary",
                      )}
                    >
                      {timeString}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-on-surface-variant">
                      {booking.room?.roomNumber ? `Phòng ${booking.room.roomNumber} • ` : ''} 
                      {booking.roomType?.name || "KTV Room"} 
                    </span>
                    <span
                      className={cn(
                        "text-xs font-semibold",
                        paymentStatus === "paid" ? "text-tertiary" : "text-outline",
                      )}
                    >
                      {paymentStatus === "paid" ? "Đã cọc" : "Chưa cọc"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
