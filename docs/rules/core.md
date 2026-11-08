# Dashboard core rules (read this first, always)

> Short entry to the frontend constitution. Full text is split by topic in this folder; read a topic file only when your task touches it. Section numbers (`§N`) match the old single `role.md`.

**Stack**: Next 16 (App Router; NOT the Next you know — see `AGENTS.md`), React, Mantine 9, TanStack Query 5, Zustand (per-instance), axios, Arabic-first RTL.

## Commands

| Task | Command |
|---|---|
| Dev / build | `npm run dev` / `npm run build` |
| Lint / types / tests | `npm run lint` (must be 0 errors) / `npx tsc --noEmit` / `npm test` |
| Format | `npx prettier --write <files> --single-quote --print-width 120 --trailing-comma all` |

## Page shape (§9)

```text
app/(dashboard)/<page>/
  page.tsx            Server Component, NO 'use client'
  render-ui.tsx       thin wrapper: renders <XController /> only
  XController.tsx     provides per-instance store; owns mutations
  XQuerySync.tsx      the ONLY place with query hooks (+ effects syncing server data into the store)
  use*Actions.ts      mutation hooks (called from the controller)
  state/  store/      state schema + createControllerStore, use<X>Mirror
  ui/                 pure presentation, reads/writes via use<X>Mirror
  utils/ static-data/ pure helpers / constants (Arabic labels)
```

## The red lines (§12 — full text in `prohibitions.md`)

1. `ui/` has ZERO `useState`, `useEffect`, `useQuery`, `useMutation`. State = store; reads = `use<X>Mirror`.
2. Every file ≤ 150 lines, one responsibility. Split by concern, not by size alone.
3. Use the App controllers, never raw Mantine primitives: `AppButton`, `AppIconButton`, `StatusBadge`, `AppInput` (values via `inputText(e)`), `AppSelect`, `AppDatePicker`, `AppDrawer`, `AppModal`, `AppTabs`, `AppPageHeader`, `DataModuleController`, `AppModule`. Tables/lists: `DataModuleController` only.
4. No hex/rgb colors; use theme tokens / `--app-*` CSS variables.
5. All user-facing text in professional Arabic; API errors via `getApiErrorMessage`.
6. No `any`; no global Zustand singletons for page state; no prop drilling beyond one level.
7. Statistics come from the server, never computed from the current page of a table (§5.5).
8. **Never `git commit` / `git push`.** The owner publishes.

## Self-check before finishing (§12.5)

`render-ui.tsx` only renders the controller? `ui/` free of state/effects/queries? Queries only in `*QuerySync`? Mutations only in the controller / `use*Actions`? Lists use `DataModuleController`? Then run `tsc`, `lint`, `npm test`, `build`, and verify in the browser.

## Topic map — read only what the task touches

| If the task involves… | Read |
|---|---|
| Controller pattern, layers, per-instance stores, mirrors (§1–4) | `architecture.md` |
| Inputs, selects, date pickers, drawers, modals, tables, stats, component ownership (§5, 7) | `ui-controllers.md` |
| Theme/branding, Arabic RTL, visual style (§6, 10, 11) | `theme-design.md` |
| New page/route, settings hub, nested controllers, context (§9) | `pages.md` |
| TypeScript standards (§8) | `quality.md` |
| Red lines with examples (§12) | `prohibitions.md` |

## Where to learn what already exists

Do not scan `src/` to discover features. Start at the workspace `docs/INDEX.md`, then the feature doc under `docs/features/`. Shared App controllers: `src/components/controllers/README.md`.
