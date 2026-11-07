'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { RosterSection, SectionStudentsState } from '../state/section-students.state';
import { initialSubjectChoice, toggleId, toggleSubjectChoice } from '../utils/section-students.utils';

export type SectionStudentsStore = ControllerStoreApi<SectionStudentsState>;

const closedAction = {
  actionType: null,
  actionItem: null,
  transferSectionId: null,
  reason: '',
  actionError: null,
  isSubmitting: false,
};

/** Isolated store of one section roster (role.md §3). */
export function createSectionStudentsStore(section: RosterSection): SectionStudentsStore {
  return createControllerStore<SectionStudentsState>((set) => ({
    section,
    roster: [],
    isLoading: true,
    statusFilter: 'ALL',

    addOpened: false,
    candidateSearch: '',
    candidates: [],
    isLoadingCandidates: false,
    selectedIds: [],
    addError: null,
    addResult: null,
    isEnrolling: false,

    ...closedAction,
    subjectChoice: [],
    transferOptions: [],
    sectionSubjects: [],

    setStatusFilter: (statusFilter) => set({ statusFilter }),
    openAdd: () =>
      set({
        addOpened: true,
        candidateSearch: '',
        selectedIds: [],
        addError: null,
        addResult: null,
      }),
    closeAdd: () => set({ addOpened: false }),
    setCandidateSearch: (candidateSearch) => set({ candidateSearch }),
    toggleCandidate: (id) => set((s) => ({ selectedIds: toggleId(s.selectedIds, id) })),
    setAddError: (addError) => set({ addError }),
    setAddResult: (addResult) => set({ addResult }),
    setIsEnrolling: (isEnrolling) => set({ isEnrolling }),

    openAction: (actionType, actionItem) =>
      set({
        ...closedAction,
        actionType,
        actionItem,
        subjectChoice: initialSubjectChoice(actionItem),
      }),
    closeAction: () => set({ ...closedAction, subjectChoice: [] }),
    setTransferSectionId: (transferSectionId) => set({ transferSectionId, actionError: null }),
    setReason: (reason) => set({ reason, actionError: null }),
    toggleSubject: (id) =>
      set((s) => ({
        subjectChoice: toggleSubjectChoice(
          s.subjectChoice,
          s.sectionSubjects.map((x) => x.id),
          id,
        ),
      })),
    selectAllSubjects: () => set({ subjectChoice: [] }),
    setActionError: (actionError) => set({ actionError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

    syncRoster: (roster, isLoading) => set({ roster, isLoading }),
    syncCandidates: (candidates, isLoadingCandidates) => set({ candidates, isLoadingCandidates }),
    syncTransferOptions: (transferOptions) => set({ transferOptions }),
    syncSectionSubjects: (sectionSubjects) => set({ sectionSubjects }),
  }));
}

export const SectionStudentsContext = createContext<SectionStudentsStore | null>(null);

export function useSectionStudentsStore(): SectionStudentsStore {
  const store = useContext(SectionStudentsContext);
  if (!store) {
    throw new Error('useSectionStudentsStore must be used within <SectionStudentsController>.');
  }
  return store;
}
