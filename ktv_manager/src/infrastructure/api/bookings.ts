import { apiClient } from "./http-client";

export const getUpcomingBookings = async () => {
  // To get upcoming bookings, let's just query CONFIRMED bookings for today
  // Alternatively we can get all CONFIRMED and filter client side
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const { data } = await apiClient.get(`/bookings?status=CONFIRMED&fromDate=${today}`);
  return data; // Expected shape: { data: BookingSummaryResponseDto[], meta: { ... } }
};

export const checkInBooking = async (bookingId: string, roomId: string) => {
  const { data } = await apiClient.post(`/bookings/${bookingId}/check-in`, { roomId });
  return data;
};

export const walkInCheckIn = async (payload: { roomId: string; durationHours: number; guestName?: string; guestPhone?: string }) => {
  const { data } = await apiClient.post(`/bookings/walk-in`, payload);
  return data;
};
