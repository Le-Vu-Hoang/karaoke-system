import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // --- Brand Colors (Admin Panel: Steel Blue Dark) ---
        background: {
          DEFAULT: "#0d1117", // GitHub-dark inspired — deep navy-black
          card: "#161b22",
          popover: "#1c2128",
        },
        foreground: "#e6edf3",

        primary: {
          DEFAULT: "#58a6ff", // Accent Blue
          foreground: "#0d1117",
          container: "#1f6feb",
          "container-foreground": "#ffffff",
          fixed: "#cae8ff",
          "fixed-dim": "#58a6ff",
        },
        secondary: {
          DEFAULT: "#3fb950", // Success Green (Actions confirmed)
          foreground: "#0d1117",
          container: "#238636",
          "container-foreground": "#ffffff",
          fixed: "#aff5b4",
          "fixed-dim": "#3fb950",
        },
        tertiary: {
          DEFAULT: "#d2a8ff", // Lavender (Highlights, info)
          foreground: "#0d1117",
          container: "#6e40c9",
          "container-foreground": "#ffffff",
          fixed: "#eddeff",
          "fixed-dim": "#d2a8ff",
        },
        error: {
          DEFAULT: "#f85149",
          foreground: "#ffffff",
          container: "#8e1519",
          "container-foreground": "#ffd7d5",
        },
        success: {
          DEFAULT: "#3fb950",
          foreground: "#0d1117",
          container: "#238636",
          "container-foreground": "#aff5b4",
        },
        warning: {
          DEFAULT: "#e3b341",
          foreground: "#0d1117",
          container: "#9e6a03",
          "container-foreground": "#ffd8a8",
        },
        notificate: {
          DEFAULT: "#58a6ff",
          foreground: "#0d1117",
          container: "#1f6feb",
          "container-foreground": "#cae8ff",
        },

        // MD3-style Surface Tokens (Admin)
        surface: {
          DEFAULT: "#0d1117",
          dim: "#010409",
          bright: "#2d333b",
          "container-lowest": "#010409",
          "container-low": "#161b22",
          container: "#1c2128",
          "container-high": "#22272e",
          "container-highest": "#2d333b",
          tint: "#58a6ff",
          variant: "#2d333b",
        },

        outline: {
          DEFAULT: "#30363d",
          variant: "#21262d",
        },

        // Role-based badge colors
        role: {
          admin: "#d2a8ff",
          staff: "#58a6ff",
          manager: "#e3b341",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        heading: ["var(--font-geist-sans)", "sans-serif"],
      },
      spacing: {
        base: "8px",
        xs: "4px",
        sm: "12px",
        md: "24px",
        lg: "48px",
        xl: "80px",
        gutter: "24px",
        margin: "32px",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
