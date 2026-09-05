import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/shared_ui/select";
import React from "react";

interface FloorStatusProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  roomTypeFilter: string;
  onRoomTypeChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  availableRoomTypes?: { id: string; name: string }[];
}

export function FloorStatus({
  searchQuery,
  onSearchChange,
  roomTypeFilter,
  onRoomTypeChange,
  statusFilter,
  onStatusFilterChange,
  availableRoomTypes = [],
}: FloorStatusProps) {
  return (
    <div className="mb-4 flex shrink-0 flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">Sơ đồ phòng</h1>
          <p className="mt-1 text-on-surface-variant">
            Tổng quan trạng thái các phòng VIP và tiêu chuẩn theo thời gian thực.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-error shadow-[0_0_10px_rgba(255,180,171,0.6)]"></span>
            <span className="text-xs text-on-surface-variant">Đang hát</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-success shadow-[0_0_10px_rgba(105,255,168,0.6)]"></span>
            <span className="text-xs text-on-surface-variant">Sẵn sàng</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-warning shadow-[0_0_10px_rgba(255,200,61,0.6)]"></span>
            <span className="text-xs text-on-surface-variant">Chờ dọn dẹp</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-notificate shadow-[0_0_10px_rgba(115,195,255,0.6)]"></span>
            <span className="text-xs text-on-surface-variant">Bảo trì</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm phòng, tên khách..."
            className="w-full rounded-lg border border-outline-variant/30 bg-surface-container py-2 pl-10 pr-3 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <Select value={roomTypeFilter} onValueChange={onRoomTypeChange}>
          <SelectTrigger className="w-[180px] bg-surface-container border-outline-variant/30 text-on-surface">
            <SelectValue placeholder="Loại phòng" />
          </SelectTrigger>
          <SelectContent className="bg-surface-container text-on-surface border-outline-variant/30">
            <SelectItem value="all">Tất cả loại phòng</SelectItem>
            {availableRoomTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px] bg-surface-container border-outline-variant/30 text-on-surface">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent className="bg-surface-container text-on-surface border-outline-variant/30">
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="IN_USE">Đang hát</SelectItem>
            <SelectItem value="AVAILABLE">Sẵn sàng</SelectItem>
            <SelectItem value="CLEARING">Chờ dọn dẹp</SelectItem>
            <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
