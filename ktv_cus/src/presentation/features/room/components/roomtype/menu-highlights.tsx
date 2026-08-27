"use client";

import MenuCard from "./menu-card";

export interface MenuHighlightsProps {
  onItemClick?: (category: string) => void;
}

export default function MenuHighlights({ onItemClick }: MenuHighlightsProps) {
  const menuItems = [
    {
      title: "Signature Cocktails",
      subtitle: "Neon-infused mixology",
      imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=2000",
      icon: "cocktail" as const,
    },
    {
      title: "Premium Buckets",
      subtitle: "Beers & Fine Spirits",
      imageUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2000",
      icon: "beer" as const,
    },
    {
      title: "Gourmet Platters",
      subtitle: "Shareable Feast",
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000",
      icon: "food" as const,
    },
  ];

  return (
    <section id="menu-section" className="py-16 md:py-24 bg-surface-container-lowest/30 border-y border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-margin">
        {/* Header Info */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-heading text-3xl md:text-headline-lg font-extrabold text-foreground mb-4 tracking-tight">
            Ẩm Thực & Đồ Uống
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mb-4 rounded-full" />
          <p className="text-on-surface-variant max-w-[576px] mx-auto text-sm md:text-base leading-relaxed font-medium">
            Tiếp thêm năng lượng cho giọng hát của bạn với thực đơn đồ uống pha chế độc đáo và các món ăn nhẹ hấp dẫn phục vụ trực tiếp tại phòng.
          </p>
        </div>

        {/* Desktop View: Grid of Banners */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {menuItems.map((item) => (
            <MenuCard
              key={item.title}
              title={item.title}
              subtitle={item.subtitle}
              imageUrl={item.imageUrl}
              layout="banner"
              onClick={() => onItemClick?.(item.title)}
            />
          ))}
        </div>

        {/* Mobile View: Horizontal Scroll of Compact Cards */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory px-2">
          {menuItems.map((item) => (
            <div key={item.title} className="snap-start">
              <MenuCard
                title={item.title === "Signature Cocktails" ? "Cocktails" : item.title === "Premium Buckets" ? "Ice Cold Beer" : "Midnight Snacks"}
                subtitle={item.subtitle}
                imageUrl={item.imageUrl}
                icon={item.icon}
                layout="card"
                onClick={() => onItemClick?.(item.title)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
