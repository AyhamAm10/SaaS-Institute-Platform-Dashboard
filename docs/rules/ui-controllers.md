# Unified UI controllers and component ownership

> Part of the rules contract (sections 5, 7 of the former single `role.md`). Section numbers are kept so existing `role.md §N` references still resolve. Start from `core.md`.

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

### 5.2 Mandatory Unified Date Picker Standard (`AppDatePicker` / `DatePickerController`)

> **CRITICAL RULE:** It is **MANDATORY** across the entire application to use `<AppDatePicker />` (from `@/src/components/controllers` or `@/src/components/controllers/date-picker`) for all date selection fields instead of manual text inputs, raw browser date fields, or ad-hoc custom implementations.

#### Architecture & Mantine Integration:
1. **Built on Mantine's Official `@mantine/dates` (`DatePickerInput`):** Directly leverages Mantine's official `DatePickerInput` with native decade/year/month zoom level picker, eliminating manual date logic while guaranteeing full accessibility and keyboard navigation.
2. **Pixel-Perfect Form Height Harmony (`height: 38px`):** The input trigger strictly matches `height: rem(38)`, `minHeight: rem(38)`, `borderRadius: rem(8)`, `fontSize: rem(13)`, and `label: { fontSize: rem(12.5), fontWeight: 600 }` to align seamlessly in form grids alongside `<AppInput />` and `<AppSelect />`.
3. **Single Down Chevron (`<IconChevronDown size={15} />`):** Clean single down chevron without cluttered double selectors (`⇅`) or raw browser arrows.
4. **Decade & Century Navigation (No 2011 Barrier):** Users can click the calendar header level to zoom out to Decade and Year views, selecting historical birth dates from any decade without restriction or UI desync.
5. **Native Arabic & RTL Support:** Implements native Arabic calendar navigation with Arabic month names (يناير، فبراير، ...) and Arabic day headers, flowing correctly with RTL reading order.
6. **Reliable Standardized ISO Output:** Automatically emits standard ISO `YYYY-MM-DD` strings on selection, preventing date parsing discrepancies and backend validation failures across all APIs.
7. **Per-Instance State Isolation:** Fully adheres to Section 3 of `role.md` with an isolated Zustand store per instance.

```tsx
import { AppDatePicker } from '@/src/components/controllers';

// Examples:
<AppDatePicker label="تاريخ الميلاد" value={birthDate} onChange={setBirthDate} required />
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

### 5.5 Mandatory Unified Data Views & Tables Standard (`DataModuleController`)

> **CRITICAL ARCHITECTURAL CONSTITUTION:** It is **STRICTLY MANDATORY** across the entire platform to use `<DataModuleController />` (from `@/src/components/controllers/data-module`) for all tabular data displays, entity listings, search/filter bars, and pagination layouts.

#### 1. Zero External Layout Manipulation Rule (Strictly Enforced)
- **The Controller is the SOLE Authority and Source of Truth for Design:** All layout containers, borders, border radii, paddings, margins, table header (`Thead`) styling, column header typography, filter bar wrappers, empty states, and pagination footers are **100% owned, determined, and enforced by `DataModuleController`**.
- **PROHIBITED:** Page views, feature components, and consumer code are **STRICTLY FORBIDDEN** from controlling or defining the layout from the outside. Creating custom outer `Card`s, outer `Paper`s, custom `Box` paddings, ad-hoc `Table.Thead` wrappers, bespoke filter cards, or manual pagination bars outside `DataModuleController` is an architectural violation.
- **PERMITTED:** Consuming pages and features have full authority to pass data, columns, and custom functional elements via `children` slots (`<DataModuleController.Header>`, `<DataModuleController.Title>`, `<DataModuleController.Actions>`, `<DataModuleController.FilterBar>`, `<DataModuleController.SearchInput>`, `<DataModuleController.FilterSlot>`, `<DataModuleController.Content>`, `<DataModuleController.Table>`, `<DataModuleController.Footer>`). However, the enclosing layout, borders, paddings, and visual geometry remain immutable and governed solely by the controller.

#### 2. Standard Compound Structure:
```tsx
<DataModuleController
  title={labels.title}
  description={labels.description}
  data={data}
  columns={columns}
  total={total}
  page={page}
  limit={limit}
  totalPages={totalPages}
  isLoading={isLoading}
  isFetching={isFetching}
  searchPlaceholder={labels.searchPlaceholder}
  emptyMessage={labels.emptyMessage}
  emptyDescription={labels.emptyDescription}
  keyExtractor={(item) => item.id}
  onPageChange={setPage}
  onSearchChange={setSearch}
