import type {Config} from 'tailwindcss';

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Màu sắc chủ đạo & bổ trợ theo hệ thống Neon Pulse
                background: {
                    DEFAULT: '#0b1326', // Midnight Base
                    card: '#131b2e',    // surface-container-low
                    popover: '#171f33', // surface-container
                },
                foreground: '#dae2fd', // on-background / on-surface
                primary: {
                    DEFAULT: '#ecb2ff', // Electric Purple
                    foreground: '#520071',
                    container: '#bd00ff',
                    'container-foreground': '#ffffff',
                    fixed: '#f8d8ff',
                    'fixed-dim': '#ecb2ff',
                },
                secondary: {
                    DEFAULT: '#ffb1c3', // Neon Pink
                    foreground: '#66002c',
                    container: '#ff4b89',
                    'container-foreground': '#590026',
                    fixed: '#ffd9e0',
                    'fixed-dim': '#ffb1c3',
                },
                tertiary: {
                    DEFAULT: '#00dbe9', // Cyber Cyan
                    foreground: '#00363a',
                    container: '#00838b',
                    'container-foreground': '#ffffff',
                    fixed: '#7df4ff',
                    'fixed-dim': '#00dbe9',
                },
                error: {
                    DEFAULT: '#ffb4ab',
                    foreground: '#690005',
                    container: '#93000a',
                    'container-foreground': '#ffdad6',
                },

                success: {
                    DEFAULT: '#69ffa8', // Neon Emerald
                    foreground: '#00391c',
                    container: '#00522a',
                    'container-foreground': '#94ffd2',
                },
                warning: {
                    DEFAULT: '#ffc83d', // Neon Amber/Yellow
                    foreground: '#422f00',
                    container: '#604500',
                    'container-foreground': '#ffe299',
                },
                notificate: {
                    DEFAULT: '#73c3ff', // Neon Light Blue (Info)
                    foreground: '#003253',
                    container: '#004976',
                    'container-foreground': '#c9e6ff',
                },
                processing: {
                    DEFAULT: '#b49cff', // Electric Indigo (Dùng cho loading/active states)
                    foreground: '#2c1477',
                    container: '#432990',
                    'container-foreground': '#e4dfff',
                },

                // MD3 Surface Tokens
                surface: {
                    DEFAULT: '#0b1326',
                    dim: '#0b1326',
                    bright: '#31394d',
                    'container-lowest': '#060e20',
                    'container-low': '#131b2e',
                    container: '#171f33',
                    'container-high': '#222a3d',
                    'container-highest': '#2d3449',
                    tint: '#ecb2ff',
                    variant: '#2d3449',
                },

                outline: {
                    DEFAULT: '#9d8ba0',
                    variant: '#514255',
                },
            },
            fontFamily: {
                sans: ['var(--font-hanken)', 'sans-serif'],
                mono: ['var(--font-mono)', 'monospace'],
                heading: ['var(--font-sora)', 'sans-serif'],
                sora: ['var(--font-sora)', 'sans-serif'],
                hanken: ['var(--font-hanken)', 'sans-serif'],
            },
            spacing: {
                base: '8px',
                xs: '4px',
                sm: '12px',
                md: '24px',
                lg: '48px',
                xl: '80px',
                gutter: '24px',
                margin: '32px',
            },
            borderRadius: {
                sm: '0.25rem',
                DEFAULT: '0.5rem',
                md: '0.75rem',
                lg: '1rem',
                xl: '1.5rem',
            },
        },
    },
    plugins: [],
};

export default config;
