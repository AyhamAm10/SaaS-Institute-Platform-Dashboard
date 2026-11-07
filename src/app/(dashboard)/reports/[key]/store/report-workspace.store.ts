'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import type { ControllerStoreApi } from '@/src/core/mirror/types';
import type { ReportWorkspaceState } from '../state/report-workspace.state';
import { missingRequired, toReportParams, type ReportForm } from '../../utils/reports.utils';

export type ReportWorkspaceStore = ControllerStoreApi<ReportWorkspaceState>;

/** Isolated store of one report workspace (role.md §3). */
export function createReportWorkspaceStore(reportKey: string, initialForm: ReportForm): ReportWorkspaceStore {
  return createControllerStore<ReportWorkspaceState>((set, get) => ({
    reportKey,
    definition: null,
    catalogLoading: true,
    form: initialForm,
    missing: [],
    submitted: null,
    document: null,
    isBuilding: false,
    buildError: null,
    options: { sections: [], exams: [], teachers: [], students: [] },
    studentSearch: '',
    selectedStudent: null,
    isExporting: false,
    exportError: null,

    setField: (kind, value) =>
      set((s) => ({
        form: {
          ...s.form,
          [kind]: value,
          // A new section changes its exams
          ...(kind === 'section' && { exam: null }),
        },
        missing: s.missing.filter((k) => k !== kind),
      })),
    setStudentSearch: (studentSearch) => set({ studentSearch }),
    submit: () => {
      const { definition, form } = get();
      if (!definition) return;
      const missing = missingRequired(definition, form);
      if (missing.length > 0) return set({ missing });
      set({ missing: [], submitted: toReportParams(definition, form) });
    },
    syncDefinition: (definition, catalogLoading) => {
      const first = !get().definition && definition;
      set({ definition, catalogLoading });
      // Opened from a contextual button with everything chosen: show it at once
      if (first && definition && missingRequired(definition, get().form).length === 0 && hasPrefill(get().form)) {
        get().submit();
      }
    },
    syncDocument: (document, isBuilding, buildError) => set({ document, isBuilding, buildError }),
    syncOptions: (key, options) => set((s) => ({ options: { ...s.options, [key]: options } })),
    setSelectedStudent: (selectedStudent) => set({ selectedStudent }),
    setExporting: (isExporting, exportError = null) => set({ isExporting, exportError }),
  }));
}

function hasPrefill(form: ReportForm): boolean {
  return Object.values(form).some((v) => Boolean(v));
}

export const ReportWorkspaceContext = createContext<ReportWorkspaceStore | null>(null);

export function useWorkspaceMirror<K extends keyof ReportWorkspaceState>(key: K): ReportWorkspaceState[K] {
  const store = useContext(ReportWorkspaceContext);
  if (!store) throw new Error('useWorkspaceMirror must be used within <ReportWorkspaceController>.');
  return useStore(store, (state) => state[key]);
}
