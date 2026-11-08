# Page architecture and route structure

> Part of the rules contract (sections 9 of the former single `role.md`). Section numbers are kept so existing `role.md §N` references still resolve. Start from `core.md`.

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

### G. Config-Driven Generic Controllers (Reference Data)

When several screens differ only in data (labels, form fields, extra columns), build **one** generic page-level Controller driven by a config object instead of copying a Controller per screen. The canonical example is `settings/reference-data/`:

- `lookup/lookup.config.ts` defines `LookupConfig` (API resource, labels, `fields`, `columns`); `static-data/reference-data.data.ts` holds one config per table (`LOOKUP_CONFIGS`).
- `LookupController` creates an **isolated store per instance** (`createLookupStore(config)`), owns QuerySync and mutations, and is mounted once per `AppTabs.Panel`.
- API access goes through `createLookupResource<T>(path)` in `core/api/reference-data.api.ts` (keys + `useList` / `useCreate` / `useUpdate` / `useDelete`). Add a new table by adding a resource and a config entry, not new components.
- Server error messages (e.g. "in use, cannot delete") are shown as-is via `getApiErrorMessage`.

Features that link to reference data (students) load options in their Controller (`useStudentReferenceOptions` inside a QuerySync component) and render them with the props-only `StudentReferenceFields`; `ui/` never fetches.

### H. Nested Feature Controllers Inside a Drawer

