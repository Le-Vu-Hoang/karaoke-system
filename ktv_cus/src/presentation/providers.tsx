'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/presentation/shared_ui/sonner';
import { useAuthStore } from '@/shared/stores/use-auth-store';
import { apiClient } from '@/infrastructure/api/http-client';
import { API_ENDPOINTS } from '@/shared/constants/api-endpoints';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    const logout = useAuthStore((state) => state.logout);

    const login = useAuthStore((state) => state.login);

    React.useEffect(() => {
        // Check auth: nếu Zustand đã login thì verify, nếu chưa thì thử detect OAuth cookie
        const checkAuth = async () => {
            if (useAuthStore.getState().isAuthenticated) {
                apiClient.get(API_ENDPOINTS.USERS.ME).catch(() => {});
            } else {
                try {
                    const res = await apiClient.get(API_ENDPOINTS.USERS.ME);
                    if (res.data?.data) {
                        login(res.data.data);
                    }
                } catch {
                    // Không có cookie hợp lệ → bỏ qua
                }
            }
        };
        checkAuth();

        const handleForceLogout = () => {
            if (logout) {
                logout();
            }
        };

        window.addEventListener('auth-logout', handleForceLogout);
        return () => window.removeEventListener('auth-logout', handleForceLogout);
    }, [login, logout]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}   
