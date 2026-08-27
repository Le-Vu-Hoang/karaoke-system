"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/presentation/shared_ui/sonner";
import { useRoomTypes } from "@/presentation/features/booking/hooks/use-roomType";
import { useCreateBooking } from "@/presentation/features/booking/hooks/use-booking";
import { useRoomAvailability } from "@/presentation/features/booking/hooks/use-roomAvailability";
import { useAuthStore } from "@/shared/stores/use-auth-store";
import { CreateBookingDto } from "@/infrastructure/dtos/booking.dto";

// Subcomponents
import { RoomType, AppliedPromo } from "./types";
import RoomTypeStep from "./room-type-step";
import TimeStep from "./time-step";
import PaymentStep from "./payment-step";
import { BillingSidebar, MobileNavigationFooter } from "./billing-sidebar";
import BookingModals from "./booking-modals";

//< Helper function ==============================================================================
const valToTime = (val: number): string => {
    const totalHalfHours = 18 + val;
    const hour = Math.floor(totalHalfHours / 2) % 24;
    const minute = (totalHalfHours % 2) === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
};

const combineDateAndTime = (date: Date, timeStr: string): string => {
    const d = new Date(date);
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (hours < 9) {
        d.setDate(d.getDate() + 1);
    }
    d.setHours(hours, minutes, 0, 0);
    return d.toISOString();
};
//< ===============================================================================================