>
  <DataModuleController.Header>
    <DataModuleController.Title icon={<IconEntity size={18} />} badgeLabel="عنصر" />
    <DataModuleController.Actions>
      <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
        إضافة جديد
      </Button>
    </DataModuleController.Actions>
  </DataModuleController.Header>

  <DataModuleController.FilterBar>
    <DataModuleController.SearchInput placeholder={labels.searchPlaceholder} />
    <DataModuleController.FilterSlot>
      {/* Dropdown filters, custom selects, or refresh buttons */}
    </DataModuleController.FilterSlot>
    <DataModuleController.ResetButton />
  </DataModuleController.FilterBar>

  <DataModuleController.Content>
    <DataModuleController.Table />
  </DataModuleController.Content>

  <DataModuleController.Footer />
</DataModuleController>
```

#### 3. Multi-Row Selection & Document Export (`selectable`, `onSelect`, `exportValue`)
- **Row Selection (`selectable`):** When `selectable={true}` is set on `<DataModuleController />`:
  - A checkbox column is added automatically as the first column.
  - The table header contains an indeterminate "Select All" checkbox for all currently loaded rows on the page.
  - Row clicks on interactive targets (`<a>`, `<button>`, `input`) do not toggle selection (handled via `stopPropagation`).
  - Selection automatically clears on page change, search query change, filter update, limit change, or dataset change.
  - Selection state syncs seamlessly with `<AppModule />` when embedded inside `<AppModule.Table>`.
- **Exportable Columns (`exportValue`, `exportKind`):**
  - Table columns declare `exportValue: (row: T) => ReportCell` and `exportKind: ReportColumnKind` to define their representation in printed reports and exported Excel spreadsheets.
  - Non-data and UI-only columns (e.g. actions) omit `exportValue` and are automatically excluded from exports.
  - Numbers, monetary amounts (`{ amount, currency }`), dates, badges, and plain text retain their semantic typing for accurate formatting and totals.

#### 4. Unified AppModule Architecture & Floating Selection Bar
- **`<AppModule exportTitle="...">`:** Provides contextual report metadata, statistics (`<AppModule.Stats>`), charts (`<AppModule.Charts>`), and table embedding (`<AppModule.Table>`).
- **Floating Selection Bar (`AppModuleSelectionBar`):**
  - Appears automatically at the bottom of the screen when 1 or more rows are selected.
  - Displays selected row count, a "Deselect All" button, a "Print" button, and an "Excel Export" button.
  - **Print Flow:** Generates a unified `ReportDocument` via `buildSelectionDocument()`, saves it under a secure one-time session key in `localStorage`, and opens `/reports/selection/print?key=...`.
  - **Excel Flow:** Calls backend `POST /reports/render/excel` and triggers direct `.xlsx` file download.
  - **Zero Mixed Currencies:** Totals in selection documents are calculated strictly per currency without mixing.

#### 5. Strict Server-Side Statistics Rule ("الإحصائيات من السيرفر فقط")
- **PROHIBITED:** Computing KPI summary cards or chart datasets on the frontend by aggregating paginated table slices (`data.length`, `data.reduce(...)`) is **STRICTLY FORBIDDEN**. A paginated slice never represents the full institute dataset.
- **MANDATORY:** All statistics, KPI counters, and chart datasets must come directly from dedicated server overview endpoints (e.g. `GET /dashboard/overview`, `GET /fees/overdue/summary`).

---

---

## 7. Component Ownership, Boundaries & Reusability

1. **Strict Controller Architecture (No `src/components/ui/` Allowed):**
   - **CRITICAL PROHIBITION:** There is **NO** `src/components/ui/` directory in this platform. All shared, reusable, or presentation components across the platform **MUST** reside exclusively in `src/components/controllers/<name>/` following the Controller Separation Pattern (`init/`, `store/`, `ui/`, `<Name>Controller.tsx`, `index.ts`). Creating or adding a `src/components/ui/` folder is **STRICTLY FORBIDDEN**.
   - All modules (`date-picker`, `drawer`, `input`, `modal`, `data-module`, `layout`, `sidebar`, `stepper`) must be built as Controllers.
2. **Controller Hierarchy & Composition:**
   - A parent Controller may compose child Controllers (e.g. `LayoutController` composes `SidebarController`).
   - A parent Controller must **NOT** reach into or manage the internal state of child Controllers. Each Controller remains the sole owner of its state.
3. **Compound Components Policy:**
   - Do **NOT** use Compound Components when a single cohesive component suffices (avoid `Sidebar.Item`, `Sidebar.Section` when standard config objects work cleaner).
   - Use Compound Components **ONLY** when child components need flexible visual authoring by the consumer while sharing parent context (e.g. `Stepper` + `Stepper.Step`, `DataTable` + `DataTable.Column`).

---
