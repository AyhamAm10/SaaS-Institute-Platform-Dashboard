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
   - Use `<Box />`, `<Group />`, `<Stack />`, `<Flex />`, `<Paper />`, `<Container />`, `<ScrollArea />`, `<AppShell />`, `<Drawer />`, `<Button />`, `<Text />`, `<Title />`, etc.
2. **No Secondary UI Libraries:** Do not install or use Tailwind CSS, MUI, shadcn/ui, Chakra, or Bootstrap.
3. **Responsive by Design:** Use Mantine's responsive style props (e.g. `visibleFrom="md"`, `hiddenFrom="md"`, responsive arrays/objects `p={{ base: 'sm', md: 'xl' }}`) instead of ad-hoc media query classes.
4. **UI Factories:** When a Controller has distinct device variants (e.g., Desktop Sidebar vs. Mobile Drawer), a dedicated `UI Factory` (e.g. `SidebarFactory.tsx`) must resolve and render the correct variant.

### 5.1 Mandatory Unified Input & Select Standard (`AppInput` / `AppSelect` / `InputController`)

> **CRITICAL RULE:** It is **MANDATORY** across the entire application to use `<InputController />` (aliased as `<AppInput />` and `<AppSelect />` from `@/src/components/controllers` or `@/src/components/controllers/input`) for all form inputs and dropdown select fields instead of invoking raw Mantine input primitives (`TextInput`, `PasswordInput`, `NumberInput`, `Textarea`, `Select`) directly.

#### Why?
1. **Design System Integrity:** Enforces the Modern Curved Organic UI standard (`radius="xl"`, subtle border, soft focus glow, unified font sizes, identical input heights) universally across all dashboard screens and modals/drawers.
2. **Automatic RTL/LTR Intelligence:** Automatically switches input content direction to `ltr` with left text-alignment for phone numbers (`type="tel"`), emails (`type="email"`), passwords (`type="password"`), numbers (`type="number"`), and URLs (`type="url"`), while preserving natural Arabic RTL for labels, descriptions, select options, and error messages.
3. **Unified Dropdown Selection (`AppSelect`):** Fully wraps Mantine's `Select` inside the isolated Controller architecture, offering searchability, clearability, customizable empty state messages ("لا توجد نتائج مطابقة"), and identical height and focus glow.
4. **Per-Instance State Isolation:** Adheres strictly to Section 3 with an isolated Zustand store per input instance.
5. **Smart Icons & Props Transparency:** Provides built-in contextual icons (`IconPhone`, `IconLock`, `IconSearch`, `IconMail`, etc.) while accepting all standard Mantine input props.

```tsx
import { AppInput, AppSelect } from '@/src/components/controllers';

// Text & Number Examples:
<AppInput type="tel" label="رقم الجوال" required />
<AppInput type="password" label="كلمة المرور" required />
<AppInput type="search" placeholder="بحث في السجلات..." />
<AppInput type="number" label="المبلغ" min={0} />
<AppInput type="textarea" label="ملاحظات" rows={4} />

// Select Dropdown Examples:
<AppSelect
  label="المرحلة الدراسية"
  data={gradesList}
  value={selectedGrade}
  onChange={setSelectedGrade}
  searchable
  clearable
  required
/>
```

### 5.2 Mandatory Unified Date Picker Standard (`AppDatePicker`)

> **CRITICAL RULE:** It is **MANDATORY** across the entire application to use `<AppDatePicker />` (from `@/src/components/controllers/date-picker`) for all date selection fields instead of manual text inputs, raw browser date fields, or ad-hoc date pickers.

#### Why?
1. **Design System & Organic UI Consistency:** Adopts the curved, modern rounded container (`radius="md"`, subtle borders, soft glow) with an interactive popover calendar styled in harmony with the Modern Curved Organic UI standard.
2. **Native Arabic & RTL Support:** Implements native Arabic calendar navigation with Arabic month names (يناير، فبراير، ...) and Arabic day headers, flowing correctly with RTL reading order.
3. **Instant Direct Year & Month Selection (Zero Monotonous Clicking):** Includes dedicated Year and Month dropdown selectors right in the popover header, double arrows (`«` / `»`) for jumping full years with 1 click, and a row of Quick Year Jump chips (`[2025] [2026] [2027] [2028] [2029]`) so users can jump to any upcoming or past year immediately without clicking through individual months.
4. **Reliable Standardized ISO Output:** Automatically emits standard ISO `YYYY-MM-DD` strings on selection, preventing date parsing discrepancies and backend validation failures across all APIs.
5. **Fast Shortcuts:** Quick "اليوم" (Today) and "مسح" (Clear) action buttons.

