'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import {
  TimetableEntryFormState,
  TimetableState,
} from '../state/timetable.state';

export type TimetableStore = ControllerStoreApi<TimetableState>;

const defaultEntryForm: TimetableEntryFormState = {
  subjectId: null,
  teacherId: null,
  roomId: null,
  dayOfWeek: 0,
  periodNumber: 1,
  startTime: '08:00',
  endTime: '08:45',
  isLocked: false,
};

export function createTimetableStore(): TimetableStore {
  return createControllerStore<TimetableState>((set) => ({
    academicYearId: null,
    sectionId: null,

    timetable: null,
    scheduleConfig: null,
    sections: [],
    subjects: [],
    teachers: [],
    rooms: [],
    conflicts: [],

    isLoading: true,
    isFetching: false,
    isGenerating: false,

    entryModalOpened: false,
    entryForm: { ...defaultEntryForm },
    entryFormError: null,
    isSavingEntry: false,

    generateModalOpened: false,
    generateIncremental: false,
    generateLockExisting: false,
    generateResult: null,
    generateError: null,

    deleteEntryId: null,
    isDeletingEntry: false,

    setAcademicYearId: (yearId) => set({ academicYearId: yearId }),
    setSectionId: (sectionId) => set({ sectionId }),

    openCreateEntryModal: (slot) =>
      set({
        entryModalOpened: true,
        entryForm: {
          ...defaultEntryForm,
          dayOfWeek: slot.dayOfWeek,
          periodNumber: slot.periodNumber,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isLocked: false,
        },
        entryFormError: null,
      }),

    openEditEntryModal: (entry) =>
      set({
        entryModalOpened: true,
        entryForm: {
          id: entry.id,
          subjectId: entry.subjectId,
          teacherId: entry.teacherId,
          roomId: entry.roomId ?? null,
          dayOfWeek: entry.dayOfWeek,
          periodNumber: entry.periodNumber ?? 1,
          startTime: entry.startTime,
          endTime: entry.endTime,
          isLocked: entry.isLocked,
        },
        entryFormError: null,
      }),

    closeEntryModal: () =>
      set({
        entryModalOpened: false,
        entryForm: { ...defaultEntryForm },
        entryFormError: null,
      }),

    setEntryFormField: (field, value) =>
      set((state) => ({
        entryForm: { ...state.entryForm, [field]: value },
        entryFormError: null,
      })),

    setEntryFormError: (error) => set({ entryFormError: error }),
    setIsSavingEntry: (saving) => set({ isSavingEntry: saving }),

    openGenerateModal: () =>
      set({
        generateModalOpened: true,
        generateResult: null,
        generateError: null,
      }),

    closeGenerateModal: () =>
      set({
        generateModalOpened: false,
        generateResult: null,
        generateError: null,
      }),

    setGenerateIncremental: (incremental) =>
      set({ generateIncremental: incremental }),
    setGenerateLockExisting: (lockExisting) =>
      set({ generateLockExisting: lockExisting }),
    setGenerateResult: (result) => set({ generateResult: result }),
    setGenerateError: (error) => set({ generateError: error }),
    setIsGenerating: (generating) => set({ isGenerating: generating }),

    setDeleteEntryId: (id) => set({ deleteEntryId: id }),
    setIsDeletingEntry: (deleting) => set({ isDeletingEntry: deleting }),

    syncTimetableData: (payload) =>
      set({
        timetable: payload.timetable,
        conflicts: payload.timetable?.conflicts || [],
        scheduleConfig: payload.scheduleConfig,
        sections: payload.sections,
        teachers: payload.teachers,
        rooms: payload.rooms,
        isLoading: payload.isLoading,
        isFetching: payload.isFetching,
      }),
  }));
}

export const TimetableContext = createContext<TimetableStore | null>(null);

export function useTimetableStore(): TimetableStore {
  const store = useContext(TimetableContext);
  if (!store) {
    throw new Error('useTimetableStore must be used within a TimetableController.');
  }
  return store;
}
