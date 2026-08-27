---
name: tailwind-design-system
description: Build scalable design systems with Tailwind CSS v4, design tokens, component libraries, and responsive patterns. Adjusted specifically for the Luna Karaoke (KTV) Frontend project.
---

# Tailwind Design System (v4) - KTV Project

Build production-ready design systems with Tailwind CSS v4. This skill is adapted for the Luna Karaoke project which uses a hybrid v4 configuration to support Shadcn/ui and a custom "Neon Pulse" design system.

> **Note**: This project uses Tailwind CSS v4 (2024+) with a `@config` bridge to a `tailwind.config.ts` file for backward compatibility and plugin support.

## When to Use This Skill

- Creating a component library with Tailwind v4 and Shadcn
- Implementing design tokens and theming using the Neon Pulse color palette
- Building responsive and accessible components
- Standardizing UI patterns (like typography and glassmorphism) across the codebase

## Key v4 Changes & Project Context

| Concept                               | Implementation in this project                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------- |
| Configuration                         | `@theme inline` in `globals.css` + `@config "../tailwind.config.ts"`                  |
| Imports                               | `@import "tailwindcss"; @import "shadcn/tailwind.css";`                               |
| Dark Mode                             | `@custom-variant dark (&:is(.dark *));`                                               |
| Color Tokens                          | Hex colors defined in `:root`, mapped to `@theme inline { --color-*: var(--*); }`     |
| Custom Utilities                      | Defined using `@utility` in `globals.css` (e.g. `@utility glass { ... }`)             |

## Quick Start (KTV Project Specifics)

This project uses a structured approach in `app/globals.css`:

```css
/* app/globals.css - Tailwind v4 CSS-first configuration */
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/* Dark mode variant */
@custom-variant dark (&:is(.dark *));

/* Import existing tailwind.config.ts for backward compatibility / plugins */
@config "../tailwind.config.ts";

/* 1. Define CSS Variables (Hex colors for Neon Pulse theme) */
:root {
  --background: #0b1326;
  --foreground: #dae2fd;
  --primary: #ecb2ff;
  --primary-foreground: #520071;
  /* ... other variables ... */
}

/* 2. Map variables to Tailwind tokens using @theme inline */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  
  /* Fonts */
  --font-sans: var(--font-hanken), sans-serif;
  --font-heading: var(--font-sora), sans-serif;
  --font-mono: var(--font-mono), monospace;
}

/* 3. Base styles */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

## Core Concepts

### 1. Design Token Hierarchy

In this project, colors flow from raw Hex codes to CSS variables, then to Tailwind tokens:

```
Raw Hex (Neon Pulse) → CSS Variable (:root) → Tailwind Token (@theme inline) → Utility Class
```

**Example:**
`#ecb2ff` → `--primary: #ecb2ff;` → `--color-primary: var(--primary);` → `bg-primary` / `text-primary`

### 2. Typography & Custom Utilities

Always use the project's custom utility classes defined in `globals.css` for typography and specific visual effects instead of composing them from scratch:

- **Headings**: `text-headline-xl`, `text-headline-lg`, `text-headline-md` (Uses Sora font)
- **Body Text**: `text-body-lg`, `text-body-md` (Uses Hanken Grotesk font)
- **Labels**: `text-label-md`, `text-label-sm`
- **Effects**: `glass` (Applies glassmorphism background, blur, and subtle border)

### 3. Component Architecture

```
Base styles → Variants (via class-variance-authority) → Sizes → States → Overrides
```

## Detailed patterns and worked examples

When building UI components:
1. Prioritize Shadcn components in `@/presentation/shared_ui/`.
2. If styling manually, always use the predefined semantic colors (e.g., `bg-surface-container`, `text-primary`, `bg-processing`) rather than raw hex codes.
3. For interactive elements, ensure focus states use `outline-ring/50`.