```tsx
import { AppDatePicker } from '@/src/components/controllers/date-picker';

// Examples:
<AppDatePicker label="تاريخ البداية" value={startDate} onChange={setStartDate} required />
<AppDatePicker label="تاريخ النهاية" value={endDate} onChange={setEndDate} required />
```

### 5.3 Mandatory Unified Drawer System (`AppDrawer`) & RTL Physical Alignment

> **CRITICAL RULE:** It is **MANDATORY** across the entire application to use `<AppDrawer />` (from `@/src/components/controllers` or `@/src/components/controllers/drawer`) for all drawers, slide-overs, and side-sheet workflows instead of invoking raw Mantine `<Drawer />` directly.

1. **DirectionProvider & Physical Right Alignment:**
   - Root layout MUST wrap the app in `<DirectionProvider initialDirection="rtl">`.
   - All right-docked drawers MUST inherit physical right docking (`position="right"`, `inner: { direction: 'ltr', justifyContent: 'flex-end' }` and `content: { direction: 'rtl' }`).
   - `<AppDrawer />` enforces this out-of-the-box, ensuring drawers dock against the physical right edge of the screen adjacent to the sidebar without portal alignment issues.

2. **Compound Component Standard:**
   `<AppDrawer />` provides a structured, responsive, and composable layout:
   - `<AppDrawer.Header>`: Contains `<AppDrawer.Icon />`, `<AppDrawer.Title />`, `<AppDrawer.Description />`, `<AppDrawer.Actions />`, and `<AppDrawer.Close />`.
   - `<AppDrawer.Toolbar>`: Optional contextual toolbar for secondary controls, filters, or tab navigation.
   - `<AppDrawer.Content>`: The primary scrollable viewport with standardized padding, scrollbar aesthetics, and built-in `loading` state.
   - `<AppDrawer.Section>` & `<AppDrawer.SectionHeader>`: Organic curved grouping paper for organizing complex form inputs and data visually.
   - `<AppDrawer.Details>` & `<AppDrawer.Detail>`: Structured entity detail pairs with labels, values, icons, and loading skeleton support.
   - `<AppDrawer.Footer>`: Fixed bottom action surface with `<AppDrawer.FooterStart>`, `<AppDrawer.FooterEnd>`, `<AppDrawer.Cancel>`, and `<AppDrawer.Submit>`.

3. **Usage Modes:**
   - **Simple Mode:** `<AppDrawer opened={opened} onClose={onClose} title="Title" loading={isLoading}><Content /></AppDrawer>`
   - **Full Compound Mode:** Directly compose `<AppDrawer.Header>`, `<AppDrawer.Content>`, `<AppDrawer.Section>`, and `<AppDrawer.Footer>` around feature-specific forms.

4. **Layer Separation:**
   - `AppDrawer` is a project-owned UI primitive. It contains **ZERO feature logic**, **ZERO API calls**, and **ZERO domain Zustand state**. All forms, mutations, and domain schemas belong to the feature layer.

### 5.4 Mandatory Unified Modal System (`AppModal`)

> **CRITICAL RULE:** It is **MANDATORY** across the entire application to use `<AppModal />` (from `@/src/components/controllers` or `@/src/components/controllers/modal`) for all dialog windows, confirmation alerts, and compact user interactions instead of using raw Mantine `Modal` directly.

#### Distinct UX Responsibility: Modal vs. Drawer
| Component | Primary UX Responsibility | Examples |
|---|---|---|
| **`AppModal`** | Focused decisions, destructive confirmations, warnings, single-field or compact forms, blocking flows. | Delete confirmation, Set Active Year, Section Fee edit, Quick Action dialog. |
| **`AppDrawer`** | Deep inspection, complex multi-step forms, large detail sheets, rich entity sidebars. | Create/Edit Academic Year, Section Details & Roster, Student Enrollment Drawer. |

#### Architectural Features:
1. **Layered Architecture & Per-Instance Store:**
   - Follows Section 3 strictly with `init/modal.init.ts`, `state/modal.state.ts`, `store/modal.store.ts`, `store/useModalMirror.ts`, `ui/`, and `AppModal.tsx`.
   - Each modal maintains its own isolated Zustand store via React Context (`ModalContext`).
2. **Semantic Variants:**
   - `default`: Primary/neutral workflows.
   - `danger`: Destructive actions (deletions, terminations) with crimson accents, badges, and default delete icons.
   - `warning`: Cautionary prompts and irreversible state transitions.
   - `info`: System advisories and priority changes.
   - `success`: Completion acknowledgments and milestones.
