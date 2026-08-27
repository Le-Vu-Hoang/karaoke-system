import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    toggleTheme: () => void;
}

const updateThemeClass = (theme: ThemeMode) => {
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        root.classList.add(systemTheme);
    } else {
        root.classList.add(theme);
    }
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'dark',

            setTheme: (theme) => {
                set({theme});
                updateThemeClass(theme);
            },

            toggleTheme: () => {
                set((state) => {
                    const nextTheme: ThemeMode = state.theme === 'dark' ? 'light' : 'dark';
                    updateThemeClass(nextTheme);
                    return {theme: nextTheme};
                });
            },
        }),
        {
            name: 'luna-theme-storage',
        }
    )
);
