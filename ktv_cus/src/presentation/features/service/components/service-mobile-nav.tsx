"use client";

import { Home as HomeIcon, DoorOpen, GlassWater, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ServiceMobileNav() {
  const router = useRouter();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest/90 backdrop-blur-lg border-t border-outline-variant/10 py-3 px-6 flex justify-around items-center z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.4)]">
      <button
        onClick={() => router.push("/")}
        className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
      >
        <HomeIcon className="size-5" />
        <span className="text-[10px] font-bold">Home</span>
      </button>
      <button
        onClick={() => router.push("/rooms")}
        className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
      >
        <DoorOpen className="size-5" />
        <span className="text-[10px] font-bold">Rooms</span>
      </button>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="flex flex-col items-center gap-1 text-primary transition-colors cursor-pointer"
      >
        <GlassWater className="size-5" />
        <span className="text-[10px] font-bold">Services</span>
      </button>
      <button
        onClick={() => router.push("/booking")}
        className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
      >
        <Calendar className="size-5" />
        <span className="text-[10px] font-bold">Booking</span>
      </button>
    </div>
  );
}
