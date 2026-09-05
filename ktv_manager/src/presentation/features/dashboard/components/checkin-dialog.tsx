"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DoorOpen, Loader2, CalendarCheck, FileText } from "lucide-react";
import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/shared_ui/dialog";
import { Button } from "@/presentation/shared_ui/button";
import { Input } from "@/presentation/shared_ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/shared_ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/presentation/shared_ui/form";
import { cn } from "@/shared/lib/utils";

export const checkInSchema = z.object({
  roomId: z.string().min(1, "Vui lòng chọn phòng để cấp cho khách"),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  durationHours: z.coerce.number().min(1, "Thời gian hát tối thiểu 1 giờ").optional(),
});

export type CheckInFormValues = z.infer<typeof checkInSchema>;

export interface AvailableRoom {
  id: string;
  roomNumber: string;
  roomType: string;
}

export interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "booking" | "walk-in";
  availableRooms: AvailableRoom[];
  preselectedRoomId?: string;
  bookingData?: {
    id: string;
    customerName: string;
    phone?: string;
    depositAmount: number;
    roomTypeName: string;
    partySize?: number;
  };
  onSubmit: (data: CheckInFormValues) => void;
  isSubmitting: boolean;
}

export function CheckInDialog({
  isOpen,
  onClose,
  mode,
  availableRooms,
  preselectedRoomId,
  bookingData,
  onSubmit,
  isSubmitting,
}: CheckInDialogProps) {
  const form = useForm<CheckInFormValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      roomId: preselectedRoomId || "",
      guestName: (mode === "booking" ? bookingData?.customerName : "") || "",
      guestPhone: (mode === "booking" ? bookingData?.phone : "") || "",
      durationHours: mode === "walk-in" ? 2 : ("" as any),
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        roomId: preselectedRoomId || "",
        guestName: (mode === "booking" ? bookingData?.customerName : "") || "",
        guestPhone: (mode === "booking" ? bookingData?.phone : "") || "",
        durationHours: mode === "walk-in" ? 2 : ("" as any),
      });
    }
  }, [isOpen, mode, preselectedRoomId, bookingData, form]);

  const handleSubmit = (data: CheckInFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="glass border-outline-variant/30 w-[90vw] max-w-lg min-w-[320px] shadow-[0_0_50px_rgba(189,0,255,0.1)] focus:outline-none sm:w-full sm:min-w-[450px]"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center gap-2 text-2xl font-bold whitespace-nowrap">
            {mode === "booking" ? (
              <CalendarCheck className="text-primary size-6 shrink-0" />
            ) : (
              <DoorOpen className="text-primary size-6 shrink-0" />
            )}
            {mode === "booking" ? "Xác nhận nhận phòng" : "Mở phòng hát nhanh"}
          </DialogTitle>
          <DialogDescription className="text-on-surface-variant">
            {mode === "booking"
              ? "Hoàn tất thủ tục và giao phòng trực tiếp cho khách đã đặt."
              : "Khởi tạo biên lai hát ngay lập tức cho khách vãng lai."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6 pt-4">
            {mode === "booking" && bookingData && (
              <div className="border-secondary/20 bg-secondary/5 mb-2 rounded-xl border p-4">
                <h4 className="text-secondary mb-2 text-sm font-bold">Thông tin lịch đặt:</h4>
                <ul className="text-on-surface space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-on-surface-variant">Khách hàng:</span>
                    <span className="font-semibold">{bookingData.customerName}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-on-surface-variant">Loại phòng yêu cầu:</span>
                    <span className="font-semibold">{bookingData.roomTypeName}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-on-surface-variant">Đã đặt cọc:</span>
                    <span className="text-tertiary font-semibold">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(bookingData.depositAmount)}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {mode === "walk-in" && (
              <>
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem className={`flex flex-col gap-1`}>
                      <FormLabel className="text-on-surface">Tên khách hàng (Tùy chọn)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: Anh Tuấn, Khách Lẻ..."
                          className="border-outline-variant/30 bg-surface-container text-on-surface focus-visible:ring-primary w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guestPhone"
                  render={({ field }) => (
                    <FormItem className={`flex flex-col gap-1`}>
                      <FormLabel className="text-on-surface">Số điện thoại (Tùy chọn)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="VD: 09..."
                          className="border-outline-variant/30 bg-surface-container text-on-surface focus-visible:ring-primary w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationHours"
                  render={({ field }) => (
                    <FormItem className={`flex flex-col gap-1`}>
                      <FormLabel className="text-on-surface">Dự kiến hát (Giờ) <span className="text-error">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={24}
                          className="border-outline-variant/30 bg-surface-container text-on-surface focus-visible:ring-primary w-full"
                          {...field}
                          value={field.value !== undefined ? field.value : ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <FormItem className={`flex flex-col gap-1`}>
                  <FormLabel className="text-on-surface">
                    Cấp phòng thực tế <span className="text-error">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-outline-variant/30 bg-surface-container text-on-surface focus:ring-primary w-full">
                        <SelectValue placeholder="Chọn phòng hát..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-outline-variant/30 bg-surface-container min-w-[300px] max-h-60 overflow-y-auto">
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id} className="text-on-surface">
                          Phòng {room.roomNumber} - {room.roomType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-outline-variant/30 text-on-surface hover:bg-surface-bright hover:text-on-surface"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-container text-on-primary transition-opacity hover:opacity-90"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="mr-2 h-4 w-4" />
                )}
                {mode === "booking" ? "Xác nhận nhận phòng" : "Mở phòng ngay"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
