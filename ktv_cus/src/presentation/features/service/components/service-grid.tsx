"use client";

import { useState } from "react";
import { ChefHat, Wine, Leaf, ListFilter } from "lucide-react";
import ServiceCard from "./service-card";
import { cn } from "@/shared/lib/utils";
import { useServiceCategories, useServices } from "@/presentation/features/service/hook/use-services";
import { Service, ServiceCategory } from "@/infrastructure/dtos/service.dto";

export interface ServiceGridProps {
  initialCategories?: ServiceCategory[];
  initialServices?: Service[];
}

const getFallbackServiceImage = (name: string): string => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes("beer") || lowercaseName.includes("bia") || lowercaseName.includes("heineken") || lowercaseName.includes("corona")) {
    return "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600";
  }
  if (lowercaseName.includes("cocktail") || lowercaseName.includes("mix") || lowercaseName.includes("shot")) {
    return "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=600";
  }
  if (lowercaseName.includes("wine") || lowercaseName.includes("champagne") || lowercaseName.includes("moet")) {
    return "https://images.unsplash.com/photo-1594487523002-f4a9931d4512?q=80&w=600";
  }
  if (lowercaseName.includes("fruit") || lowercaseName.includes("trái cây")) {
    return "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=600";
  }
  if (lowercaseName.includes("chicken") || lowercaseName.includes("cánh gà") || lowercaseName.includes("truffle") || lowercaseName.includes("snack") || lowercaseName.includes("khoai tây")) {
    return "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=600";
  }
  return "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600"; // default platter
};

const getServiceIconType = (
  name: string,
  categoryId: string,
  categories: ServiceCategory[]
): "star" | "recommend" | "snack" | "drink" | "wine" | "meal" => {
  const lowercaseName = name.toLowerCase();
  
  if (lowercaseName.includes("beer") || lowercaseName.includes("bia") || lowercaseName.includes("heineken") || lowercaseName.includes("corona")) {
    return "drink";
  }
  if (lowercaseName.includes("cocktail") || lowercaseName.includes("mix") || lowercaseName.includes("shot") || lowercaseName.includes("gin") || lowercaseName.includes("vodka")) {
    return "drink";
  }
  if (lowercaseName.includes("wine") || lowercaseName.includes("champagne") || lowercaseName.includes("moet") || lowercaseName.includes("chivas")) {
    return "wine";
  }
  if (lowercaseName.includes("fruit") || lowercaseName.includes("trái cây") || lowercaseName.includes("snack") || lowercaseName.includes("khoai tây") || lowercaseName.includes("truffle")) {
    return "snack";
  }
  if (lowercaseName.includes("sushi") || lowercaseName.includes("platter") || lowercaseName.includes("chicken") || lowercaseName.includes("cánh gà") || lowercaseName.includes("mì") || lowercaseName.includes("nướng")) {
    return "meal";
  }

  // Fallback check category name
  const cat = categories.find((c) => c.id === categoryId);
  if (cat) {
    const catName = cat.name.toLowerCase();
    if (catName.includes("cocktail") || catName.includes("drink") || catName.includes("uống") || catName.includes("bia") || catName.includes("rượu")) {
      return "drink";
    }
    if (catName.includes("snack") || catName.includes("nhẹ") || catName.includes("ăn vặt")) {
      return "snack";
    }
    if (catName.includes("platter") || catName.includes("combo") || catName.includes("ăn") || catName.includes("gourmet")) {
      return "meal";
    }
  }

  return "meal"; // default to food/meal instead of star
};

export default function ServiceGrid({
  initialCategories = [],
  initialServices = [],
}: ServiceGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");

  // Fetch from React Query API
  const { data: categories = initialCategories } = useServiceCategories();
  const { data: services = initialServices } = useServices(
    selectedCategory !== "All Items" ? { categoryId: selectedCategory } : undefined
  );

  const categoriesList = [
    { id: "All Items", name: "Tất cả" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  // Client side fallback filter for instant response
  const displayedServices = services.filter((s) => {
    if (selectedCategory === "All Items") return true;
    return s.categoryId === selectedCategory;
  });

  return (
    <section className="px-margin pb-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Filter Panel */}
      <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-6 w-full">
        {/* Categories Selector */}
        <div className="bg-surface-container/60 backdrop-blur-md border border-primary/10 p-6 rounded-xl shadow-md">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
            <ListFilter className="size-5 text-primary" />
            <h3 className="font-heading text-lg font-bold text-on-surface">
              Danh mục
            </h3>
          </div>
          {/* Desktop Categories List */}
          <ul className="hidden lg:block space-y-2">
            {categoriesList.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-lg font-sans text-sm font-bold transition-all duration-300 cursor-pointer",
                    selectedCategory === cat.id
                      ? "bg-primary-container text-on-primary-container shadow-[0_0_15px_rgba(189,0,255,0.45)]"
                      : "text-on-surface-variant hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Categories Swiper */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "snap-start flex-shrink-0 px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap",
                  selectedCategory === cat.id
                    ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(189,0,255,0.45)]"
                    : "bg-surface-variant/30 text-on-surface-variant hover:bg-white/5"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Assurance Badges */}
        <div className="bg-surface-container/60 backdrop-blur-md border border-primary/10 p-6 rounded-xl space-y-4 shadow-md">
          <div className="flex items-center gap-3.5">
            <ChefHat className="text-tertiary size-5" />
            <span className="font-sans text-sm font-bold text-on-surface">
              Đầu bếp chuẩn 5 sao
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <Wine className="text-secondary size-5" />
            <span className="font-sans text-sm font-bold text-on-surface">
              Đồ uống cao cấp
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            <Leaf className="text-primary size-5" />
            <span className="font-sans text-sm font-bold text-on-surface">
              Nguyên liệu tươi sạch
            </span>
          </div>
        </div>
      </aside>

      {/* Main Grid Catalog */}
      <div className="lg:col-span-9 w-full">
        {displayedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedServices.map((item) => {
              const imageUrl = (item as any).imageUrl || getFallbackServiceImage(item.name);
              const description = (item as any).description || "Thức uống & món ăn hảo hạng, được pha chế phục vụ trực tiếp tại phòng VIP.";
              const priceVND = `${item.price.toLocaleString("vi-VN")} VND`;

              return (
                <ServiceCard
                  key={item.id}
                  title={item.name}
                  description={description}
                  price={priceVND}
                  imageUrl={imageUrl}
                  tag={item.stockQuantity === 0 ? "Hết hàng" : undefined}
                  iconType={getServiceIconType(item.name, item.categoryId, categories)}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-surface-container/40 border border-primary/10 rounded-xl p-12 text-center">
            <p className="text-on-surface-variant font-medium">
              Không có sản phẩm nào trong danh mục này.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
