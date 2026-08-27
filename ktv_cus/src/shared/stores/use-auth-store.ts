import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {UserDto} from "@/infrastructure/dtos/auth.dto";

interface AuthState {
    user: UserDto | null;
    isAuthenticated: boolean;
    login: (user: UserDto, token?: string) => void;
    logout: () => void;
    updateProfile: (updatedFields: Partial<Omit<UserDto, 'id' | 'role'>>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: (user) => {
                set({
                    user,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },

            updateProfile: (updatedFields) => {
                set((state) => {
                    if (!state.user) return state;
                    return {
                        user: {
                            ...state.user,
                            ...updatedFields,
                        },
                    };
                });
            },
        }),
        {
            name: 'luna-auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);