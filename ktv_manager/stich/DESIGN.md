---
name: Neon Pulse
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#d4c0d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#9d8ba0'
  outline-variant: '#514255'
  surface-tint: '#ecb2ff'
  primary: '#ecb2ff'
  on-primary: '#520071'
  primary-container: '#bd00ff'
  on-primary-container: '#ffffff'
  inverse-primary: '#9900cf'
  secondary: '#ffb1c3'
  on-secondary: '#66002c'
  secondary-container: '#ff4b89'
  on-secondary-container: '#590026'
  tertiary: '#00dbe9'
  on-tertiary: '#00363a'
  tertiary-container: '#00838b'
  on-tertiary-container: '#ffffff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f8d8ff'
  primary-fixed-dim: '#ecb2ff'
  on-primary-fixed: '#320047'
  on-primary-fixed-variant: '#74009f'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#ffb1c3'
  on-secondary-fixed: '#3f0019'
  on-secondary-fixed-variant: '#8f0041'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system centers on the high-octane energy of modern nightlife. It is designed to evoke excitement, movement, and a sense of exclusive access. The aesthetic is a fusion of **Glassmorphism** and **Vaporwave-inspired Futurism**, utilizing deep, inky backgrounds to make vibrant neon accents pop. 

The target audience is social, tech-savvy, and seeks entertainment experiences that feel premium yet accessible. Every interaction should feel like stepping into a high-end karaoke lounge—dark, atmospheric, and illuminated by glowing interfaces.

## Colors
The palette is built on a "Midnight Base" with "Electric Accents." 
- **Primary (Electric Purple):** Used for main actions, branding, and primary highlights.
- **Secondary (Neon Pink):** Used for accents, urgent notifications, and secondary interaction states.
- **Tertiary (Cyber Cyan):** Reserved for data visualization, success states, and high-contrast labels.
- **Neutrals:** A range of deep slates and navies provide depth without using pure black, allowing for more realistic light-bleed effects from the neon elements.

## Typography
The typography uses **Sora** for headlines to provide a technical, geometric, and bold personality. Its wide stance ensures that titles feel substantial and energetic even against busy, glowing backgrounds. 

**Hanken Grotesk** is used for all functional text. It offers a sharp, modern clarity that remains legible at smaller sizes within the glass-textured containers. Headlines should predominantly use "tight" letter spacing to enhance the impactful, modern look.

## Layout & Spacing
The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. Spacing follows a strict 8px rhythm to maintain mathematical balance.

Layouts should favor high-contrast grouping—large sections of whitespace (or "dark space") between major content blocks to allow the glassmorphic elements room to breathe. Margins are generous (32px+) to prevent the interface from feeling cluttered, maintaining a premium "lounge" vibe.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and **Luminous Shadows**. 
1.  **Surfaces:** Use backdrop-blur (12px to 20px) combined with a semi-transparent fill and a thin, 1px light-colored border (low opacity) to simulate frosted glass.
2.  **Shadows:** Traditional black shadows are replaced with "Neon Glows." Elements at higher elevations cast a soft, blurred shadow tinted with the primary or secondary color of the element itself.
3.  **Layers:** 
    - *Base:* Deep Navy background.
    - *Mid:* Glass containers for cards and lists.
    - *Top:* Solid glowing buttons and active state indicators.

## Shapes
A **Rounded (0.5rem/8px base)** shape language is used throughout the design system. This strikes a balance between the precision of the modern tech aesthetic and the friendly, inviting nature of a social platform. 

Interactive elements like buttons and input fields use the `rounded-lg` (16px) or `rounded-xl` (24px) tokens to feel softer and more tactile, encouraging touch and interaction.

## Components
- **Buttons:** Primary buttons feature a solid gradient fill (Purple to Pink) with an outer glow. Secondary buttons use a "ghost" style with a neon border.
- **Cards:** Defined by a 1px inner stroke (border-opacity 20%) and a backdrop-blur. Content inside cards should be layered to create a sense of physical depth.
- **Chips/Badges:** Small, high-contrast pills used for genre tags (e.g., "Rock," "Pop"). They should use tertiary neon colors to stand out against the dark glass.
- **Inputs:** Darker than the card background with a 1px bottom border that "lights up" (glows) when focused.
- **Progress Bars (Song Status):** Use a vibrant cyan-to-purple gradient with a "spark" (white glow) at the leading edge to indicate movement.
- **Booking Slots:** Visualized as a grid of glass tiles; "Selected" slots should glow intensely with the primary color.