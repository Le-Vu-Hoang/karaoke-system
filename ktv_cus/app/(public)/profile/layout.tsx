import Header from "@/presentation/shared_ui/header";
import Footer from "@/presentation/shared_ui/footer";
import ProfileSidebar from "@/presentation/features/profile/components/profile-sidebar";
import React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Header />

      <div className="flex-grow w-full flex relative">
        <ProfileSidebar />

        <div className="flex-1 w-full lg:pl-64 flex flex-col min-h-[calc(100vh-160px)]">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
