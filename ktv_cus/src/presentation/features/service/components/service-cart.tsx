"use client";

import { useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/shared/stores/use-cart-store";
import { useStore } from "@/shared/stores/use-store";
import { Button } from "@/presentation/shared_ui/button";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { toast } from "@/presentation/shared_ui/sonner";

export default function ServiceCart() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Sử dụng hook useStore để tránh lỗi Hydration của Next.js (SSR)
  const cartItems = useStore(useCartStore, (state) => state.items) || [];
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Tính tổng tiền từ hàm trong store hoặc trực tiếp
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const totalPrice = useStore(useCartStore, () => getTotalPrice()) || 0;

  // Định dạng hiển thị tiền tệ VND
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-8 right-6 z-50 flex items-center justify-center size-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(189,0,255,0.6)] cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        <ShoppingCart className="size-6 transition-transform group-hover:rotate-12" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-tertiary text-on-tertiary text-xs font-bold size-6 rounded-full flex items-center justify-center border-2 border-background animate-pulse">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart Drawer Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      >
        {/* Drawer Content */}
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-full sm:w-[450px] bg-surface-container/95 border-l border-primary/10 shadow-2xl backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-primary size-5" />
              <h3 className="font-heading text-lg font-bold text-on-surface">
                Giỏ hàng dịch vụ
              </h3>
              <span className="bg-primary/20 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold">
                {totalItems} món
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-foreground cursor-pointer p-1 rounded-full hover:bg-white/5"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingCart className="size-16 text-outline-variant stroke-[1.5]" />
                <div>
                  <p className="text-on-surface font-bold text-base">
                    Giỏ hàng của bạn đang trống
                  </p>
                  <p className="text-on-surface-variant text-sm mt-1">
                    Hãy thêm một vài thức uống & món ăn tuyệt hảo vào giỏ nhé!
                  </p>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="mt-2 cursor-pointer bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary-fixed border border-primary/30"
                >
                  Tiếp tục chọn món
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-surface-container-low/55 border border-white/5 rounded-xl hover:border-primary/20 transition-all duration-300"
                >
                  <div className="relative size-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-outline-variant">
                        <ShoppingBag className="size-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-heading text-sm font-bold text-on-surface line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-on-surface-variant hover:text-error cursor-pointer p-0.5 rounded transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <span className="text-primary font-bold text-sm">
                        {item.price}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden bg-surface-container-high/40">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-white/5 text-on-surface-variant hover:text-foreground cursor-pointer"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-3 font-sans text-xs font-bold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addItem(item)}
                          className="px-2 py-1 hover:bg-white/5 text-on-surface-variant hover:text-foreground cursor-pointer"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-surface-container-high/40 border-t border-white/5 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Tạm tính</span>
                  <span>{formatVND(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Phí dịch vụ</span>
                  <span className="text-secondary font-medium">Miễn phí</span>
                </div>
                <div className="flex justify-between items-end pt-2 border-t border-white/5">
                  <span className="font-sans font-bold text-on-surface">Tổng cộng</span>
                  <span className="font-heading text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    {formatVND(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={clearCart}
                  variant="outline"
                  className="w-full border-error/20 hover:bg-error/10 text-error hover:text-error-fixed cursor-pointer"
                >
                  Xóa giỏ hàng
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Đặt hàng thành công!", {
                      description: "Đơn hàng của bạn đã được hệ thống ghi nhận."
                    });
                    clearCart();
                    setIsOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white cursor-pointer hover:shadow-[0_0_15px_rgba(189,0,255,0.4)]"
                >
                  Đặt món ngay
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
