# Frontend Architecture Constitution — SaaS Institute Admin Dashboard

This document establishes the binding architectural principles, conventions, and structural rules for the Frontend of the Multi-Tenant SaaS Education Platform. Every feature, component, and module must strictly adhere to these rules.

---

## 1. Core Architectural Paradigm: Controller Component Pattern

In this platform, a complex or stateful UI module is structured as a **Controller Component**. A Controller is not merely a single `.tsx` file; it is an organized directory module responsible for orchestrating **initialization, state management, API synchronization, utility logic, and visual presentation**.

### Standard Controller Directory Structure

```text
ComponentName/
├── init/          # Runtime initialization, URL/props derivation, non-API setup
├── state/         # Domain state schemas, actions, initial states, reducers
├── api/           # React Query hooks, API requests, mutations, query keys (optional)
├── utils/         # Component-scoped pure helper functions (optional)
├── store/         # Per-instance Zustand store definition and React Context bridge
├── ui/            # Pure presentation layer (Mantine components only)
│   ├── desktop/   # Desktop-specific visual variant (if applicable)
│   ├── mobile/    # Mobile/Drawer-specific visual variant (if applicable)
│   ├── ComponentFactory.tsx # Variant selector
│   └── index.ts
├── ComponentController.tsx  # Root Controller entry point providing the store
└── index.ts       # Clean public API export
```

> **Rule:** Only create the layers that are genuinely needed. Do not create empty folders or unnecessary boilerplate files just to satisfy the structure.

---

## 2. Layer Responsibilities & Boundaries

| Layer | Responsibility | What Belongs Here | What Does NOT Belong Here |
|---|---|---|---|
| **`init`** | Runtime bootstrap & parameters | Props interfaces, URL query params parsing, initial route matching, default configs. | No API fetching, no JSX rendering, no business mutation logic. |
| **`state`** | State schemas & domain logic | State types, action definitions, state transition logic, initial values. | No JSX rendering, no direct DOM manipulations. |
| **`api`** | Data fetching & mutations | TanStack React Query queries, mutations, query key factories, response transformations. | No UI layout, no non-API initialization. |
| **`utils`** | Pure helper functions | Formatters, tree traversal, math, localized string helpers specific to this controller. | No global state access, no side-effects, no business logic dumping. |
| **`store`** | Per-instance runtime state | Zustand store creator, React Context provider, `useMirror` / `useMirrorRegistry` hooks. | No presentation JSX. |
| **`ui`** | Presentation & User interaction | Visual layouts, Mantine primitives, calling `useMirror` for state/actions. | No business logic, no API calling, no direct Zustand store mutation. |

---

## 3. Per-Instance Zustand Store Isolation (Mandatory)

**Rule:** Every Controller instance MUST have its own independent Zustand store.
Global Zustand singletons for Controller state are strictly prohibited.

```text
<SidebarController /> (Instance 1)  ──>  Zustand Store A (Isolated)
<SidebarController /> (Instance 2)  ──>  Zustand Store B (Isolated)
```

### Why?
In a modular dashboard, multiple instances of the same component (such as two Sidebars, multiple DataTables, nested Steppers, or side-by-side FilterPanels) must never bleed their internal state into each other. Even if both instances manage state keys with the exact same name (e.g. `isOpen`, `activeItem`, `page`, `selectedRows`), their values must remain completely isolated.

### Implementation Standard
1. The store is created using a factory function: `createControllerStore(initialProps)` using `zustand/vanilla`.
2. The store instance is created once per component lifecycle using `useState(() => createControllerStore(props))`.
3. The store is injected into the component tree using a standard **React Context**.
4. Child UI components consume the store via the type-safe `useMirror` hook.

---

## 4. Mirror Registry & `useMirror` Architecture

The **Mirror Registry** serves as the controlled, strongly typed bridge between the Controller's internal layers and its UI presentation layer.

```text
Controller Layers
(init, state, api, utils)
       │
       ▼
Controller Instance Store  (Mirror Registry)
       │
       ▼
       UI Components via useMirror("key")
```

### Principles:
1. **Abstraction of Origin:** The UI does not need to know whether a value came from `props`, `init`, a computed `state`, or an `api` query. It simply requests the mirror property.
2. **Selective Re-rendering:** `useMirror(key)` subscribes only to the requested slice of state using Zustand selectors. When property `A` changes, components subscribed only to property `B` do not re-render.
3. **Type Safety:** The `useMirror` hook is strictly typed against the Controller's `MirrorSchema`. Requesting an invalid key produces a compile-time TypeScript error, and the return type is automatically inferred.

```ts
// Example UI consumption:
const isCollapsed = useSidebarMirror('isDesktopCollapsed');
const toggleCollapse = useSidebarMirror('toggleDesktopCollapse');
const activeRoute = useSidebarMirror('activeRoute');
```

---

## 5. UI Layer & Mantine-Only Rule

**Rule:** Mantine (`@mantine/core`, `@mantine/hooks`, `@tabler/icons-react`) is the exclusive UI foundation.

1. **No Raw HTML Elements for UI:** Do not use `<div />`, `<span />`, `<button />`, `<input />`, `<nav />`, `<header />`, `<section />` for UI structure.
   - Use `<Box />`, `<Group />`, `<Stack />`, `<Flex />`, `<Paper />`, `<Container />`, `<ScrollArea />`, `<AppShell />`, `<Drawer />`, `<Button />`, `<Text />`, `<Title />`, `<TextInput />`, etc.
