"use client";

import { Ticket, Beer, Cake, Cookie } from "lucide-react";

interface Voucher {
  id: string;
  title: string;
  subtitle: string;
  expiry: string;
  type: "discount" | "gift" | "birthday" | "used";
  tag: string;
}

const mockVouchers: Voucher[] = [
  {
    id: "v-1",
    title: "Giảm 50% tiền giờ",
    subtitle: "Happy Hour Discount",
    expiry: "Hết hạn: 30 Th10, 2026",
    type: "discount",
    tag: "50% OFF",
  },
  {
    id: "v-2",
    title: "Tặng 01 Tháp Bia",
    subtitle: "Áp dụng cho phòng VIP",
    expiry: "Hết hạn: 15 Th11, 2026",
    type: "gift",
    tag: "FREE",
  },
  {
    id: "v-3",
    title: "Quà Tặng Sinh Nhật",
    subtitle: "Đặc quyền Diamond VIP",
    expiry: "Hết hạn: 31 Th12, 2026",
    type: "birthday",
    tag: "BIRTHDAY",
  },
  {
    id: "v-4",
    title: "Combo Snack Miễn Phí",
    subtitle: "Quà tặng chào mừng thành viên",
    expiry: "Đã sử dụng",
    type: "used",
    tag: "USED",
  },
];

export default function VoucherList() {
  const getIcon = (type: Voucher["type"]) => {
    switch (type) {
      case "discount":
        return <Ticket className="size-6 text-secondary" />;
      case "gift":
        return <Beer className="size-6 text-tertiary" />;
      case "birthday":
        return <Cake className="size-6 text-primary" />;
      default:
        return <Cookie className="size-6 text-outline" />;
    }
  };

  const getStyle = (type: Voucher["type"]) => {
    switch (type) {
      case "discount":
        return {
          borderClass: "border-l-4 border-l-secondary",
          bgClass: "bg-secondary/10",
          btnClass: "bg-secondary hover:bg-secondary/90 text-secondary-foreground/70",
        };
      case "gift":
        return {
          borderClass: "border-l-4 border-l-tertiary",
          bgClass: "bg-tertiary/10",
          btnClass: "bg-tertiary/80 hover:bg-tertiary/50 text-tertiary-foreground/70",
        };
      case "birthday":
        return {
          borderClass: "border-l-4 border-l-primary",
          bgClass: "bg-primary/10",
          btnClass: "bg-primary hover:bg-primary/90 text-primary-foreground/70",
        };
      default:
        return {
          borderClass: "border-l-4 border-l-outline-variant opacity-60",
          bgClass: "bg-surface-variant/20",
          btnClass: "bg-surface-variant text-on-surface-variant cursor-not-allowed",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h3 className="font-heading text-lg md:text-headline-md text-secondary flex items-center gap-3 font-bold">
          <Ticket className="size-6 text-secondary" /> Voucher của tôi
        </h3>
        <button 
          type="button"
          onClick={() => console.log("View all vouchers")}
          className="text-primary text-xs md:text-sm font-semibold hover:underline cursor-pointer"
        >
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockVouchers.map((voucher) => {
          const styles = getStyle(voucher.type);
          const isUsed = voucher.type === "used";

          return (
            <div
              key={voucher.id}
              className={`bg-surface-container/70 border border-outline-variant/10 rounded-2xl p-5 flex gap-4 items-center justify-between transition-all duration-300 hover:scale-[1.02] shadow-md backdrop-blur-xl ${styles.borderClass}`}
            >
              <div className="flex gap-4 items-center min-w-0">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${styles.bgClass}`}>
                  {getIcon(voucher.type)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-base md:text-lg leading-tight text-foreground truncate">
                    {voucher.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant mt-1 truncate">
                    {voucher.subtitle}
                  </p>
                  <p className="text-[10px] md:text-xs text-on-surface-variant/80 mt-0.5">
                    {voucher.expiry}
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="button"
                  disabled={isUsed}
                  onClick={() => console.log(`Use voucher ${voucher.id}`)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 active:scale-95 cursor-pointer ${styles.btnClass}`}
                >
                  {isUsed ? "Đã dùng" : "Sử dụng"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
