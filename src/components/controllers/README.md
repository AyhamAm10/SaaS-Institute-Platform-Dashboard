# Controller Component Architecture Guide

> **Binding Architectural Standard for UI Controllers**  
> Location: `src/components/controllers/`  
> Governed by: [role.md](../../../role.md)

---

## 1. Architectural Philosophy

A **Controller Component** in this platform is not merely a single React component file. It is a self-contained, enterprise-grade module responsible for orchestrating **initialization, isolated state management, declarative compound composition, and Mantine-only visual presentation**.

### Core Tenets

1. **Per-Instance State Isolation (Mandatory):**  
   Every Controller instance MUST create its own isolated Zustand store via `createControllerStore` from `@/src/core/mirror`. Global Zustand singletons for controller state are strictly prohibited. Multiple instances of a controller on the same screen (e.g. multiple Modals, Drawers, Inputs, or Steppers) will never bleed state into one another.

2. **Decoupled 4-Layer Separation:**  
   Code is organized into 4 distinct, immutable layers:
   - `init/` — Parameter derivation and config resolution.
   - `state/` — Domain state schema and initial state factory.
   - `store/` — Per-instance Zustand store, React Context bridge, and typed `useMirror` hook.
   - `ui/` — Pure presentation components utilizing Mantine primitives only.

3. **Compound Component Composition:**  
   Controllers expose a clean, highly composable Compound API (e.g., `AppStepper.Step`, `AppStepper.Step.Header`, `AppStepper.Step.Content`, `AppStepper.Actions`). All sub-components accept `children` and consume state reactively via `useMirror`.

4. **Mantine-Only UI Foundation:**  
   Raw HTML elements (`<div />`, `<button />`, `<span />`) are strictly forbidden. All layout, styling, and interactions must use Mantine primitives (`Box`, `Group`, `Stack`, `Flex`, `Collapse`, `Paper`, `Button`, `Text`, etc.).

---

## 2. Directory & File Structure

Every controller inside `src/components/controllers/<name>/` must follow this standard directory layout:

```text
src/components/controllers/<component-name>/
├── init/
│   ├── <name>.init.ts          # Props interfaces & configuration resolvers
│   └── index.ts
├── state/
│   ├── <name>.state.ts         # ControllerState schema & initial state factory
│   └── index.ts
├── store/
│   ├── <name>.store.ts         # Per-instance Zustand store & React Context
│   ├── use<Name>Mirror.ts      # Typed useMirror & useMirrorSelector hooks
│   └── index.ts
├── ui/
│   ├── <SubComponent1>.tsx     # Presentation subcomponents
│   ├── <SubComponent2>.tsx
│   └── index.ts
├── App<Name>.tsx               # Root Controller entry point (provides store & compounds)
└── index.ts                    # Public export barrel
```

---

## 3. Layer Responsibilities & Implementation Rules

### Layer 1: `init/` (Runtime Bootstrap & Configuration)

- **File:** `init/<name>.init.ts`
- **Responsibility:** Defines the external component props interface (`App<Name>InitialProps`) and normalizes/defaults incoming props into a typed runtime configuration (`Resolved<Name>Config`).
- **Rules:**
  - MUST contain pure functions only (`resolve<Name>Config`).
  - NO React hooks, NO state, NO DOM manipulation, NO API calls.

```ts
// Example: init/stepper.init.ts
export interface AppStepperInitialProps {
  active?: number;
  defaultStep?: number;
  allowStepSelect?: boolean;
  onStepChange?: (step: number) => void;
  children?: ReactNode;
}

export interface ResolvedStepperConfig {
  allowStepSelect: boolean;
  sidebarWidth: number;
}

export function resolveStepperConfig(props: AppStepperInitialProps): ResolvedStepperConfig {
  return {
    allowStepSelect: props.allowStepSelect ?? false,
    sidebarWidth: 280,
  };
}
```

---

### Layer 2: `state/` (Domain State & Actions Schema)

- **File:** `state/<name>.state.ts`
- **Responsibility:** Defines the complete runtime state interface extending `ControllerState` from `@/src/core/mirror/types`, and provides the initial state factory function.
- **Rules:**
  - Must explicitly type all state properties and action functions.
  - Initial factory (`createInitial<Name>State`) must populate defaults cleanly without side-effects.

```ts
// Example: state/stepper.state.ts
import { ControllerState } from '@/src/core/mirror/types';

export interface StepperState extends ControllerState {
  // Domain State
  active: number;
  totalSteps: number;
  isControlled: boolean;
  config: ResolvedStepperConfig;
  rawProps: AppStepperInitialProps;

  // Actions
  setActive: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProps: (props: AppStepperInitialProps) => void;
}
```

---

### Layer 3: `store/` (Isolated Zustand Store & Mirror Hook)

- **Files:** `store/<name>.store.ts` & `store/use<Name>Mirror.ts`
- **Responsibility:**
  1. Creates an isolated vanilla Zustand store per component mount using `createControllerStore` from `@/src/core/mirror`.
  2. Creates a React Context to distribute the store instance downward.
  3. Provides `use<Name>Mirror(key)` for selective, zero-overhead re-rendering.
