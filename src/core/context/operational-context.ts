'use client';

import { create } from 'zustand';

/**
 * Operational context (role.md §3 / dashboard §9.J): the ONE place that holds
 * the active branch and academic year. The header picks them, the API client
 * sends them (`X-Branch-Id`, `X-Academic-Year-Id`), the server scopes every
 * list by them. Pages never choose a year or a branch themselves.
 *
 * The values are remembered per institute + user (`saas_ctx:<institute>:<user>:…`),
 * so another account in the same browser never inherits them.
 */

const LEGACY_KEYS = ['saas_active_branch_id', 'saas_active_academic_year_id'] as const;

const storageKey = (identity: string, field: 'branch' | 'year') => `saas_ctx:${identity}:${field}`;

function readNumber(key: string): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const n = Number(localStorage.getItem(key));
    return Number.isInteger(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

function writeNumber(key: string, value: number | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  } catch {
    // Storage blocked or full: the context still works for this tab
  }
}

/** Branch / year as the header menus list them. */
export interface ContextBranch {
  id: number;
  name: string;
}

export interface ContextYear {
  id: number;
  name: string;
  isCurrent: boolean;
}

interface OperationalContextState {
  /** `<instituteId>:<userId>` of the signed-in account, null before sign-in. */
  identity: string | null;
  activeBranchId: number | null;
  activeAcademicYearId: number | null;
  /** True once the branch / year were validated against the institute lists. */
  resolved: boolean;
  /** The institute lists (kept by the layout resolver; read by header / sidebar). */
  branches: ContextBranch[];
  years: ContextYear[];

  /** Switches to an account and restores ITS remembered context. */
  bindIdentity: (instituteId: number, userId: number) => void;
  setActiveBranchId: (id: number | null) => void;
  setActiveAcademicYearId: (id: number | null) => void;
  markResolved: () => void;
  setLists: (branches: ContextBranch[], years: ContextYear[]) => void;
  resetContext: () => void;
}

export const useOperationalContextStore = create<OperationalContextState>((set, get) => ({
  identity: null,
  activeBranchId: null,
  activeAcademicYearId: null,
  resolved: false,
  branches: [],
  years: [],

  bindIdentity: (instituteId, userId) => {
    const identity = `${instituteId}:${userId}`;
    if (get().identity === identity) return;
    if (typeof window !== 'undefined') {
      try {
        for (const key of LEGACY_KEYS) localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    set({
      identity,
      activeBranchId: readNumber(storageKey(identity, 'branch')),
      activeAcademicYearId: readNumber(storageKey(identity, 'year')),
      resolved: false,
    });
  },

  setActiveBranchId: (id) => {
    const { identity, activeBranchId } = get();
    if (id === activeBranchId) return;
    if (identity) writeNumber(storageKey(identity, 'branch'), id);
    set({ activeBranchId: id });
  },

  setActiveAcademicYearId: (id) => {
    const { identity, activeAcademicYearId } = get();
    if (id === activeAcademicYearId) return;
    if (identity) writeNumber(storageKey(identity, 'year'), id);
    set({ activeAcademicYearId: id });
  },

  markResolved: () => set({ resolved: true }),
  setLists: (branches, years) => set({ branches, years }),

  resetContext: () =>
    set({ identity: null, activeBranchId: null, activeAcademicYearId: null, resolved: false, branches: [], years: [] }),
}));

/** Synchronous accessor for non-React code (the Axios request interceptor). */
export function getActiveBranchId(): number | null {
  return useOperationalContextStore.getState().activeBranchId;
}

/** Synchronous accessor for non-React code (the Axios request interceptor). */
export function getActiveAcademicYearId(): number | null {
  return useOperationalContextStore.getState().activeAcademicYearId;
}

/** Hook for reading / changing the active branch and academic year. */
export function useOperationalContext() {
  const activeBranchId = useOperationalContextStore((s) => s.activeBranchId);
  const activeAcademicYearId = useOperationalContextStore((s) => s.activeAcademicYearId);
  const setActiveBranchId = useOperationalContextStore((s) => s.setActiveBranchId);
  const setActiveAcademicYearId = useOperationalContextStore((s) => s.setActiveAcademicYearId);
  const resetContext = useOperationalContextStore((s) => s.resetContext);
  return { activeBranchId, activeAcademicYearId, setActiveBranchId, setActiveAcademicYearId, resetContext };
}

/** True when pages may load data: the context is validated (or not needed). */
export function useContextReady(): boolean {
  return useOperationalContextStore((s) => s.resolved);
}
