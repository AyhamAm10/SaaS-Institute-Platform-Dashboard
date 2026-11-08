# App Controllers Catalog

Shared UI components of the dashboard. Pages compose these; they never style raw Mantine
(`TextInput`, `Select`, `Drawer`, `Modal`, `Button`, `ActionIcon`, `Badge`, `Tabs`, `Table`, `Paper`
for cards). ESLint errors on hex colors, `fw` above 600 and Mantine `Tabs` inside `src/app`.

- **Import path:** in `src/app` prefer the folder path, `@/src/components/controllers/<name>`
  (for example `.../controllers/drawer`, `.../controllers/input`). The barrel
  `@/src/components/controllers` re-exports everything and is also valid.
- **Folder layout / rules:** each folder is `init/ state/ store/ ui/` + root component (stateless
  primitives ship only `init/` + root). State is a per-instance Zustand store read through
  `use<X>Mirror`. Full rules: `docs/rules/core.md`, `docs/rules/ui-controllers.md`.
- **Theme:** colors/tones come from `src/theme` tokens (`--app-*`). Numbers and dates go through
  `src/core/format` (Latin digits). All UI text is Arabic.

## Catalog

| Component | Import | Use it for | Key props | Notes / gotchas |
|---|---|---|---|---|
| `AppInput` | `controllers/input` | Every text field | `type`: text, password, number, email, tel, search, url, textarea, select; `label`, `description`, `error`, `placeholder`, `value`, `onChange`, `required`, `disabled`, `readOnly`, `leftSection`, `rightSection`, `size`, `rows` (textarea), `min`/`max`/`step` (number) | `onChange` gets a DOM event for text types: unwrap with `inputText(e)` from `@/src/core/format`. Auto LTR for tel/email/password/number/url, RTL otherwise. Default icons for tel/email/search/password. Unknown props are forwarded to Mantine. |
| `AppSelect` | `controllers/input` | Dropdowns | `data` (string[] or Mantine data), `value`, `onChange(value, option)`, `searchable`, `clearable`, `nothingFoundMessage`, `label`, `required` | Same component as `AppInput` with `type="select"` (no `type` prop). Passing `data` to `AppInput` also yields a select. There is no `select/` folder. `onChange` receives the value (`string \| null`), not an event. |
| `AppDatePicker` | `controllers/date-picker` | Every date field | `value` (ISO string or Date), `onChange(value: string \| null)`, `minDate`, `maxDate`, `label`, `required`, `clearable`, `dropdownType`: popover, modal | Emits ISO `YYYY-MM-DD`. Arabic locale. Exported name is `DatePickerController` / `AppDatePicker` (see docs/rules 5.2). |
| `AppDrawer` | `controllers/drawer` | Side sheets: create/edit forms, detail views | `opened`, `onClose`, `size` (default `md`), `position` (default `right`), `loading`, `title`, `description`, `icon` (simple mode) | Compound: `.Header`, `.Icon`, `.Title`, `.Description`, `.Actions`, `.Close`, `.Toolbar`, `.Content`, `.Section` (`title`), `.SectionHeader`, `.Details`, `.Detail`, `.Footer`, `.FooterStart`, `.FooterEnd`, `.Cancel`, `.Submit`. No feature logic or API calls inside. Forms use `<form id>` + submit button `form="id"` in the footer. |
| `AppModal` | `controllers/modal` | Confirmations, warnings, compact forms | `opened`, `onClose`, `variant`: default, danger, warning, info, success; `size` (default `md`), `centered` (default true), `loading`, `title`, `description`, `icon` | Compound: `.Header`, `.Icon`, `.Title`, `.Description`, `.Actions`, `.Close`, `.Content`, `.Footer`, `.FooterStart`, `.FooterEnd`, `.Cancel`, `.Confirm`. Deep or multi-section work belongs in `AppDrawer`. |
| `DeleteConfirmationModal` | `controllers/modal` | Ready-made delete confirm | `opened`, `onClose`, `onConfirm`, `itemName`, `title`, `description`, `warningMessage`, `confirmLabel`, `cancelLabel`, `isLoading` | Zero boilerplate; prefer it over hand-built danger modals. |
| `DataModuleController` | `controllers/data-module` | Every table / list with search, filters, pagination | `title`, `description`, `data`, `columns`, `total`, `page`, `limit`, `totalPages`, `isLoading`, `isFetching`, `keyExtractor`, `searchPlaceholder`, `emptyMessage`, `emptyDescription`, `selectable`, `onSelect`, `onPageChange`, `onLimitChange`, `onSearchChange`, `onSortChange`, `onFilterChange` | Compound: `.Header`, `.Title`, `.Actions`, `.FilterBar`, `.SearchInput`, `.FilterSlot`, `.ResetButton`, `.Content`, `.Table`, `.Footer` (also `.Pagination`, `.Empty`, `.Loading`). Column (`DataModuleColumn<T>`): `key`, `title`, `width`, `align`: left, center, right; `sortable`, `render(row, index)`, `exportValue(row)`, `exportKind`. Controller owns all layout: never wrap it in your own Card/Paper. Columns without `exportValue` are excluded from export. Wrap in `AppModule.Table` for the selection bar. |
| `AppModule` | `controllers/app-module` | Page shell for stats + charts + table with print/Excel export | `exportTitle`, `className` | Compound: `.Header`, `.Stats`, `.Charts`, `.Table`, `.Content`. Selecting rows in the nested `DataModuleController` shows the floating print / Excel bar. KPIs and chart data must come from server overview endpoints, never aggregated from a table page. |
| `AppButton` | `controllers/button` | Every action button | `variant`: primary, accent, outline, ghost, danger, dangerSolid; `href` (renders a Next link); plus Mantine `ButtonProps` (`size`, `loading`, `leftSection`, `disabled`, `fullWidth`) and native `type`, `form`, `onClick` | `variant` default `primary` (ink). `accent` (orange) is rare. `dangerSolid` for destructive confirm. Do not pass `color`. |
| `AppIconButton` | `controllers/button` | Icon-only actions | `variant`: default, ghost, brand, danger, primary; `size`: xs, sm, md, lg (28/32/36/42 px) | Always give it an accessible label (`aria-label`). Plus Mantine ActionIcon props. |
| `StatusBadge` | `controllers/badge` | Every status / pill | `children`, `tone`: brand, success, danger, warning, info, neutral, ink; `variant`: soft, outline, dot, solid; `size`: xs, sm, md; `icon` | Choose by meaning (`tone`), never a raw color. Defaults: tone neutral, variant soft, size sm. |
| `AppTabs` | `controllers/tabs` | Every tab switch | `items: { value, label, icon?, count?, disabled? }[]`, `value`, `defaultValue`, `onChange(value)`, `size`: xs, sm, md; `fullWidth` | Compound: `.List`, `.Panel` (matching `value`). Never use Mantine `Tabs` in `src/app`. |
| `AppPageHeader` | `controllers/page-header` | Page title outside DataModule | `title`, `description`, `icon`, `badge`, `actions`, `breadcrumbs: { label, href? }[]`, `withBreadcrumbs` | Breadcrumbs hidden by default (sidebar shows location). |
| `AppSurface` | `controllers/surface` | Every card / panel / nested block | `level`: 1, 2, 3 (default 2); `tone`: glass, subtle, brand; `radius`: md, lg, xl; `padding`, `interactive`, `onClick` | Level 1 = toolbars/nested, 2 = card, 3 = floating overlays. `subtle` and `brand` ignore `level` background. |
| `AppEmptyState` | `controllers/empty-state` | Empty lists / no-result blocks | `title`, `description`, `icon`, `action`, `compact` | Inside tables use `emptyMessage` on DataModule instead. |
| `IconTile` | `controllers/info-tile` | Raised icon square | `children`, `tone`: brand, ink, neutral, success, danger; `size` (default 44) | |
| `InfoTile` | `controllers/info-tile` | Small label + value metric | `label`, `value`, `icon`, `hint`, `tone`: brand, ink, neutral, success, danger | |
| `DetailList` | `controllers/info-tile` | Label/value grid | `items: { label, value, icon? }[]`, `columns`: 1, 2, 3 | 1 column on mobile always. |
| `StatCard` | `controllers/stats` | KPI card | `variant`: default, elevated, glass (default glass) | Compound: `.Icon` (`tone`: brand, ink), `.Title`, `.Content`, `.Progress` (`value`, `label`, `tone`: brand, ink), `.Action`. |
| `ChartCard` | `controllers/charts` | Chart container with period tabs | `title`, `subtitle`, `periods`, `activePeriod`, `onPeriodChange` | Compound: `.Header`, `.Tabs`, `.Bar` (data `{ label, value, highlight?, tooltipBadge?, secondaryValue? }[]`), `.Circle` (segments `{ label, value, color? }[]`). Default periods are Arabic daily / weekly / monthly. |
| `AppStepper` | `controllers/stepper` | Multi-step wizard with sidebar | `active`, `defaultStep`, `onStepChange`, `onStepClick`, `allowStepSelect`, `onBeforeNext`, `onBeforePrev` (may return a Promise), `sidebarWidth` (default 340) | Compound: `.Sidebar`, `.Step` (`step` index) with `.Step.Header` and `.Step.Content`, `.Actions` (`onSubmit`). Step list type is `StepConfig { step, label, description?, icon? }`. |
| `AppAmbient` | `controllers/ambient` | Animated blob background | `variant`: dashboard, login; `intensity`: soft, normal, vivid | Mounted once by the dashboard layout and login; pages do not add it. |
| `LayoutController` | `controllers/layout` | Dashboard shell (sidebar + permission gate) | `sidebarProps`, `children` | Mounted by the dashboard layout only. Filters navigation by permissions; shows a no-permission view. |
| `SidebarController` | `controllers/sidebar` | Navigation sidebar (desktop + mobile drawer) | `items` (navigation config), `children` | Composed by `LayoutController`; menu config lives in `sidebar/init/navigation`. Not for page code. |
| `LoginController` | `controllers/login` | Login screen | `LoginInitialProps` | Handles redirect and auth cache invalidation itself. Used by the login route only. |
| `AppReport` | `controllers/report` | Printable report document | `document`, `institute`, `variant`: screen, print; `verifyOrigin` | Uses fixed paper colors (`REPORT_PAPER`) on purpose, for print. Also exports `ReportMenu`, `useQrDataUri`, report formatters. |

