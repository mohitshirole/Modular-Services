# Design System & Style Guide

This document outlines the core design language, typography, and color architecture for the frontend.

---

## 1. Design Philosophy
**Modern Glassmorphism & Minimalist Elegance**
The interface is designed to feel premium, lightweight, and fluid. It moves away from standard "flat" UI toward a depth-focused aesthetic characterized by:
- **Depth:** Backdrop blurs and semi-transparent layers.
- **Organic Geometry:** Large, rounded corners for a friendly, modern feel.
- **Sophistication:** A restricted, high-contrast palette using organic tones (Deep Moss Green) rather than generic blues.

---

## 2. Typography
The system uses **Outfit** from Google Fonts as its primary typeface.

| Property | Value |
| :--- | :--- |
| **Primary Font** | `Outfit`, sans-serif |
| **Weights** | 300, 400, 500, 600, 700, 800 |
| **Scale** | Responsive Tailwind scale (`text-sm` to `text-6xl`) |

---

## 3. Color Palette
The theme is built on a "4-Base Palette" system. The colors are defined as CSS variables in `index.css`.

### Light Mode (Default)
| Variable | Value | Description |
| :--- | :--- | :--- |
| `--palette-surface-main` | `#FFFDF6` | Primary background (Off-white/Creamy) |
| `--palette-surface-muted` | `#FAF6E9` | Secondary surfaces and inputs (Soft Beige) |
| `--palette-content-main` | `#394211` | Primary text and action buttons (Deep Moss Green) |
| `--palette-content-muted` | `#0f110e` | Subtext and secondary icons (Charcoal) |

### Dark Mode
| Variable | Value | Description |
| :--- | :--- | :--- |
| `--palette-surface-main` | `#0a0a0b` | Deep Charcoal background |
| `--palette-surface-muted` | `#1a1a1c` | Dark Slate surfaces |
| `--palette-content-main` | `#f4f4f5` | Clean White text |
| `--palette-content-muted` | `#a1a1aa` | Muted Silver subtext |

---

## 4. Visual Components & Utilities
Custom Tailwind utility classes are used to maintain the design language.

### Glassmorphism
- **`glass-panel`**: Base for frosted-glass containers.
- **`glass-card`**: A premium card with a `3xl` radius and subtle hover lift.
- **`glass-input`**: Soft, translucent input fields.

### Buttons (`btn`)
All buttons have a base `active:scale-95` transition for tactile feedback.
- **`btn-primary`**: High-contrast action button using the Moss Green palette.
- **`btn-secondary`**: Soft, neutral background.
- **`btn-glass`**: A button that blends into glass panels.
- **`btn-destructive`**: Semantic red for critical actions.

### Special Effects
- **`text-liquid`**: A sophisticated gradient applied to headings:
  `linear-gradient(to right, content-main, content-muted)`

---

## 5. Implementation Details
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
  - *Note:* v4 uses a **CSS-first** approach. Configuration is located in `src/index.css` under the `@theme` block, replacing the traditional `tailwind.config.js`.
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Transitions:** Global `transition-colors duration-200` on all elements.

---

## 6. CSS Mappings
The functional variables used in components map directly to the palette:
```css
--background: var(--palette-surface-main);
--foreground: var(--palette-content-main);
--primary: var(--palette-content-main);
--secondary: var(--palette-surface-muted);
--muted: var(--palette-surface-muted);
--accent: var(--palette-surface-muted);
```
