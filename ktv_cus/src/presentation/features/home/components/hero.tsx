"use client";

import { useState } from "react";
import { MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { Button } from "@/presentation/shared_ui/button";
import { Input } from "@/presentation/shared_ui/input";

export default function Hero() {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { location, date, partySize });
  };

  const scrollToVenues = () => {
    document.getElementById("venues")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full min-h-[550px] md:h-[800px] flex items-center justify-center overflow-hidden py-16 md:py-0">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCu47rxBrBW2864FIlc2XW26CG-hlMfTf_HWwcIc8LwN-DuQw2YO22xO3ySLDCA7bpqc0YbI4s_ZpCSwUHnYv4nsY81ewGKYaR2ij2Sd7WO6u8nkXxt5swSJWVOj4J0TM7aa9yRBpn9g0FhMOe-2r_IE0xK9Xf-HDZv-te-8COj2wui0jNuWRAL3LxFfgHmlOWdiZRBip0h-xw2D1v5oLfiTM8AL7ucLta3JCBxPIWQWyxKclyfx1pEiNVw8uAQ8LhUtu_IAo8yik-z')`,
          }}
        />
        {/* Gradients to blend into background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-5xl px-margin text-center flex flex-col items-center">
        {/* Subheader Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-md animate-bounce">
          <Sparkles className="size-4 text-secondary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Premium KTV Booking
          </span>
        </div>

        <h1 className="font-heading text-4xl md:text-headline-xl mb-md font-extrabold tracking-tight leading-tight md:leading-none text-white drop-shadow-lg">
          Your Stage{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
            Awaits Tonight.
          </span>
        </h1>

        <p className="font-sans text-base md:text-body-lg text-on-surface-variant mb-lg max-w-2xl mx-auto leading-relaxed">
          Discover and instant-book the city&apos;s most exclusive luxury karaoke suites
          with zero extra fees.
        </p>

        {/* Desktop Search Bar (Glassmorphic) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex glass-card p-base rounded-full items-center gap-xs shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] max-w-4xl w-full border-outline-variant/30 backdrop-blur-md"
        >
          <div className="flex-1 flex items-center px-md gap-sm border-r border-outline-variant/20 py-2">
            <MapPin className="text-tertiary size-5 shrink-0" />
            <Input
              type="text"
              placeholder="Where are you singing?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-0 h-10 text-on-surface w-full font-label-md placeholder:text-on-surface-variant/50 focus-visible:ring-0 focus-visible:ring-offset-0 border-transparent shadow-none"
            />
          </div>

          <div className="flex-1 flex items-center px-md gap-sm border-r border-outline-variant/20 py-2">
            <Calendar className="text-tertiary size-5 shrink-0" />
            <Input
              type="text"
              placeholder="Select Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-0 h-10 text-on-surface w-full font-label-md placeholder:text-on-surface-variant/50 focus-visible:ring-0 focus-visible:ring-offset-0 border-transparent shadow-none"
            />
          </div>

          <div className="flex-1 flex items-center px-md gap-sm py-2">
            <Users className="text-tertiary size-5 shrink-0" />
            <Input
              type="text"
              placeholder="Party Size"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              className="bg-transparent border-0 h-10 text-on-surface w-full font-label-md placeholder:text-on-surface-variant/50 focus-visible:ring-0 focus-visible:ring-offset-0 border-transparent shadow-none"
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-label-md text-label-md font-bold shadow-[0_0_20px_rgba(189,0,255,0.4)] hover:scale-105 transition-transform active:scale-95 duration-200 border-none h-11 shrink-0"
          >
            SEARCH
          </Button>
        </form>

        {/* Mobile CTA Button (instead of search trigger/dialog) */}
        <div className="flex md:hidden w-full justify-center mt-2">
          <Button
            onClick={scrollToVenues}
            type="button"
            className="w-full max-w-xs bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-full font-bold shadow-[0_0_20px_rgba(189,0,255,0.4)] hover:scale-105 transition-transform active:scale-95 duration-200 border-none h-12"
          >
            Explore Lounges
          </Button>
        </div>
      </div>
    </section>
  );
}
