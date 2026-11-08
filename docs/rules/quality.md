# TypeScript and code quality

> Part of the rules contract (sections 8 of the former single `role.md`). Section numbers are kept so existing `role.md §N` references still resolve. Start from `core.md`.

---

## 8. TypeScript & Code Quality Standards

1. **Strict Typing:** Avoid `any` without exception. Use generics, mapped types, discriminated unions, and `unknown` with type guards.
2. **No Circular Dependencies:** Organize imports strictly: `core/` → `theme/` → `components/controllers/` → `app/`.
3. **Naming Conventions:**
   - Controllers: `<Name>Controller.tsx` (e.g., `SidebarController.tsx`, `LayoutController.tsx`)
   - Store & Mirror: `<name>.store.ts`, `use<Name>Mirror.ts`
   - State & Init: `<name>.state.ts`, `<name>.init.ts`
   - UI Variants: `Desktop<Name>.tsx`, `Mobile<Name>.tsx`, `<Name>Factory.tsx`
   - Hook: `use<Name>` (camelCase)

---