3. **Compound Components & Simple Mode:**
   - `<AppModal.Header>`: Header container with variant-aware layout.
   - `<AppModal.Icon>`: Semantic icon container tinted to match modal variant.
   - `<AppModal.Title>` & `<AppModal.Description>`: Standard typography.
   - `<AppModal.Close>`: Modern rounded close button with RTL flip.
   - `<AppModal.Content>`: Viewport with built-in `ScrollArea.Autosize` and loading overlay.
   - `<AppModal.Footer>`, `<AppModal.FooterStart>`, `<AppModal.FooterEnd>`: Sticky bottom button surfaces.
   - `<AppModal.Cancel>` & `<AppModal.Confirm>`: Pre-styled button primitives wired to modal variant colors.
4. **Pre-built destructive helper:** `<DeleteConfirmationModal />` is available from `@/src/components/controllers` for zero-boilerplate deletion confirmations.

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
├── ui/                       # ALL presentational components (views, modals, badges, drawers, etc.)
│   ├── FeatureView.tsx
│   ├── FeatureTable.tsx
│   ├── FeatureModal.tsx
│   └── index.ts
├── state/                    # (Optional) State interfaces when page owns dedicated state
├── store/                    # (Optional) Zustand store + mirror hooks
├── render-ui.tsx             # Client Component boundary ('use client') — thin wrapper
├── page.tsx                  # Server Component entry point (Pure Server Component)
├── FeatureController.tsx     # (Optional) Root Controller when page has state
├── utils/                    # (Optional) Only when page has dedicated pure helpers
└── api/                      # (Optional) Only when page has direct React Query hooks
```

### C. The Server Component Rule for `page.tsx`
> **CRITICAL RULE:** It is **STRICTLY PROHIBITED** to place `'use client'` inside any `page.tsx` file.
- `page.tsx` must ALWAYS remain a pure **Server Component**.
- `page.tsx` is responsible solely for server-side concerns (route params, metadata, server data prefetching) and simply renders `<RenderUi />`.

### D. `render-ui.tsx` Responsibility
- `render-ui.tsx` contains the `'use client'` directive.
- It is a **thin wrapper** that renders `<FeatureController />` and nothing else.
- It MUST contain **ZERO `useState`**, **ZERO `useEffect`**, and **ZERO business logic**.

### E. Unified `ui/` Directory (Strict Ban on `unControllerComponent`)
- **ALL presentational components** live in a single `ui/` directory — views, tables, modals, drawers, badges, action buttons, filter controls.
- **`unControllerComponent/` is STRICTLY FORBIDDEN:** Do NOT create `unControllerComponent/` anywhere. Any pure UI, modals, or presentational sub-components MUST be placed directly inside `ui/`.
- **`static-data/`**: Stores constant schemas, metric lists, options, column definitions, and mock items outside component files.
- **No Empty Layers**: If a page does not need `state/` or `utils/` or `api/`, do NOT create empty folders for them.

### F. Page-Level Controller Pattern (Mandatory)

> **CRITICAL RULE:** Any page that manages **state** (pagination, filters, modals, selected items, mutations) MUST be structured as a full **Controller Component**, identical in discipline to `src/components/controllers/` modules.

#### Binding Constraints:

1. **`render-ui.tsx` MUST be a thin wrapper** that instantiates the page's Controller component and nothing else. It MUST contain **ZERO `useState`**, **ZERO `useEffect`**, and **ZERO business logic**. Its only job is to render `<FeatureController />`.

2. **State layer (`state/`):** All state types, action signatures, and domain interfaces MUST be defined in `state/<feature>.state.ts`. This file contains NO implementation — only TypeScript interfaces.

3. **Store layer (`store/`):** The Zustand store factory (`create<Feature>Store()`), React Context (`<Feature>Context`), and `use<Feature>Store()` hook MUST live in `store/<feature>.store.ts`. ALL business logic, state transitions, and mutation orchestration reside here.

4. **Mirror layer (`store/`):** The type-safe `use<Feature>Mirror(key)` and `use<Feature>MirrorSelector(selector)` hooks MUST live in `store/use<Feature>Mirror.ts`. These are the ONLY way UI components may access store state.

5. **UI layer (`ui/`):** Pure presentation components that read state EXCLUSIVELY through `useMirror` hooks. UI components MUST have **ZERO `useState` for domain state**, **ZERO direct API calls**, and **ZERO business logic**. They may only hold ephemeral visual state (e.g., tooltip hover) using `useState` if absolutely necessary.

6. **Controller (`<Feature>Controller.tsx`):** Root entry point that:
   - Creates the isolated Zustand store via `useState(() => createStore())`
   - Provides the store via React Context
   - Contains a `QuerySync` component that bridges React Query data → store
   - Owns mutation callbacks that orchestrate store state + API mutations
   - Renders the UI view component

7. **QuerySync Pattern:** React Query hooks (`useQuery`, `useMutation`) MUST NOT appear in UI components. A dedicated `QuerySync` internal component inside the Controller bridges query results into the Zustand store via `syncQueryData()` actions.

#### Standard Page Controller Directory:

```text
src/app/(dashboard)/[featureName]/
├── state/<feature>.state.ts           # State interface & action types
├── store/<feature>.store.ts           # Zustand store factory + Context
├── store/use<Feature>Mirror.ts        # Type-safe mirror hooks
├── ui/<Feature>View.tsx               # Main view composition
├── ui/<Feature>Table.tsx              # Table columns (if applicable)
├── ui/<Feature>Actions.tsx            # Header action buttons
├── ui/<Feature>Filters.tsx            # Filter controls (if applicable)
├── ui/<Feature>Modal.tsx              # Modals / Drawers (pure UI inside ui/)
├── ui/index.ts                        # UI barrel export
├── <Feature>Controller.tsx            # Root Controller entry
├── static-data/                       # Constants, labels, options
├── render-ui.tsx                      # Thin client wrapper → <Controller />
├── page.tsx                           # Pure Server Component
└── index.ts                           # Public API export
```

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

---

## 12. ABSOLUTE PROHIBITIONS — Red Lines (Mandatory)

> **These rules are NON-NEGOTIABLE.** Violating any of them is considered a critical architectural defect that MUST be corrected immediately. No exceptions, no shortcuts, no "just this once."

### 12.1 State & Logic Separation

| ❌ PROHIBITED | ✅ REQUIRED |
|---|---|
| Mixing `useState`/`useEffect`/business logic with JSX in the same component | State in `store/`, logic in Controller, JSX in `ui/` |
| Having more than **2 `useState`** hooks in any single UI component | Move domain state to the Zustand store; only ephemeral visual state (tooltip, hover) may use local `useState` |
| Defining event handlers with business logic inside UI components | Event handlers with business logic belong in the Controller or store actions |
| Placing `useQuery` / `useMutation` hooks inside UI components | React Query hooks belong in the Controller's `QuerySync` component or in the `api/` layer |
| Using `useEffect` in UI components for data synchronization | Data sync belongs in `QuerySync`; UI components only read via `useMirror` |

### 12.2 Props & Context

| ❌ PROHIBITED | ✅ REQUIRED |
|---|---|
| Passing callbacks through more than **1 level** of props (prop drilling) | Use Controller Context + `useMirror` hooks |
| Creating global Zustand singletons for Controller/page state | Per-instance stores via `useState(() => createStore())` + React Context |
| Accessing the Zustand store directly (via `store.getState()`) from UI components | UI components access state ONLY via `useMirror` hooks |

### 12.3 File & Component Boundaries

| ❌ PROHIBITED | ✅ REQUIRED |
|---|---|
| Placing `'use client'` inside `page.tsx` | `page.tsx` is always a pure Server Component; client logic lives in `render-ui.tsx` |
| Having `render-ui.tsx` contain `useState`, `useEffect`, API hooks, or business logic | `render-ui.tsx` is a thin wrapper that renders `<FeatureController />` |
| Cramming column definitions, event handlers, modals, mutations, and JSX into one file | Each concern goes in its proper layer: columns → `ui/Table.tsx`, state → `store/`, mutations → Controller |
| Creating components with more than **150 lines** of mixed concerns | Split into proper layers; each file has a single responsibility |

### 12.4 Design & UI

| ❌ PROHIBITED | ✅ REQUIRED |
|---|---|
| Using raw HTML elements (`<div>`, `<span>`, `<button>`, `<input>`) for UI structure | Use Mantine components (`Box`, `Group`, `Stack`, `Button`, `Text`, etc.) |
| Using raw Mantine input primitives (`TextInput`, `PasswordInput`, `NumberInput`) directly | Use `<AppInput />` from `@/src/components/controllers/input` |
| Hardcoding hex/rgb colors in components | Use theme tokens (`c="primary.6"`, `bg="var(--mantine-color-body)"`) |
| Using non-Arabic text in user-facing UI | All UI text MUST be in professional Arabic |

### 12.5 Quick Self-Check Before Committing Code

Before finalizing any page or component, ask yourself:

1. ✅ Does `render-ui.tsx` contain ONLY `<Controller />`?
2. ✅ Does every `useState` for domain state live in the Zustand store?
3. ✅ Do all UI components read state via `useMirror` hooks?
4. ✅ Are React Query hooks ONLY in the Controller/QuerySync?
5. ✅ Are mutation callbacks orchestrated in the Controller?
6. ✅ Is column/table definition separated from business logic?
7. ✅ Are modals/drawers state managed in the store, not in UI components?

If **ANY** answer is "No", the code violates these rules and MUST be refactored before proceeding.
