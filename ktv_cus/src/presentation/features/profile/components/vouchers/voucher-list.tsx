"use client";

import { Plus } from "lucide-react";
import VoucherCard, { Voucher } from "./voucher-card";

interface VoucherListProps {
  vouchers: Voucher[];
  onUse: (code: string) => void;
}

export default function VoucherList({ vouchers, onUse }: VoucherListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {vouchers.map((voucher) => (
        <VoucherCard 
          key={voucher.id} 
          voucher={voucher} 
          onUse={onUse} 
        />
      ))}

      {/* Promotional Hunt Card (Empty state placeholder or hunt button) */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-8 text-center bg-surface-container/30 group cursor-pointer hover:border-primary/50 transition-all min-h-[200px]">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Plus className="size-8 text-on-surface-variant group-hover:text-primary transition-colors" />
        </div>
        <p className="text-on-surface-variant font-bold text-sm tracking-wide group-hover:text-white transition-colors">
          Săn thêm voucher ưu đãi
        </p>
      </div>
    </div>
  );
}