export default function BookingFlow() {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();

    // Query room types from API
    const { data: roomTypes, isLoading: roomTypesLoading, isError: roomTypesError } = useRoomTypes();

    // Steps state
    const [currentStep, setCurrentStep] = useState<number>(1); //? 1: Choose Room Type, 2: Select Date & Time, 3: Checkout

    // Selected items state
    const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
    });
    const [startSliderValue, setStartSliderValue] = useState<number>(0); //? Default to 20:00  (step 22)
    const [endSliderValue, setEndSliderValue] = useState<number>(2); //? Default to 22:30 (step 27, 2.5 hours)
    const [promoCode, setPromoCode] = useState<string>("");
    const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);
    const [notes, setNotes] = useState<string>("");
    const [paymentProvider, setPaymentProvider] = useState<string>("STRIPE");
    const [guestName, setGuestName] = useState<string>("");
    const [guestPhone, setGuestPhone] = useState<string>("");
    const [guestCount, setGuestCount] = useState<number | "">("");

    // Availability
    const { bookedSlots } = useRoomAvailability(selectedDate, selectedRoomTypeId);

    // Derived Time Values
    const minSliderValue = useMemo(() => {
        const today = new Date();
        if (selectedDate.getDate() === today.getDate() && selectedDate.getMonth() === today.getMonth() && selectedDate.getFullYear() === today.getFullYear()) {
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();
            const totalHalfHours = currentHour * 2 + (currentMinute >= 30 ? 1 : 0);
            return Math.max(0, totalHalfHours - 18); // 18 is 09:00 AM (0 index)
        }
        return 0;
    }, [selectedDate]);

    // Ensure startSliderValue is at least minSliderValue
    useEffect(() => {
        if (startSliderValue < minSliderValue) {
            setStartSliderValue(minSliderValue);
            if (endSliderValue <= minSliderValue) {
                setEndSliderValue(minSliderValue + 2);
            }
        }
    }, [minSliderValue, startSliderValue, endSliderValue]);

    const isOverlapping = useMemo(() => {
        if (!bookedSlots || bookedSlots.length === 0) return false;
        return bookedSlots.some(slot => 
            startSliderValue < slot.end && endSliderValue > slot.start
        );
    }, [startSliderValue, endSliderValue, bookedSlots]);

    const startTime = useMemo(() => valToTime(startSliderValue), [startSliderValue]);
    const endTime = useMemo(() => valToTime(endSliderValue), [endSliderValue]);
    const duration = useMemo(() => (endSliderValue - startSliderValue) / 2, [startSliderValue, endSliderValue]);

    const holdPeriodLabel = useMemo(() => {
        const [hours, minutes] = startTime.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes + 15;
        const endH = Math.floor(totalMinutes / 60) % 24;
        const endM = totalMinutes % 60;
        const endTimeStr = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
        return `${startTime} - ${endTimeStr}`;
    }, [startTime]);

    // Modal state
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [bookingResult, setBookingResult] = useState<any>(null);
    const { mutate: createBooking, isPending: isSubmitting } = useCreateBooking();

    // Sync roomTypes selection
    useEffect(() => {
        if (roomTypes && roomTypes.length > 0 && !selectedRoomTypeId) {
            setSelectedRoomTypeId(roomTypes[0].id);
        }
    }, [roomTypes, selectedRoomTypeId]);

    // Derived Room Type List
    const roomTypesList: RoomType[] = useMemo(() => {
        if (!roomTypes) return [];
        return roomTypes.map((rt) => ({
            id: rt.id,
            name: rt.name,
            capacity: rt.capacity,
            pricePerHour: rt.basePricePerHour,
            description: rt.description || "Trải nghiệm phòng hát chất lượng cao cùng dàn âm thanh cực đỉnh.",
            imageUrl: rt.imageUrl || "/image/Luxury-room.png",
            features: rt.name.toLowerCase().includes("vip")
                ? ["Màn hình lớn", "Sofa da cao cấp", "Hệ thống đèn LED", "Chọn bài trên iPad"]
                : ["Âm thanh sống động", "Micro không dây", "Chọn bài trên điện thoại"],
        }));
    }, [roomTypes]);

    // Active Room Type details
    const selectedRoomType = useMemo(() => {
        if (roomTypesList.length === 0) return null;
        return roomTypesList.find((rt) => rt.id === selectedRoomTypeId) || roomTypesList[0];
    }, [roomTypesList, selectedRoomTypeId]);

    // Calculations
    const roomCost = useMemo(() => {
        if (!selectedRoomType) return 0;
        return selectedRoomType.pricePerHour * duration;
    }, [selectedRoomType, duration]);

    const subtotal = roomCost;

    const discountAmount = useMemo(() => {
        if (!appliedPromo) return 0;
        return Math.round(subtotal * appliedPromo.discount);
    }, [appliedPromo, subtotal]);

    const totalCost = subtotal - discountAmount;

    // Promo application
    const applyPromo = () => {
        const cleanCode = promoCode.trim().toUpperCase();
        if (!cleanCode) {
            toast.error("Vui lòng nhập mã giảm giá.");
            return;
        }

        if (cleanCode === "LUNA2026" || cleanCode === "LUNA2024") {
            setAppliedPromo({ code: cleanCode, discount: 0.15 }); // 15% discount
            toast.success("Áp dụng mã giảm giá 15% thành công!");
        } else if (cleanCode === "GOLD20") {
            setAppliedPromo({ code: cleanCode, discount: 0.2 }); // 20% discount
            toast.success("Áp dụng mã giảm giá VIP 20% thành công!");
        } else {
            toast.error("Mã giảm giá không tồn tại hoặc đã hết hạn.");
        }
    };

    //< Func handle create booking button
    const handleCreateBooking = () => {
        if (!isAuthenticated) {
            if (!guestName.trim()) {
                toast.error("Vui lòng nhập họ và tên của bạn.");
                setIsConfirmOpen(false);
                return;
            }
            if (!guestPhone.trim()) {
                toast.error("Vui lòng nhập số điện thoại để liên hệ.");
                setIsConfirmOpen(false);
                return;
            }
        }
        
        const fullNotes = [
            guestCount ? `Số lượng khách: ${guestCount}` : null,
            notes
        ].filter(Boolean).join("\n\n");

        const formattedDate = selectedDate.toISOString().split("T")[0];
        const payload: CreateBookingDto = {
            roomTypeId: selectedRoomTypeId,
            startTime: combineDateAndTime(selectedDate, startTime),
            endTime: combineDateAndTime(selectedDate, endTime),
            paymentProvider: paymentProvider,
            notes: fullNotes || undefined,
            ...(isAuthenticated
                ? { customerId: user?.id }
                : { guestName: guestName.trim(), guestPhone: guestPhone.trim() }),
        };

        console.log("Create Booking Payload:", payload);

        createBooking(payload, {
            onSuccess: (res) => {
                console.log("Create Booking Response:", res);
                const paymentData = res.data?.payment;

                if (paymentData?.paymentUrl) {
                    console.log("Redirecting to payment URL:", paymentData.paymentUrl);
                    toast.success("Đang chuyển hướng đến trang thanh toán...");
                    window.location.href = paymentData.paymentUrl;
                    return;
                }

                toast.success("Đặt phòng thành công!");

                const bookingData = res.data?.booking;
                const successBooking = {
                    id: bookingData?.id || `BK-${Math.floor(100000 + Math.random() * 900000)}`,
                    room: {
                        name: selectedRoomType?.name || "Premium Room",
                        roomNumber: bookingData?.room?.roomNumber || "101",
                        capacity: selectedRoomType?.capacity || 10,
                    },
                    date: formattedDate,
                    startTime: startTime,
                    endTime: endTime,
                    duration: duration,
                    servicesList: [],
                    totalPrice: bookingData?.deposit || totalCost,
                    status: bookingData?.status || "CONFIRMED",
                };

                setBookingResult(successBooking);
                setIsConfirmOpen(false);
                setIsSuccessOpen(true);
            },
        });
    };

    const handleBackToHome = () => {
        router.push("/");
    };

    const handleGoToHistory = () => {
        router.push("/profile/history");
    };

    return (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-margin py-base md:py-md">
            {/* Background Blurs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-gutter">
                {/* Left Area: Form and Selectors */}
                <div className="flex-grow max-w-4xl space-y-md">
                    {/* Header with Title */}
                    <header className="mb-8">
                        <div>
                            <h2 className="font-heading text-headline-lg-mobile md:text-headline-xl text-primary drop-shadow-[0_0_8px_rgba(236,182,255,0.4)]">
                                Đặt Phòng
                            </h2>
                            <p className="text-on-surface-variant text-label-sm md:text-body-md mt-1">
                                Chọn sân khấu lý tưởng của bạn và thăng hoa cùng âm nhạc.
                            </p>
                        </div>
                    </header>

                    {/* Step components */}
                    {currentStep === 1 && (
                        <RoomTypeStep
                            roomTypesList={roomTypesList}
                            selectedRoomTypeId={selectedRoomTypeId}
                            setSelectedRoomTypeId={setSelectedRoomTypeId}
                            isLoading={roomTypesLoading}
                            isError={roomTypesError}
                        />
                    )}

                    {currentStep === 2 && (
                        <TimeStep
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            startSliderValue={startSliderValue}
                            setStartSliderValue={setStartSliderValue}
                            endSliderValue={endSliderValue}
                            setEndSliderValue={setEndSliderValue}
                            startTime={startTime}
                            endTime={endTime}
                            duration={duration}
                            holdPeriodLabel={holdPeriodLabel}
                            minSliderValue={minSliderValue}
                            bookedSlots={bookedSlots}
                            isOverlapping={isOverlapping}
                        />
                    )}

                    {currentStep === 3 && (
                        <PaymentStep
                            isAuthenticated={isAuthenticated}
                            guestName={guestName}
                            setGuestName={setGuestName}
                            guestPhone={guestPhone}
                            setGuestPhone={setGuestPhone}
                            guestCount={guestCount}
                            setGuestCount={setGuestCount}
                            notes={notes}
                            setNotes={setNotes}
                            paymentProvider={paymentProvider}
                            setPaymentProvider={setPaymentProvider}
                        />
                    )}
                </div>

                {/* Right Area: Booking Summary Sidebar (Desktop Only) */}
                <BillingSidebar
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    selectedRoomType={selectedRoomType}
                    selectedDate={selectedDate}
                    startTime={startTime}
                    endTime={endTime}
                    duration={duration}
                    roomCost={roomCost}
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                    applyPromo={applyPromo}
                    appliedPromo={appliedPromo}
                    subtotal={subtotal}
                    discountAmount={discountAmount}
                    totalCost={totalCost}
                    onSubmit={() => setIsConfirmOpen(true)}
                    isNextDisabled={isOverlapping}
                />
            </div>

            {/* Mobile Navigation Sticky Footer (Visible on screens < lg) */}
            <MobileNavigationFooter
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                totalCost={totalCost}
                onSubmit={() => setIsConfirmOpen(true)}
                isNextDisabled={isOverlapping}
            />

            {/* Overlay confirmation & receipt modals */}
            <BookingModals
                isConfirmOpen={isConfirmOpen}
                setIsConfirmOpen={setIsConfirmOpen}
                isSuccessOpen={isSuccessOpen}
                setIsSuccessOpen={setIsSuccessOpen}
                bookingResult={bookingResult}
                isSubmitting={isSubmitting}
                selectedRoomType={selectedRoomType}
                selectedDate={selectedDate}
                startTime={startTime}
                endTime={endTime}
                duration={duration}
                isAuthenticated={isAuthenticated}
                user={user}
                guestName={guestName}
                guestPhone={guestPhone}
                totalCost={totalCost}
                handleCreateBooking={handleCreateBooking}
                handleBackToHome={handleBackToHome}
                handleGoToHistory={handleGoToHistory}
            />
        </div>
    );
}
