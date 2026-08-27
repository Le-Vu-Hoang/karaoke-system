import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "STAFF" | "MANAGER";

export interface AuthUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: UserRole;
  imageUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "ktv-staff-auth" },
  ),
);