When a drawer tab is a feature of its own (e.g. the section's **Students** tab), do not grow the page store. Mount a child Controller in the tab with its own isolated store, keyed by the entity (`<SectionStudentsController key={section.id} section={...} />` in `sections/enrollments/`):

- The child owns its QuerySync components; syncs needed only by a modal are **mounted only while that modal is open** (candidates, transfer targets).
- Mutation orchestration that does not fit in the Controller file goes in a controller-level hook (`useEnrollmentActions`), never in `ui/`.
- Mutations invalidate every list they affect (section counts, rosters, students list) in the API module.

The student **finance drawer** (`students/finance/`) follows the same pattern: `StudentFinanceSlot` mounts `<StudentFinanceController key={student.id} />`, and `useFinanceActions` orchestrates the contract / payment modals.

### I. Money and Floating Layers

- Show amounts only with `formatMoney(value, currency)` from `core/format` (SYP without fractions, USD with two decimals). Never add amounts of different currencies.
- Client-side money previews (`convertAmount`, `previewAllocation`) only explain what the server will do; the server stays the source of truth and its error message is shown as-is.
- Read text inputs with `inputText(e)` from `core/format` (handles values, numbers and events).
- Dropdowns, date pickers and menus use `FLOATING_Z_INDEX` (400) from the theme, above `AppDrawer` (300) and `AppModal` (350). Do not override `zIndex` per component.
- Times of day that belong to the institute (attendance) are shown and entered in the **institute time zone** (`user.institute.timezone`), never the browser's: see `attendance/utils/attendance.utils.ts` (`toTime`, `toInstant`, `localToday`).
- `AppInput` / `AppSelect` keep their previous `error` when the prop becomes `undefined`: clear a field error with `''` (or `null`), never `undefined`.
- **Dashboard numbers** come from `GET /dashboard/overview` (`useDashboardOverviewQuery`, refreshed every minute). The home page and the students page KPIs both read it; map it to chart models with the pure helpers in `dashboard/utils/dashboard-overview.utils.ts`. Never show demo numbers next to real ones.
- **Charts**: `BarChart` keys bars by period + label, so labels must be unique (e.g. `الخميس 5`, not `الخميس`). `ChartCard` opens on the 2nd period by default; pass `activePeriod` when the first tab must be active. Leave zero values out of `CircleChart` segments (`nonEmptySegments`): a zero-length round-capped arc still draws a dot.
- **Status colours in charts** use the semantic palette (`success`, `brand`, `danger`, `info`), not `yellow` / `blue`, which this theme maps to the brand orange and slate.
- **Permissions (D2)**: the server decides (`user.permissions` from `/auth/me`); the UI only hides what the user cannot do. Use `useAuth().can(PERMISSIONS.x)` in the **controller** and pass booleans down (`access` props, or a `canManage` field in the store) — never call `useAuth` in `ui/`. Every sidebar entry carries its `permission`; `filterNavigation` hides entries and `requiredPermissionFor` gates the page (`NoPermissionView`), with `ROUTE_OVERRIDES` for sub-pages that need more (e.g. `/students/new` → `students.manage`, `/teachers/new` → `academic.manage`). A new page MUST add its permission to `navigation.ts`.
- **Shared Password Validation**: Password constraints and error formatting are centralized in `src/core/auth/password.ts` (`USER_PASSWORD_MIN = 8`, `STAFF_PASSWORD_MIN = 8`, and `passwordError(password: string): string | null`), re-exported from `@/src/core/auth`. Used uniformly across staff management (`settings/staff`) and teacher management (`teachers/new`, `TeacherFormDrawer`, and `TeacherPasswordModal`).
- Print pages live in the `(print)` route group (authenticated, no sidebar), e.g. `/payments/:id/receipt` (A5).
- **Reports (D3)**: the server builds every report into one `ReportDocument`; the dashboard never computes a report. Render it with the `AppReport` compound controller (`components/controllers/report`: `AppReport.Paper / Header / Meta / Body / Footer`, one block component per block type, fixed paper palette `REPORT_PAPER` so a report prints the same in both themes, brand = institute color). Pages: reports center `/reports` (catalog from `GET /reports/catalog`), workspace `/reports/[key]` (parameters → preview → print / Excel), print page `(print)/reports/[key]/print` (A4, opens the print dialog with `autoprint=1`), public `/verify/[token]` (QR check, no sign-in). Link a page to its reports with `<ReportMenu keys={[...]} params={{ ... }} />` (it hides what the user may not open); never hand-build a report URL (use `reportLink`).

### J. Operational Context (Branch + Academic Year)

- The header is the ONLY place that picks the branch and the academic year (`core/context/operational-context.ts`). **No page has its own year / branch selector, and no list request sends `branchId` / `academicYearId`**: the API client adds the headers and the server scopes every list (backend role.md §3.4). A page that needs "the year" reads `useOperationalContext()` (e.g. a new section is created in the header year).
- The context is remembered per institute + user (`saas_ctx:<institute>:<user>:branch|year`) and reset on logout; another account never inherits it.
- `OperationalContextGate` (dashboard and print layouts) validates the stored branch / year against the institute lists (`useOperationalContextResolver`) and renders the page only then; the API client sends the headers only once the context is resolved.
- Switching the branch / year resets every context-dependent query centrally (`ContextCacheSync` → `clearContextQueries`). Queries that do NOT depend on the context are listed in `CONTEXT_FREE_QUERY_PREFIXES` (`core/context/context-cache.ts`); a new institute-wide query must be added there. Never call `invalidateQueries()` on a context switch yourself.
- Branch / year names shown anywhere come from `useActiveContextLabels()` (one source for the header and the sidebar).

### K. Unified Settings Hub Pattern (`/settings`)

- The platform consolidates configuration and account administration into a unified, tabbed hub at `/settings`.
- **Authoritative Tabs Order & Permissions:**
  1. `institute`: Institute profile & IANA timezone configuration (`settings.view` / `settings.manage`).
  2. `schedule`: Daily working hours, attendance rules, periods & breaks (`settings.view`).
  3. `staff`: Staff accounts, role assignments & deactivations (`staff.view`).
  4. `teachers`: Teacher accounts & password reset scoped to the header's active branch (`academic.manage`).
  5. `mobile`: Mobile application accounts for guardians (`FAMILY`) and students (`STUDENT`) (`students.view` / `students.manage`).
  6. `student-fields`: Custom student profile fields (`settings.view`).
  7. `reference-data`: Lookup reference tables via config-driven tabs (`settings.view`).
- **Tab State & URL Synchronization:**
  - URL query synchronization (`/settings?tab=<key>`). Invalid or unauthorized tab requests gracefully fall back to the first permitted tab.
  - Tabs mount lazily on initial visit and stay mounted (`keepMounted={true}` on `AppTabs.Panel`) to preserve in-progress form inputs and nested controller stores across tab switches.
- **Legacy Route Redirection:**
  - Previous standalone routes (`/schedule-settings`, `/settings/staff`, `/settings/student-fields`, `/settings/reference-data`) serve server-side `redirect('/settings?tab=...')`.
---
