'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import type { ExamSheet } from '@/src/core/api';
import { entriesFrom, MarkEntry } from '../../../utils/exams.utils';

/**
 * MarkSheetState: the exam's mark sheet being edited. `entries` holds the
 * inputs per student; server data only replaces them while nothing is dirty.
 */
export interface MarkSheetState {
  sheet: ExamSheet | null;
  isLoading: boolean;
  entries: Record<number, MarkEntry>;
  dirty: boolean;
  isSaving: boolean;
  notice: { tone: 'success' | 'error'; text: string } | null;

  setMark: (studentId: number, mark: string) => void;
  toggleAbsent: (studentId: number) => void;
  setIsSaving: (value: boolean) => void;
  setNotice: (notice: MarkSheetState['notice']) => void;
  syncSheet: (sheet: ExamSheet | null, isLoading: boolean, force?: boolean) => void;
}

export type MarkSheetStore = ControllerStoreApi<MarkSheetState>;

export function createMarkSheetStore(): MarkSheetStore {
  return createControllerStore<MarkSheetState>((set) => ({
    sheet: null,
    isLoading: true,
    entries: {},
    dirty: false,
    isSaving: false,
    notice: null,

    setMark: (studentId, mark) =>
      set((s) => ({
        entries: {
          ...s.entries,
          [studentId]: { ...s.entries[studentId], mark },
        },
        dirty: true,
        notice: null,
      })),
    toggleAbsent: (studentId) =>
      set((s) => ({
        entries: {
          ...s.entries,
          [studentId]: {
            ...s.entries[studentId],
            absent: !s.entries[studentId]?.absent,
          },
        },
        dirty: true,
        notice: null,
      })),
    setIsSaving: (isSaving) => set({ isSaving }),
    setNotice: (notice) => set({ notice }),
    syncSheet: (sheet, isLoading, force = false) =>
      set((s) =>
        sheet && (!s.dirty || force)
          ? { sheet, isLoading, entries: entriesFrom(sheet), dirty: false }
          : { sheet: sheet ?? s.sheet, isLoading },
      ),
  }));
}

export const MarkSheetContext = createContext<MarkSheetStore | null>(null);

export function useMarkSheetMirror<K extends keyof MarkSheetState>(key: K): MarkSheetState[K] {
  const store = useContext(MarkSheetContext);
  if (!store) throw new Error('useMarkSheetMirror must be used within <MarkSheetController>.');
  return useStore(store, (state) => state[key]);
}
