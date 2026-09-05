"use client";

import { BellRing, Bell, Martini } from "lucide-react";
import { ScrollArea } from "@/presentation/shared_ui/scroll-area";
import { cn } from "@/shared/lib/utils";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export interface ServiceRequestProps {
  id: string;
  roomNumber: string;
  title: string;
  timeAgo: string; // We'll compute this dynamically, or backend provides timestamp
  timestamp: Date;
  type: "urgent" | "normal";
}

export function ServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequestProps[]>([]);

  useEffect(() => {
    // Connect to the same socket we used for rooms
    const socket: Socket = io(SOCKET_URL, { transports: ["websocket"] });

    // Listen for new service requests
    socket.on("new-service-request", (payload: any) => {
      console.log("New service request received:", payload);
      const newReq: ServiceRequestProps = {
        id: payload.id || crypto.randomUUID(),
        roomNumber: payload.roomNumber,
        title: payload.title,
        type: payload.type || "normal",
        timestamp: new Date(payload.timestamp || new Date()),
        timeAgo: "Vừa xong", // Initial
      };
      // Add to top of the list
      setRequests((prev) => [newReq, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Update "timeAgo" string every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests((prev) => 
        [...prev] // Force re-render just to update the time display statically or dynamically
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Helper to calculate time ago
  const getTimeAgo = (date: Date) => {
    const diffMins = Math.floor((new Date().getTime() - new Date(date).getTime()) / 60000);
    if (diffMins === 0) return "Vừa xong";
    return `${diffMins} phút trước`;
  };

  const removeRequest = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <div className="glass flex h-48 flex-col rounded-xl border border-outline-variant/20 p-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-on-surface">
        <BellRing className="size-6 text-warning" /> Yêu cầu dịch vụ
      </h2>
      <ScrollArea className="flex-grow pr-4">
        {requests.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-on-surface-variant">
            Không có yêu cầu nào
          </div>
        ) : (
          <ul className="space-y-3">
            {requests.map((req) => (
              <li
                key={req.id}
                onClick={() => removeRequest(req.id)}
                title="Click để đánh dấu hoàn thành"
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all hover:opacity-80 active:scale-[0.98]",
                  req.type === "urgent"
                    ? "border-warning/20 bg-warning/10"
                    : "border-outline-variant/10 bg-surface-container",
                )}
              >
                {req.type === "urgent" ? (
                  <Bell className="mt-0.5 size-5 text-warning shrink-0" />
                ) : (
                  <Martini className="mt-0.5 size-5 text-primary shrink-0" />
                )}
                <div className="flex-grow">
                  <p className="font-bold text-on-surface text-sm">{req.title}</p>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      req.type === "urgent" ? "text-warning" : "text-on-surface-variant",
                    )}
                  >
                    {getTimeAgo(req.timestamp)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}
