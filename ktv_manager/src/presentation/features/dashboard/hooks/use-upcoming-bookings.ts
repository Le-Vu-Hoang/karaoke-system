import { useQuery } from "@tanstack/react-query";
import { getUpcomingBookings } from "@/infrastructure/api/bookings";

export function useUpcomingBookings() {
  return useQuery({
    queryKey: ["bookings-upcoming"],
    queryFn: getUpcomingBookings,
    staleTime: 60_000,
    // Refetch slightly more often or rely on invalidations elsewhere
    refetchInterval: 60_000,
  });
}
