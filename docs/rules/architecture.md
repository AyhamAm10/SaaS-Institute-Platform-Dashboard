# Controller pattern, layers, stores, mirrors

> Part of the rules contract (sections 1, 2, 3, 4 of the former single `role.md`). Section numbers are kept so existing `role.md §N` references still resolve. Start from `core.md`.

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
