"use client";

import { useState } from "react";
import { Edit, Diamond } from "lucide-react";
import { UserDto } from "@/infrastructure/dtos/auth.dto";
import EditProfileDialog from "./edit-profile-dialog";

interface ProfileHeaderProps {
  user: UserDto | null | undefined;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const name = user?.fullName || "Nguyễn Văn A";
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <section className="relative mb-12">
      {/* Cover Banner Photo */}
      <div className="h-40 md:h-64 w-full rounded-3xl overflow-hidden relative border border-outline-variant/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 mix-blend-overlay z-10" />
        <img
          className="w-full h-full object-cover"
          alt="Luxury Karaoke Room Cover"
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Avatar & Name Info Area */}
      <div className="absolute -bottom-10 left-6 md:left-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 z-20 w-[calc(100%-48px)] sm:w-auto">
        <div className="relative animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border-4 border-background bg-surface-container overflow-hidden shadow-[0_0_15px_rgba(236,178,255,0.4)]">
            <img
              className="w-full h-full object-cover"
              alt={name}
              src={user?.imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"}
            />
          </div>
          <button 
            type="button"
            onClick={() => setIsEditDialogOpen(true)}
            className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full shadow-lg active:scale-95 transition-transform hover:brightness-110 cursor-pointer"
          >
            <Edit className="size-4" />
          </button>
        </div>

        <div className="mb-2 md:mb-1">
          <h2 className="font-heading text-2xl md:text-headline-lg text-primary tracking-tight font-extrabold drop-shadow-[0_0_8px_rgba(236,178,255,0.3)]">
            {name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Diamond className="text-secondary size-4 fill-secondary" />
            <span className="font-sans text-xs md:text-sm font-bold text-secondary uppercase tracking-widest">Member
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Desktop Only) */}
      <div className="hidden md:flex absolute bottom-4 right-8 gap-4 z-20">
        <button
          type="button"
          onClick={() => setIsEditDialogOpen(true)}
          className="px-6 py-2.5 rounded-full border border-primary/50 text-primary font-bold hover:bg-primary/10 transition-colors active:scale-95 cursor-pointer text-sm"
        >
          Chỉnh sửa hồ sơ
        </button>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
    </section>
  );
}