- **Rules:**
  - Never export a global store singleton.
  - Always use `createControllerStore<State>((set, get) => ({ ... }))`.
  - Always throw a descriptive error if `use<Name>Store` is used outside its Provider.

```ts
// Example: store/stepper.store.ts
import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { StepperState, createInitialStepperState } from '../state/stepper.state';

export type StepperStore = ControllerStoreApi<StepperState>;

export function createStepperStore(initialProps: AppStepperInitialProps): StepperStore {
  const initial = createInitialStepperState(initialProps);

  return createControllerStore<StepperState>((set, get) => ({
    ...initial,

    setActive: (step: number) => {
      set({ active: step });
      get().rawProps.onStepChange?.(step);
    },

    nextStep: () => {
      const current = get().active;
      if (current < get().totalSteps - 1) {
        get().setActive(current + 1);
      }
    },

    prevStep: () => {
      const current = get().active;
      if (current > 0) {
        get().setActive(current - 1);
      }
    },

    updateProps: (props: AppStepperInitialProps) => {
      set({
        rawProps: props,
        active: props.active !== undefined ? props.active : get().active,
      });
    },
  }));
}

export const StepperContext = createContext<StepperStore | null>(null);

export function useStepperStore(): StepperStore {
  const store = useContext(StepperContext);
  if (!store) {
    throw new Error('useStepperStore must be used within an <AppStepper> component hierarchy.');
  }
  return store;
}
```

```ts
// Example: store/useStepperMirror.ts
import { useStore } from 'zustand';
import { useStepperStore } from './stepper.store';
import { StepperState } from '../state/stepper.state';

export function useStepperMirror<K extends keyof StepperState>(key: K): StepperState[K] {
  const store = useStepperStore();
  return useStore(store, (state) => state[key]);
}

export function useStepperMirrorSelector<TSelected>(
  selector: (state: StepperState) => TSelected,
): TSelected {
  const store = useStepperStore();
  return useStore(store, selector);
}
```

---

### Layer 4: `ui/` (Pure Mantine Presentation Layer)

- **Directory:** `ui/`
- **Responsibility:** Renders the visual structure, layout, and animations strictly using Mantine components.
- **Rules:**
  - Consume state ONLY via `use<Name>Mirror('key')` or `use<Name>MirrorSelector`.
  - No direct prop drilling of internal controller state.
  - Sub-components must accept `children` and `className` / style props when appropriate.
  - Animations must use Mantine's `<Collapse>` or `<Transition>`.

---

### Layer 5: Root Controller (`App<Name>.tsx`)

- **File:** `App<Name>.tsx`
- **Responsibility:**
  1. Instantiates the store instance once per component lifecycle using:
     ```ts
     const [store] = useState(() => createStepperStore(props));
     ```
  2. Keeps external controlled props synchronized via `useEffect`:
     ```ts
     useEffect(() => {
       store.getState().updateProps(props);
     }, [props.active, props.allowStepSelect, ...]);
     ```
  3. Provides the store instance via `<Context.Provider value={store}>`.
  4. Attaches compound sub-components to the main export (e.g., `AppStepper.Step = AppStepperStep`).

---

## 4. Strict Prohibitions & Anti-Patterns

| Anti-Pattern | Why It Is Forbidden | Mandatory Correction |
|---|---|---|
| **Global Zustand Singleton** | State bleeds across multiple instances of the component on the same or different routes. | Always use `useState(() => createControllerStore(props))` and distribute via React Context. |
| **Raw HTML tags (`<div />`, `<button />`, etc.)** | Violates design system unification and accessibility guidelines. | Use Mantine primitives (`Box`, `Group`, `Stack`, `Paper`, `Button`, `Collapse`, etc.). |
| **Prop Drilling Internal State** | Couples parent and child tightly, triggers unnecessary re-renders. | Child components subscribe to the slice they need via `useMirror('key')`. |
| **Plain React Context without Zustand** | Context re-renders the entire tree on every state update, degrading performance. | Use Zustand vanilla store inside Context; components use `useStore` with selectors. |
| **Bypassing the 4 Layers** | Leads to monolithic, untestable, unmaintainable components. | Always adhere to `init/`, `state/`, `store/`, and `ui/`. |

---

## 5. Compound Pattern Standard

Compound components must be attached directly to the main Controller export:

```tsx
// Attachment in AppStepper.tsx
AppStepper.Step = AppStepperStep;
AppStepper.Step.Header = AppStepperStepHeader;
AppStepper.Step.Content = AppStepperStepContent;
AppStepper.Actions = AppStepperActions;

// Public Usage in Application:
<AppStepper>
  <AppStepper.Step step={0}>
    <AppStepper.Step.Header>
      <Title order={4}>بيانات العائلة</Title>
    </AppStepper.Step.Header>
    <AppStepper.Step.Content>
      <FamilyForm />
    </AppStepper.Step.Content>
  </AppStepper.Step>
  <AppStepper.Actions onSubmit={handleSubmit} />
</AppStepper>
```