2. **No Secondary UI Libraries:** Do not install or use Tailwind CSS, MUI, shadcn/ui, Chakra, or Bootstrap.
3. **Responsive by Design:** Use Mantine's responsive style props (e.g. `visibleFrom="md"`, `hiddenFrom="md"`, responsive arrays/objects `p={{ base: 'sm', md: 'xl' }}`) instead of ad-hoc media query classes.
4. **UI Factories:** When a Controller has distinct device variants (e.g., Desktop Sidebar vs. Mobile Drawer), a dedicated `UI Factory` (e.g. `SidebarFactory.tsx`) must resolve and render the correct variant.

---

## 6. Centralized Theme & Multi-Tenant Branding

All design tokens, colors, typography, and component default overrides must live under `src/theme/`.

### Rules:
1. **Zero Hardcoded Colors:** Never write hardcoded hex/rgb colors (e.g., `color="#1a73e8"`, `bg="#f8f9fa"`) inside components. Use theme color tokens: `c="primary.6"`, `bg="var(--mantine-color-body)"`, `c="dimmed"`.
2. **Multi-Tenant White-Labeling Ready:** The theme architecture is parameterized so each tenant Institute can supply its custom `primaryColor`, `secondaryColor`, `logoUrl`, and brand tokens without altering any component code.

---

## 7. Component Ownership, Boundaries & Reusability

1. **Simple Components vs. Controllers:**
   - Simple presentational components (`Logo`, `UserAvatar`, `StatusBadge`, `StatCard`) do **NOT** need a Controller folder. Keep them simple files in `src/components/ui/`.
   - Complex, multi-variant, or state-heavy modules (`Sidebar`, `Layout`, `DataTable`, `Stepper`, `ComplexForm`, `FilterModal`, `Wizard`) **MUST** follow the Controller pattern.
2. **Controller Hierarchy & Composition:**
   - A parent Controller may compose child Controllers (e.g. `LayoutController` composes `SidebarController`).
   - A parent Controller must **NOT** reach into or manage the internal state of child Controllers. Each Controller remains the sole owner of its state.
3. **Compound Components Policy:**
   - Do **NOT** use Compound Components when a single cohesive component suffices (avoid `Sidebar.Item`, `Sidebar.Section` when standard config objects work cleaner).
   - Use Compound Components **ONLY** when child components need flexible visual authoring by the consumer while sharing parent context (e.g. `Stepper` + `Stepper.Step`, `DataTable` + `DataTable.Column`).

---

## 8. TypeScript & Code Quality Standards

1. **Strict Typing:** Avoid `any` without exception. Use generics, mapped types, discriminated unions, and `unknown` with type guards.
2. **No Circular Dependencies:** Organize imports strictly: `core/` → `theme/` → `components/ui/` → `components/controllers/` → `app/`.
3. **Naming Conventions:**
   - Controllers: `<Name>Controller.tsx` (e.g., `SidebarController.tsx`, `LayoutController.tsx`)
   - Store & Mirror: `<name>.store.ts`, `use<Name>Mirror.ts`
   - State & Init: `<name>.state.ts`, `<name>.init.ts`
   - UI Variants: `Desktop<Name>.tsx`, `Mobile<Name>.tsx`, `<Name>Factory.tsx`
   - Hook: `use<Name>` (camelCase)

---

## 9. Page Component Architecture & Route Structure (Mandatory)

Pages follow the exact same structural discipline as Controller Components.

### A. Route Group Organization
All dashboard feature pages must live under a route group folder: `src/app/(dashboard)/`.
The route group contains `layout.tsx` which wraps all child pages inside `<LayoutController>`.

### B. Standard Page Directory Structure

```text
src/app/(dashboard)/[featureName]/
├── static-data/              # Constant arrays, mock records, select options, table headers
│   └── feature.data.ts
├── unControllerComponent/    # Pure, uncontrolled presentational components
│   ├── ComponentA.tsx
│   ├── ComponentB.tsx
│   └── index.ts
├── render-ui.tsx             # Client Component boundary ('use client') assembling UI
├── page.tsx                  # Server Component entry point (Pure Server Component)
├── state/                    # (Optional) Only when page owns dedicated state
├── utils/                    # (Optional) Only when page has dedicated pure helpers
└── api/                      # (Optional) Only when page has direct React Query hooks
```

### C. The Server Component Rule for `page.tsx`
> **CRITICAL RULE:** It is **STRICTLY PROHIBITED** to place `'use client'` inside any `page.tsx` file.
- `page.tsx` must ALWAYS remain a pure **Server Component**.
- `page.tsx` is responsible solely for server-side concerns (route params, metadata, server data prefetching) and simply renders `<RenderUi />`.

### D. `render-ui.tsx` Responsibility
- `render-ui.tsx` contains the `'use client'` directive.
- It imports presentational pieces from `unControllerComponent/` and constant datasets from `static-data/`.
- It orchestrates the visual assembly of the page without containing raw, messy inline JSX or monolithic markup.

### E. `unControllerComponent/` vs `static-data/`
- **`static-data/`**: Stores constant schemas, metric lists, options, column definitions, and mock items outside component files.
- **`unControllerComponent/`**: Holds independent presentational components (e.g., `WelcomeBanner.tsx`, `StatsOverview.tsx`, `RecentEnrollmentsTable.tsx`, `TermProgressCard.tsx`).
- **No Empty Layers**: If a page does not need `state/` or `utils/` or `api/`, do NOT create empty folders for them.

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
