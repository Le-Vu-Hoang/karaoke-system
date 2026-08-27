"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { useAuthStore } from "@/shared/stores/use-auth-store";

export default function BookingSuccessPage() {
  const { isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
  const amountParam = searchParams.get("vnp_Amount");

  // VNPay amount is multiplied by 100
  const amount = amountParam ? parseInt(amountParam) / 100 : 0;

  const isSuccess = vnp_ResponseCode === "00";

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="w-1/3 bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        {isSuccess ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Thanh toán thành công!
            </h1>
            <p className="text-on-surface-variant mb-6">
              Giao dịch của bạn đã được xác nhận. Cảm ơn bạn đã sử dụng dịch vụ.
            </p>

            <div className="w-full bg-surface rounded-xl p-4 mb-8 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Mã giao dịch:</span>
                <span className="text-white font-medium">{vnp_TransactionNo || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Số tiền:</span>
                <span className="text-primary font-bold">
                  {amount.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Thanh toán thất bại
            </h1>
            <p className="text-on-surface-variant mb-8">
              Rất tiếc, giao dịch của bạn không thể hoàn tất (Mã lỗi: {vnp_ResponseCode}). Vui lòng thử lại.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {isAuthenticated && (
            <Link
              href="/profile/history"
              className="w-full block bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Xem lịch sử đặt phòng
            </Link>
          )}
          <Link
            href="/"
            className="w-full block bg-transparent hover:bg-white/5 text-white font-semibold py-3 px-4 rounded-xl transition-colors border border-white/10"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
