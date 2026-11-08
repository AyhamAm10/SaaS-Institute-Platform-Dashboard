@AGENTS.md

# admin-dashboard

Next 16 + Mantine staff dashboard, Arabic RTL. Workspace context: `../CLAUDE.md`.

## Before any change

1. Read `docs/rules/core.md` (always), then only the topic files it points to for your task.
2. Read `../docs/INDEX.md` and the feature doc for the area you touch (`../docs/features/`). Shared UI components: `src/components/controllers/README.md`.
3. After the change, update that feature doc and the INDEX line.

## Essentials

- Zero `useState` / `useEffect` / queries in `ui/`; state in per-instance Zustand stores read through `use<X>Mirror`; queries only in `*QuerySync`.
- Files ≤ 150 lines; App controllers instead of raw Mantine; no hex colors; Arabic text only; no `any`.
- Verify with `npx tsc --noEmit`, `npm run lint` (0 errors), `npm test`, `npm run build`, and in the browser.
- Never `git commit` / `git push`.
