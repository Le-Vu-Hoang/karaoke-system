"use client";

import { Mic, Globe, Share2, Mail, Apple, Play } from "lucide-react";

export default function Footer() {
  const companyLinks = [
    { label: "Venue Partners", href: "#" },
    { label: "Contact Support", href: "#" },
    { label: "Careers", href: "#" },
    { label: "About Us", href: "#" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
  ];

  return (
    <footer className="w-full py-lg mt-xl bg-surface-container-lowest border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin max-w-7xl mx-auto py-8">
        {/* Column 1: Brand & Socials */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-xs">
            <Mic className="text-primary size-6 animate-pulse" />
            <span className="font-heading text-xl font-extrabold text-primary">
              LUNA KARAOKE
            </span>
          </div>
          <p className="text-on-surface-variant text-body-md">
            The premium platform for the ultimate singing experience. Discover, book, and perform.
          </p>
          <div className="flex gap-md">
            <a
              href="#"
              aria-label="Website"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-tertiary hover:text-primary hover:scale-110 hover:shadow-[0_0_12px_rgba(189,0,255,0.3)] transition-all border border-outline-variant/20"
            >
              <Globe className="size-5" />
            </a>
            <a
              href="#"
              aria-label="Share"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-tertiary hover:text-primary hover:scale-110 hover:shadow-[0_0_12px_rgba(189,0,255,0.3)] transition-all border border-outline-variant/20"
            >
              <Share2 className="size-5" />
            </a>
            <a
              href="#"
              aria-label="Contact"
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-tertiary hover:text-primary hover:scale-110 hover:shadow-[0_0_12px_rgba(189,0,255,0.3)] transition-all border border-outline-variant/20"
            >
              <Mail className="size-5" />
            </a>
          </div>
        </div>

        {/* Column 2: Company */}
        <div>
          <h5 className="text-on-surface font-label-md mb-md uppercase tracking-wider">
            Company
          </h5>
          <ul className="space-y-sm">
            {companyLinks.map((link) => (
              <li key={link.label}>
                <a
                  className="text-on-surface-variant hover:text-primary transition-all font-label-sm"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h5 className="text-on-surface font-label-md mb-md uppercase tracking-wider">
            Legal
          </h5>
          <ul className="space-y-sm">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a
                  className="text-on-surface-variant hover:text-primary transition-all font-label-sm"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Get the App */}
        <div>
          <h5 className="text-on-surface font-label-md mb-md uppercase tracking-wider">
            Get the App
          </h5>
          <div className="flex flex-col sm:flex-row md:flex-col gap-md">
            {/* App Store Card */}
            <div className="glass-card flex items-center gap-sm p-sm rounded-xl cursor-pointer hover:bg-surface-variant/40 hover:border-primary/40 hover:shadow-[0_4px_15px_rgba(189,0,255,0.1)] transition-all border border-outline-variant/30 flex-1">
              <Apple className="size-6 text-primary" />
              <div>
                <p className="text-[10px] leading-tight text-on-surface-variant font-medium">
                  DOWNLOAD ON THE
                </p>
                <p className="text-label-md font-bold leading-tight text-foreground">
                  App Store
                </p>
              </div>
            </div>

            {/* Google Play Card */}
            <div className="glass-card flex items-center gap-sm p-sm rounded-xl cursor-pointer hover:bg-surface-variant/40 hover:border-secondary/40 hover:shadow-[0_4px_15px_rgba(255,75,137,0.1)] transition-all border border-outline-variant/30 flex-1">
              <Play className="size-6 text-secondary fill-secondary" />
              <div>
                <p className="text-[10px] leading-tight text-on-surface-variant font-medium">
                  GET IT ON
                </p>
                <p className="text-label-md font-bold leading-tight text-foreground">
                  Google Play
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-margin mt-lg pt-lg border-t border-outline-variant/10 text-center">
        <p className="text-tertiary font-label-sm font-semibold tracking-wider">
          © 2026 LUNA KARAOKE. SING YOUR HEART OUT.
        </p>
      </div>
    </footer>
  );
}
