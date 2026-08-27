import { useState, useEffect } from "react";
import { apiClient } from "@/infrastructure/api/http-client";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { format } from "date-fns";

export interface TimeSlot {
    start: number; // Slider index (e.g. 0 = 09:00, 20 = 19:00)
    end: number;   // Slider index
}

export const useRoomAvailability = (date: Date, roomTypeId: string) => {
    const [bookedSlots, setBookedSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!date || !roomTypeId) return;

        let isMounted = true;

        const fetchAvailability = async () => {
            setIsLoading(true);
            try {
                const dateStr = format(date, "yyyy-MM-dd");
                const res = await apiClient.get(
                    `${API_ENDPOINTS.ROOMS.AVAILABILITY(roomTypeId)}?date=${dateStr}`
                );

                if (isMounted && res.data && res.data.bookedSlots) {
                    setBookedSlots(res.data.bookedSlots);
                }
            } catch (error) {
                console.error("Failed to fetch room availability", error);
                if (isMounted) setBookedSlots([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchAvailability();

        return () => {
            isMounted = false;
        };
    }, [date, roomTypeId]);

    return { bookedSlots, isLoading };
};
