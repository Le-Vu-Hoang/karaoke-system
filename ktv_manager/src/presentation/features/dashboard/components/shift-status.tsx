import { ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/presentation/shared_ui/button";

export function ShiftStatus() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-primary/30 bg-surface-container-low/80 p-6 shadow-[0_0_25px_rgba(189,0,255,0.1)] backdrop-blur-2xl">
      {/* Background Glows */}
      <div className="absolute right-0 top-0 size-32 rounded-full bg-primary-container/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 size-40 rounded-full bg-secondary/5 blur-3xl"></div>

      {/* Header */}
      <h2 className="relative z-10 mb-6 flex items-center gap-2 border-b border-outline-variant/20 pb-4 text-2xl font-bold text-on-surface">
        <ShieldAlert className="size-8 text-primary" /> Trạng thái ca
      </h2>

      <div className="relative z-10 flex flex-grow flex-col space-y-6">
        {/* Active Time */}
        <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-4">
          <p className="mb-1 text-sm text-on-surface-variant">Thời gian</p>
          <p className="flex items-center gap-2 text-xl font-bold text-success">
            <span className="size-2 animate-pulse rounded-full bg-success"></span> Đang hoạt động 4h 12m
          </p>
        </div>

        {/* Cash Drawer */}
        <div className="flex flex-col gap-2 rounded-xl border border-outline-variant/10 bg-surface-container p-4">
          <div>
            <p className="mb-1 text-sm text-on-surface-variant">Tiền mặt trong két</p>
            <p className="text-[28px] font-bold tracking-wide text-tertiary">15,240,000đ</p>
          </div>
          <Button
            variant="outline"
            className="mt-2 w-full gap-2 border-outline-variant/30 bg-surface-variant text-sm text-on-surface hover:bg-surface-bright"
          >
            <RefreshCw className="size-4" /> +/- Giao dịch két
          </Button>
        </div>

        {/* Online Pay */}
        <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-4">
          <p className="mb-1 text-sm text-on-surface-variant">Thanh toán Online</p>
          <p className="text-xl font-bold tracking-wide text-on-surface">4,500,000đ</p>
        </div>
      </div>

      {/* End Shift Button */}
      <div className="relative z-10 mt-auto pt-6">
        <Button className="w-full bg-gradient-to-r from-primary-container to-inverse-primary py-6 text-xl font-bold tracking-wider text-on-primary-container shadow-[0_0_20px_rgba(189,0,255,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(189,0,255,0.6)] active:scale-95">
          KẾT THÚC CA
        </Button>
      </div>
    </div>
  );
}
