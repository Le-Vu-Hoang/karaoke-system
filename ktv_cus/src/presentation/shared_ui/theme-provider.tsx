'use client';

import {useEffect} from 'react';
import {useThemeStore} from "@/shared/stores/use-theme-store";

export function ThemeProvider({children}: { children: React.ReactNode }) {
    const theme = useThemeStore((state) => state.theme);

    useEffect(() => {
        const root = window.document.documentElement;

        const applyTheme = () => {
            root.classList.remove('light', 'dark');
            if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            } else {
                root.classList.add(theme);
            }
        };

        applyTheme();

        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme();

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return <>{children}</>;
}