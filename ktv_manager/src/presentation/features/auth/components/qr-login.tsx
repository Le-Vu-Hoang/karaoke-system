"use client";

import React, { useState, useEffect } from "react";
import { env } from "@/env";
import { io } from "socket.io-client";
import { logger } from "@/shared/lib/logger";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/infrastructure/api/http-client";

export default function QrLogin() {
  const router = useRouter();
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "scanned" | "error" | "success">(
    "loading",
  );

  useEffect(() => {
    let socketUrl = "http://localhost:3001";

    try {
      if (env.NEXT_PUBLIC_BACKEND_URL) {
        socketUrl = new URL(env.NEXT_PUBLIC_BACKEND_URL).origin;
      }
    } catch (e) {
      logger.error("Socket error: ", e);
    }

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      logger.success("Connected to QR Socket");
      socket.emit("request-qr");
    });

    socket.on("qr-generated", (data: { sessionId: string }) => {
      setQrValue(`KTV-LOGIN:${data.sessionId}`);
      setStatus("ready");
    });

    socket.on("qr-scanned-success", async (data: { authCode: string }) => {
      setStatus("scanned");

      try {
        await apiClient.post("/auth/qr/exchange", { authCode: data.authCode });

        setStatus("success");
        setTimeout(() => {
          router.push("/");
        }, 500);
      } catch (err) {
        console.error("Exchange error:", err);
        setStatus("error");
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from QR Socket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="bg-surface-container-low/50 border-outline-variant/20 flex flex-col items-center justify-center rounded-2xl border p-6">
      <h3 className="text-foreground mb-4 text-base font-semibold">Đăng nhập nhanh bằng mã QR</h3>

      <div className="relative flex h-48 w-48 items-center justify-center rounded-2xl bg-white p-3 shadow-sm">
        {status === "loading" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/90">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-3 border-t-transparent"></div>
            <span className="text-primary text-xs font-medium">Đang tạo mã...</span>
          </div>
        )}

        {status === "scanned" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-white/95">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
            <span className="text-sm font-semibold text-emerald-600">Đang đăng nhập...</span>
          </div>
        )}

        {status === "success" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-emerald-50/95">
            <svg
              className="h-12 w-12 text-emerald-500 drop-shadow-sm"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-sm font-bold text-emerald-600">Thành công!</span>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-red-50/95 p-2 text-center">
            <svg
              className="h-10 w-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <span className="text-xs leading-tight font-medium text-red-600">
              Mã đã hết hạn.
              <br />
              Vui lòng tải lại trang.
            </span>
          </div>
        )}

        {qrValue && (
          <QRCodeSVG
            value={qrValue}
            size={168}
            bgColor="#ffffff"
            fgColor="#000000"
            level="M"
            marginSize={0}
          />
        )}
      </div>

      <p className="text-on-surface-variant mt-5 max-w-[220px] text-center text-sm leading-relaxed">
        Mở app nhân viên trên điện thoại và chọn{" "}
        <strong className="text-foreground">Quét QR Đăng nhập</strong>
      </p>
    </div>
  );
}
