export const formatCurrency = (val: number): string => {
    return val.toLocaleString("vi-VN") + "đ";
};

export interface RoomType {
    id: string;
    name: string;
    capacity: number;
    pricePerHour: number;
    description: string;
    imageUrl: string;
    features: string[];
}

export interface ServiceItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
}

export interface AppliedPromo {
    code: string;
    discount: number;
}

export interface RoomTypeStepProps {
    roomTypesList: RoomType[];
    selectedRoomTypeId: string;
    setSelectedRoomTypeId: (id: string) => void;
    isLoading: boolean;
    isError: boolean;
}

export interface TimeStepProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    startSliderValue: number;
    setStartSliderValue: (val: number) => void;
    endSliderValue: number;
    setEndSliderValue: (val: number) => void;
    startTime: string;
    endTime: string;
    duration: number;
    holdPeriodLabel: string;
    minSliderValue?: number;
    bookedSlots?: { start: number; end: number }[];
    isOverlapping?: boolean;
}

export interface ServicesStepProps {
    services: ServiceItem[];
    selectedServices: Record<string, number>;
    updateServiceQty: (id: string, delta: number) => void;
}

export interface PaymentStepProps {
    isAuthenticated: boolean;
    guestName: string;
    setGuestName: (name: string) => void;
    guestPhone: string;
    setGuestPhone: (phone: string) => void;
    guestCount: number | "";
    setGuestCount: (count: number | "") => void;
    notes: string;
    setNotes: (notes: string) => void;
    paymentProvider: string;
    setPaymentProvider: (provider: string) => void;
}

export interface BillingSidebarProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    selectedRoomType: RoomType | null;
    selectedDate: Date;
    startTime: string;
    endTime: string;
    duration: number;
    roomCost: number;
    promoCode: string;
    setPromoCode: (code: string) => void;
    applyPromo: () => void;
    appliedPromo: AppliedPromo | null;
    subtotal: number;
    discountAmount: number;
    totalCost: number;
    onSubmit: () => void;
    isNextDisabled?: boolean;
}

export interface BookingModalsProps {
    isConfirmOpen: boolean;
    setIsConfirmOpen: (open: boolean) => void;
    isSuccessOpen: boolean;
    setIsSuccessOpen: (open: boolean) => void;
    bookingResult: any;
    isSubmitting: boolean;
    selectedRoomType: RoomType | null;
    selectedDate: Date;
    startTime: string;
    endTime: string;
    duration: number;
    isAuthenticated: boolean;
    user: any;
    guestName: string;
    guestPhone: string;
    totalCost: number;
    handleCreateBooking: () => void;
    handleBackToHome: () => void;
    handleGoToHistory: () => void;
}

export interface MobileNavigationFooterProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
    totalCost: number;
    onSubmit: () => void;
    isNextDisabled?: boolean;
}
