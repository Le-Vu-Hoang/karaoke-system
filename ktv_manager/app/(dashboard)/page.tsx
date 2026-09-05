"use client";

import { useMemo, useState } from "react";
import { FloorStatus } from "@/presentation/features/dashboard/components/floor-status";
import { RoomCard } from "@/presentation/features/dashboard/components/room-card";
import { UpcomingBookings } from "@/presentation/features/dashboard/components/upcoming-bookings";
import { ServiceRequests } from "@/presentation/features/dashboard/components/service-requests";
import { ShiftStatus } from "@/presentation/features/dashboard/components/shift-status";
import { useLiveRooms } from "@/presentation/features/dashboard/hooks/useLiveRooms";
import { CheckInDialog, CheckInFormValues, AvailableRoom } from "@/presentation/features/dashboard/components/checkin-dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkInBooking, walkInCheckIn } from "@/infrastructure/api/bookings";

// We define a fallback interface 
interface LiveRoomData {
  id: string;
  roomNumber: string;
  status: string;
  notes?: string;
  roomType?: {
    id: string;
    name: string;
    capacity: number;
    basePricePerHour: number;
  };
  currentSession?: {
    startTime: string;
    guestName?: string;
    currentBill: number;
  };
}

export default function DashboardPage() {
  const { data: roomsResponse, isLoading, isError } = useLiveRooms(1, 100);

  // States for Local Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // State for Check-In Modal
  const [checkInState, setCheckInState] = useState<{
    isOpen: boolean;
    mode: "walk-in" | "booking";
    roomId?: string;
    bookingId?: string;
  }>({ isOpen: false, mode: "walk-in" });

  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: async (data: CheckInFormValues & { mode: "walk-in" | "booking", bookingId?: string }) => {
      if (data.mode === "booking" && data.bookingId) {
        return await checkInBooking(data.bookingId, data.roomId);
      } else {
        return await walkInCheckIn({
          roomId: data.roomId,
          durationHours: data.durationHours || 2,
          guestName: data.guestName,
          guestPhone: data.guestPhone,
        });
      }
    },
    onSuccess: () => {
      toast.success("Mở phòng thành công!");
      setCheckInState({ isOpen: false, mode: "walk-in" });
      queryClient.invalidateQueries({ queryKey: ["rooms-live"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Trục trặc kỹ thuật khi mở phòng.");
    }
  });

  const formatStatus = (status: string) => {
    switch (status) {
      case "IN_USE": return "in_use";
      case "AVAILABLE": return "available";
      case "CLEARING": return "clearing";
      case "MAINTENANCE": return "maintenance";
      default: return "available";
    }
  };

  const roomsData = roomsResponse?.data as LiveRoomData[] | undefined;

  // Derive unique room types dynamically from the existing fetched rooms
  const availableRoomTypes = useMemo(() => {
    if (!roomsData) return [];
    const typeMap = new Map();
    roomsData.forEach((room) => {
      if (room.roomType && room.roomType.id) {
        if (!typeMap.has(room.roomType.id)) {
          typeMap.set(room.roomType.id, { id: room.roomType.id, name: room.roomType.name });
        }
      }
    });
    return Array.from(typeMap.values());
  }, [roomsData]);

  // Transform raw room data into suitable AvailableRoom array for the CheckIn dialog
  const availableCheckInRooms = useMemo<AvailableRoom[]>(() => {
    if (!roomsData) return [];
    return roomsData
      .filter((r) => r.status === "AVAILABLE")
      .map((r) => ({
        id: r.id,
        roomNumber: r.roomNumber,
        roomType: r.roomType?.name || "KTV Room",
      }));
  }, [roomsData]);

  // Apply filters locally on the client-side
  const filteredRooms = useMemo(() => {
    if (!roomsData) return [];
    return roomsData.filter((room) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        room.roomNumber?.toLowerCase().includes(q) ||
        (room.currentSession?.guestName && room.currentSession.guestName.toLowerCase().includes(q));

      const matchRoomType = roomTypeFilter === "all" || room.roomType?.id === roomTypeFilter;
      const matchStatus = statusFilter === "all" || room.status === statusFilter;

      return matchSearch && matchRoomType && matchStatus;
    });
  }, [roomsData, searchQuery, roomTypeFilter, statusFilter]);

  // API Submission for Check-in
  const handleCheckInSubmit = (data: CheckInFormValues) => {
    checkInMutation.mutate({
      ...data,
      mode: checkInState.mode,
      bookingId: checkInState.bookingId,
    });
  };

  return (
    <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-4">
      
      {/* 
        CheckIn Modal gets hoisted here so it overlays properly 
      */}
      <CheckInDialog
        isOpen={checkInState.isOpen}
        onClose={() => setCheckInState({ isOpen: false, mode: "walk-in" })}
        mode={checkInState.mode}
        preselectedRoomId={checkInState.roomId}
        availableRooms={availableCheckInRooms}
        isSubmitting={checkInMutation.isPending}
        onSubmit={handleCheckInSubmit}
      />

      {/* Left Main Section (3 columns) */}
      <section className="flex flex-col gap-6 lg:col-span-3">
        <FloorStatus 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          roomTypeFilter={roomTypeFilter}
          onRoomTypeChange={setRoomTypeFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          availableRoomTypes={availableRoomTypes}
        />

        {/* Room Grid */}
        {isLoading && <div className="text-on-surface-variant text-center py-10">Đang tải sơ đồ phòng...</div>}
        {isError && <div className="text-error text-center py-10">Lỗi khi tải dữ liệu phòng!</div>}
        
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredRooms?.map((room) => (
              <RoomCard
                key={room.id}
                roomNumber={room.roomNumber}
                roomType={room.roomType?.name || "Tiêu chuẩn"}
                status={formatStatus(room.status) as "in_use" | "available" | "clearing" | "maintenance"}
                capacity={room.roomType?.capacity}
                startTime={room.currentSession?.startTime}
                currentBill={room.currentSession?.currentBill}
                staffName={room.notes}
                issue={room.notes}
                partySize={room.currentSession?.guestName ? 1 : undefined} // optional generic logic
                onCheckIn={() => setCheckInState({ 
                   isOpen: true, 
                   mode: "walk-in", 
                   roomId: room.id 
                })}
              />
            ))}

            {filteredRooms?.length === 0 && (
              <div className="col-span-full text-center text-on-surface-variant py-10">
                Không tìm thấy phòng nào phù hợp với bộ lọc hiện tại.
              </div>
            )}
          </div>
        )}

        {/* Bottom Section: Bookings & Requests */}
        <div className="mt-auto grid shrink-0 grid-cols-1 gap-4 md:grid-cols-2">
          <UpcomingBookings />
          <ServiceRequests />
        </div>
      </section>

      {/* Right Sidebar Section (1 column) */}
      <aside className="h-full lg:col-span-1">
        <ShiftStatus />
      </aside>
    </div>
  );
}
