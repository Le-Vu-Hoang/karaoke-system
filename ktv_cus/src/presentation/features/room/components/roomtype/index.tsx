"use client";

import { Home as HomeIcon, DoorOpen, GlassWater, Calendar } from "lucide-react";
import Header from "@/presentation/shared_ui/header";
import Footer from "@/presentation/shared_ui/footer";
import RoomHero from "./room-hero";
import RoomCategories from "./room-categories";
import MenuHighlights from "./menu-highlights";
import RoomServices from "./room-services";

export default function RoomsFeature() {
  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleBookRoom = (roomType: string) => {
    console.log(`Booking room: ${roomType}`);
  };

  const handleDetailsRoom = (roomType: string) => {
    console.log(`Viewing room details: ${roomType}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans pb-16 md:pb-0">
      {/* Navigation Header */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-1 flex flex-col">
        {/* Banner Hero Section */}
        <RoomHero
          onExploreRoomsClick={() => handleScrollToSection("rooms-section")}
          onViewMenuClick={() => handleScrollToSection("menu-section")}
        />

        {/* Room Categories */}
        <RoomCategories
          onBookRoom={handleBookRoom}
          onDetailsRoom={handleDetailsRoom}
        />

        {/* Food & Beverages Catalog */}
        <MenuHighlights onItemClick={(cat) => console.log(`Menu category: ${cat}`)} />

        {/* Service Highlights / Immersive Features */}
        <RoomServices />
      </main>

      {/* Brand Footer */}
      <Footer />

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest/90 backdrop-blur-lg border-t border-outline-variant/10 py-3 px-6 flex justify-around items-center z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <HomeIcon className="size-5" />
          <span className="text-[10px] font-bold">Trang Chủ</span>
        </button>
        <button
          onClick={() => handleScrollToSection("rooms-section")}
          className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <DoorOpen className="size-5" />
          <span className="text-[10px] font-bold">Phòng Hát</span>
        </button>
        <button
          onClick={() => handleScrollToSection("menu-section")}
          className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <GlassWater className="size-5" />
          <span className="text-[10px] font-bold">Thực Đơn</span>
        </button>
        <button
          onClick={() => console.log("Booking flow triggered")}
          className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <Calendar className="size-5" />
          <span className="text-[10px] font-bold">Đặt Phòng</span>
        </button>
      </div>
    </div>
  );
}