## Patterns

Form field (inside a store-driven form, text unwrapped with `inputText`):

```tsx
import { AppInput } from '@/src/components/controllers/input';
import { inputText } from '@/src/core/format';

<AppInput
  type="tel"
  label={branchesLabels.phoneLabel}
  value={formPhone}
  onChange={(e) => setFormField('formPhone', inputText(e))}
/>
```

Table (from `branches/ui/BranchesView.tsx`; the `columns` array comes from a `useMemo` factory):

```tsx
<AppModule exportTitle="الفروع">
  <AppModule.Table>
    <DataModuleController
      title={labels.title} data={rows} columns={columns} total={rows.length}
      page={1} limit={10} totalPages={1} isLoading={isLoading}
      keyExtractor={(item: Branch) => item.id} onSearchChange={setSearch} selectable
    >
      <DataModuleController.Header>
        <DataModuleController.Title />
        <DataModuleController.Actions>
          <AppButton leftSection={<IconPlus size={16} />} onClick={openCreate}>إضافة</AppButton>
        </DataModuleController.Actions>
      </DataModuleController.Header>
      <DataModuleController.FilterBar><DataModuleController.SearchInput /></DataModuleController.FilterBar>
      <DataModuleController.Content><DataModuleController.Table /></DataModuleController.Content>
      <DataModuleController.Footer />
    </DataModuleController>
  </AppModule.Table>
</AppModule>
```

Drawer (from `branches/ui/BranchDrawer.tsx`):

```tsx
<AppDrawer opened={isDrawerOpen} onClose={closeDrawer} size="md">
  <AppDrawer.Header>
    <AppDrawer.Icon icon={<IconBuildingCommunity size={20} />} color="teal" />
    <AppDrawer.Title>{title}</AppDrawer.Title>
  </AppDrawer.Header>
  <AppDrawer.Content>
    <form id="branch-form" onSubmit={handleSubmit}>
      <AppDrawer.Section title="البيانات الأساسية">{/* AppInput fields */}</AppDrawer.Section>
    </form>
  </AppDrawer.Content>
  <AppDrawer.Footer>
    <AppButton variant="ghost" onClick={closeDrawer}>إلغاء</AppButton>
    <AppButton type="submit" form="branch-form" loading={isSubmitting}>حفظ</AppButton>
  </AppDrawer.Footer>
</AppDrawer>
```
