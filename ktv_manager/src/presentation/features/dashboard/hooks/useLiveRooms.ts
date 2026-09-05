import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { getLiveRooms } from "@/infrastructure/api/rooms";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export function useLiveRooms(page = 1, limit = 50) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["rooms-live", page, limit],
    queryFn: () => getLiveRooms(page, limit),
    staleTime: 60_000,
  });

  useEffect(() => {
    // Setup Socket.IO connection
    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      // Tùy chọn add thêm auth token nếu backend yêu cầu auth ở Websocket
      // auth: { token: "your-token-if-needed" } 
    });

    socket.on("connect", () => {
      console.log("Connected to room socket server");
    });

    socket.on("room-status-changed", (payload) => {
      console.log("Room status changed! Invalidating live rooms cache...", payload);
      // Invalidate query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["rooms-live"] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return query;
}
