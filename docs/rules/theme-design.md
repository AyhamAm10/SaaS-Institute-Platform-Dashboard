# Theme, Arabic/RTL, visual design

> Part of the rules contract (sections 6, 10, 11 of the former single `role.md`). Section numbers are kept so existing `role.md §N` references still resolve. Start from `core.md`.

---

## 6. Centralized Theme & Multi-Tenant Branding

All design tokens, colors, typography, and component default overrides must live under `src/theme/`.

### Rules:
1. **Zero Hardcoded Colors:** Never write hardcoded hex/rgb colors (e.g., `color="#1a73e8"`, `bg="#f8f9fa"`) inside components. Use theme color tokens: `c="primary.6"`, `bg="var(--mantine-color-body)"`, `c="dimmed"`.
2. **Multi-Tenant White-Labeling Ready:** The theme architecture is parameterized so each tenant Institute can supply its custom `primaryColor`, `secondaryColor`, `logoUrl`, and brand tokens without altering any component code.

---

---

## 10. Arabic-First & Native RTL Architecture (Mandatory)

The SaaS Institute Management Platform is built natively for Arabic educational environments.

### Rules:
1. **Arabic-First Interface:** All UI text, titles, navigation links, buttons, table headers, badges, statuses, placeholders, and error messages MUST be in proper, professional Arabic. No hardcoded English strings in UI.
2. **HTML RTL Document Attributes:** The root `<html>` tag must always have `lang="ar"` and `dir="rtl"`.
3. **Arabic Typography:** The typography system uses **`Readex Pro`** and **`Tajawal`** as the primary sleek, modern Arabic SaaS font stack.
4. **RTL Directional Logic:**
   - The Sidebar must be anchored to the right side of the screen.
   - Mobile drawers must open from the right (`position="right"`).
   - Collapsed tooltips must appear to the left (`position="left"`).
   - Chevron icons must follow Arabic reading flow (e.g., `IconChevronRight` collapses toward the right margin, `IconChevronLeft` expands).
   - Tables, cards, forms, and grid layouts must naturally align from right to left.

---

---

## 11. Visual Aesthetics: Modern Curved & Organic UI Design (Mandatory)

All components, controllers, and layouts must adopt the **Modern Curved Organic UI Spirit**:

1. **Generous Radii & Pill Shapes:**
   - Action Buttons: `radius="xl"` (rounded pill buttons) with bold text and soft shadow elevation.
   - Search & Form Inputs: `radius="xl"` with subtle soft gray backgrounds.
   - Badges & Status Pills: `radius="xl"` with soft pastel tinting.
   - Cards & Surface Panels: `radius="lg"` or `radius="xl"` (`16px` to `20px` border radius) with clean `1px solid var(--mantine-color-gray-2)` borders and subtle soft drop shadows.
   - Pagination: Pill container with circular active page indicators.
2. **Typography Scale:**
   - Compact, refined, and sharp typography (`13px` base for buttons/navlinks, tight line-heights).
3. **Header Structure:**
   - Section indicator on the right with a bold accent color bar.
   - Center pill search bar with large radius.
   - User profile badge encapsulated in a rounded pill menu.
4. **Sidebar Emblem & Navigation:**
   - Top emblem in a circular rounded container with an active status dot.
   - Active sub-navigation displayed in soft tinted background pills.
   - Logout button in a rounded red-tinted pill at the bottom.

---
