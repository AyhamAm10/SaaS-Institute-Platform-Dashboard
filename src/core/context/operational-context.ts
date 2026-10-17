'use client';

import { create } from 'zustand';

const STORAGE_KEYS = {
  BRANCH_ID: 'saas_active_branch_id',
  ACADEMIC_YEAR_ID: 'saas_active_academic_year_id',
} as const;

interface OperationalContextState {
  activeBranchId: number | null;
  activeAcademicYearId: number | null;
  setActiveBranchId: (id: number | null) => void;
  setActiveAcademicYearId: (id: number | null) => void;
  resetContext: () => void;
}

function getInitialNumberFromStorage(key: string): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const num = Number(raw);
    return !isNaN(num) && num > 0 ? num : null;
  } catch {
    return null;
  }
}

function setStorageItem(key: string, value: number | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, String(value));
    }
  } catch {
    // Ignore storage quota or permission errors
  }
}

/**
 * Global operational context store managing active geographic branch and academic year.
 * Used across the dashboard and intercepted into outgoing HTTP requests via apiClient.
 */
export const useOperationalContextStore = create<OperationalContextState>((set) => ({
  activeBranchId: getInitialNumberFromStorage(STORAGE_KEYS.BRANCH_ID),
  activeAcademicYearId: getInitialNumberFromStorage(STORAGE_KEYS.ACADEMIC_YEAR_ID),

  setActiveBranchId: (id: number | null) => {
    setStorageItem(STORAGE_KEYS.BRANCH_ID, id);
    set({ activeBranchId: id });
  },

  setActiveAcademicYearId: (id: number | null) => {
    setStorageItem(STORAGE_KEYS.ACADEMIC_YEAR_ID, id);
    set({ activeAcademicYearId: id });
  },

  resetContext: () => {
    setStorageItem(STORAGE_KEYS.BRANCH_ID, null);
    setStorageItem(STORAGE_KEYS.ACADEMIC_YEAR_ID, null);
    set({ activeBranchId: null, activeAcademicYearId: null });
  },
}));

/**
 * Synchronous accessor for non-React code (e.g. Axios request interceptors).
 */
export function getActiveBranchId(): number | null {
  const stateVal = useOperationalContextStore.getState().activeBranchId;
  if (stateVal !== null) return stateVal;
  return getInitialNumberFromStorage(STORAGE_KEYS.BRANCH_ID);
}

/**
 * Synchronous accessor for non-React code (e.g. Axios request interceptors).
 */
export function getActiveAcademicYearId(): number | null {
  const stateVal = useOperationalContextStore.getState().activeAcademicYearId;
  if (stateVal !== null) return stateVal;
  return getInitialNumberFromStorage(STORAGE_KEYS.ACADEMIC_YEAR_ID);
}

/**
 * Hook for consuming and modifying active operational dimensions in components.
 */
export function useOperationalContext() {
  const activeBranchId = useOperationalContextStore((s) => s.activeBranchId);
  const activeAcademicYearId = useOperationalContextStore((s) => s.activeAcademicYearId);
  const setActiveBranchId = useOperationalContextStore((s) => s.setActiveBranchId);
  const setActiveAcademicYearId = useOperationalContextStore((s) => s.setActiveAcademicYearId);
  const resetContext = useOperationalContextStore((s) => s.resetContext);

  return {
    activeBranchId,
    activeAcademicYearId,
    setActiveBranchId,
    setActiveAcademicYearId,
    resetContext,
  };
}
