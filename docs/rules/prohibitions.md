# Absolute prohibitions (red lines)

> Part of the rules contract (sections 12 of the former single `role.md`). Section numbers are kept so existing `role.md §N` references still resolve. Start from `core.md`.

---

## 12. ABSOLUTE PROHIBITIONS — Red Lines (Mandatory)

> **These rules are NON-NEGOTIABLE.** Violating any of them is considered a critical architectural defect that MUST be corrected immediately. No exceptions, no shortcuts, no "just this once."

### 12.1 State & Logic Separation (Zero useState in UI)

> **ABSOLUTE RULE:** Presentational components inside `ui/` (views, drawers, modals, forms, tables) MUST have **ZERO `useState` for form fields, server errors, feedback messages, or domain entities**, and **ZERO `useMutation`/`useQuery` hooks**. All such state belongs strictly to the `state/` and `store/` layers and is accessed in `ui/` exclusively via `useMirror`.

| ❌ STRICTLY FORBIDDEN IN `ui/` | ✅ MANDATORY ARCHITECTURE |
|---|---|
| Declaring `useState('')` for form inputs (`name`, `code`, `description`, etc.) inside a Drawer/Modal | Put form fields in `state/<feature>.state.ts` and `store/<feature>.store.ts`; read & update via `use<Feature>Mirror` |
| Declaring `useState<string \| null>(null)` for errors/success messages | Define `error` and `success` slots in the Zustand store; set them from the Controller's mutation callbacks |
| Calling `useCreate...Mutation()` or `useDelete...Mutation()` directly inside UI components | Call React Query mutations ONLY inside `<Feature>Controller.tsx`; pass callbacks or call store actions |
| Defining async mutation/network orchestration inside UI `onSubmit` | UI only dispatches `await onSubmit()` or calls a callback from props; Controller coordinates API + store |
| Using `useEffect` inside UI to fetch or synchronize server state | Data synchronization is the sole responsibility of `QuerySync` in `<Feature>Controller.tsx` |

#### Concrete Architecture Comparison Example:

##### ❌ VIOLATION (Anti-Pattern — Disallowed):
```tsx
// ❌ DO NOT DO THIS: UI component declaring local form state, errors, and mutations directly
export function AcademicBranchesDrawer({ opened, onClose }: Props) {
  const createMutation = useCreateAcademicBranchMutation(); // ❌ FORBIDDEN in UI
  const [name, setName] = useState('');                      // ❌ FORBIDDEN in UI
  const [code, setCode] = useState('');                      // ❌ FORBIDDEN in UI
  const [error, setError] = useState<string | null>(null);   // ❌ FORBIDDEN in UI

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({ name, code });      // ❌ Business logic in UI
    } catch (err) {
      setError(err.message);
    }
  };
  return <AppDrawer>...</AppDrawer>;
}
```

##### ✅ REQUIRED ARCHITECTURE (Compliant with role.md):
```tsx
// 1. In state/<feature>.state.ts:
export interface FeatureState {
  branchForm: { name: string; code: string; description: string };
  branchError: string | null;
  branchSuccess: string | null;
  branchSubmitting: boolean;
  setBranchFormField: (field: string, value: string) => void;
  // ...
}

// 2. In store/<feature>.store.ts:
export function createFeatureStore() {
  return createControllerStore<FeatureState>((set) => ({
    branchForm: { name: '', code: '', description: '' },
    branchError: null,
    branchSuccess: null,
    branchSubmitting: false,
    setBranchFormField: (field, value) => set((s) => ({
      branchForm: { ...s.branchForm, [field]: value }
    })),
    // ...
  }));
}

// 3. In FeatureController.tsx:
const createMutation = useCreateAcademicBranchMutation();
const handleBranchCreate = useCallback(async () => {
  const { branchForm } = store.getState();
  store.getState().setBranchSubmitting(true);
  try {
    await createMutation.mutateAsync(branchForm);
    store.getState().resetBranchForm();
  } catch (err: any) {
    store.getState().setBranchError(err.message);
  } finally {
    store.getState().setBranchSubmitting(false);
  }
}, [store, createMutation]);

// 4. In ui/AcademicBranchesDrawer.tsx (Pure Presentation, ZERO useState):
export function AcademicBranchesDrawer({ opened, onClose, onCreate }: Props) {
  const branchForm = useSectionsMirror('branchForm');
  const setBranchFormField = useSectionsMirror('setBranchFormField');
  const branchError = useSectionsMirror('branchError');
  const branchSubmitting = useSectionsMirror('branchSubmitting');

  return (
    <AppDrawer opened={opened} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); onCreate(); }}>
        <AppInput
          value={branchForm.name}
          onChange={(e) => setBranchFormField('name', e.target.value)}
        />
        <Button loading={branchSubmitting} type="submit">إضافة</Button>
      </form>
    </AppDrawer>
  );
}
```

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
| Creating a `src/components/ui/` folder | All components must reside strictly in `src/components/controllers/<name>/` with `init/`, `store/`, `ui/`, `<Name>Controller.tsx` |
| Using raw HTML elements (`<div>`, `<span>`, `<button>`, `<input>`) for UI structure | Use Mantine components (`Box`, `Group`, `Stack`, `Button`, `Text`, etc.) |
| Using raw Mantine input primitives (`TextInput`, `PasswordInput`, `NumberInput`) directly | Use `<AppInput />` from `@/src/components/controllers/input` |
| Using ad-hoc date pickers or raw browser inputs | Use `<AppDatePicker />` from `@/src/components/controllers/date-picker` |
| Creating custom table wrappers, bespoke Card/Paper containers, or manual Thead styling for entity tables | Use `<DataModuleController>` compound pattern exclusively as the sole source of layout and design truth |
| Controlling table or list layout, paddings, or borders from outside the controller component | Layout is 100% owned by the controller; page views only provide children slots and columns |
| Hardcoding hex/rgb colors in components | Use theme tokens (`c="primary.6"`, `bg="var(--mantine-color-body)"`) |
| Using non-Arabic text in user-facing UI | All UI text MUST be in professional Arabic |

### 12.5 Quick Self-Check Before Committing Code

Before finalizing any page or component, ask yourself:

1. ✅ Does `render-ui.tsx` contain ONLY `<Controller />`?
2. ✅ Does the UI component have ZERO `useState` for form fields, server errors, or entity state?
3. ✅ Do all UI components read state via `useMirror` hooks?
4. ✅ Are React Query hooks ONLY in the Controller/QuerySync?
5. ✅ Are mutation callbacks and try/catch orchestration in the Controller?
6. ✅ Is column/table definition separated from business logic?
7. ✅ Are modals/drawers state managed in the store, not in UI components?
8. ✅ Does every entity list/table view use `<DataModuleController>` without ad-hoc outer Card/Thead/Paper layout wrappers?
9. ✅ Are all shared components housed in `src/components/controllers/` with ZERO `src/components/ui/` folders?

If **ANY** answer is "No", the code violates these rules and MUST be refactored before proceeding.
