"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import HistoryCard from "./history-card";
import {Booking} from "@/infrastructure/dtos/booking.dto";

interface HistoryListProps {
  bookings: Booking[];
  onAction?: (bookingId: string, actionType: string) => void;
}

export default function HistoryList({ bookings, onAction }: HistoryListProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center glass rounded-2xl border border-white/5 min-h-[300px]">
        <p className="text-on-surface-variant font-medium mb-2">Không tìm thấy lịch sử đặt phòng phù hợp</p>
        <p className="text-xs text-on-surface-variant/60">Hãy thử tìm kiếm với từ khóa hoặc tab lọc khác.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Bookings Items List */}
      <div className="grid grid-cols-1 gap-6">
        {bookings.map((booking) => (
          <HistoryCard 
            key={booking.id} 
            booking={booking} 
            onAction={onAction} 
          />
        ))}
      </div>

      {/* Pagination Footer */}
      <footer className="mt-12 flex justify-center items-center gap-4">
        <button 
          type="button"
          className="p-2 glass rounded-full text-on-surface-variant hover:text-primary transition-all cursor-pointer"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex gap-2">
          <button 
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-on-primary-fixed font-bold cursor-pointer"
          >
            1
          </button>
          <button 
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full glass text-on-surface hover:border-primary/50 transition-all cursor-pointer"
          >
            2
          </button>
          <button 
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-full glass text-on-surface hover:border-primary/50 transition-all cursor-pointer"
          >
            3
          </button>
        </div>
        <button 
          type="button"
          className="p-2 glass rounded-full text-on-surface-variant hover:text-primary transition-all cursor-pointer"
        >
          <ChevronRight className="size-5" />
        </button>
      </footer>
    </div>
  );
}
