'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { AttendanceState, EditForm } from '../state/attendance.state';
import { editFormFrom, localToday } from '../utils/attendance.utils';

export type AttendanceStore = ControllerStoreApi<AttendanceState>;

const EMPTY_EDIT: EditForm = { checkIn: '', checkOut: '', status: 'PRESENT', note: '' };
const closed = {
  excuseRow: null,
  excuseNote: '',
  editRecord: null,
  editForm: EMPTY_EDIT,
  modalError: null,
  isSubmitting: false,
};

/** Isolated store of the attendance page (role.md §3). */
export function createAttendanceStore(): AttendanceStore {
  return createControllerStore<AttendanceState>((set, get) => ({
    timeZone: undefined,
    sectionId: null,
    date: localToday(),
    sectionOptions: [],
    day: null,
    isLoading: false,
    busyStudentId: null,
    bulkBusy: null,
    notice: null,
    ...closed,

    // "Today" follows the institute zone once it is known
    setTimeZone: (timeZone) => set({ timeZone, date: localToday(new Date(), timeZone) }),
    setSectionId: (sectionId) => set({ sectionId, notice: null }),
    setDate: (date) => set({ date, notice: null }),
    setBusyStudentId: (busyStudentId) => set({ busyStudentId }),
    setBulkBusy: (bulkBusy) => set({ bulkBusy }),
    setNotice: (notice) => set({ notice }),
    openExcuse: (excuseRow) => set({ ...closed, excuseRow }),
    setExcuseNote: (excuseNote) => set({ excuseNote }),
    openEdit: (editRecord) =>
      set({ ...closed, editRecord, editForm: editFormFrom(editRecord, get().timeZone) }),
    setEditField: (key, value) =>
      set((s) => ({ editForm: { ...s.editForm, [key]: value }, modalError: null })),
    closeModals: () => set(closed),
    setModalError: (modalError) => set({ modalError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    syncDay: (day, isLoading) => set({ day, isLoading }),
    syncSectionOptions: (sectionOptions) =>
      set((s) => ({
        sectionOptions,
        // Pick the first section automatically
        sectionId: s.sectionId ?? sectionOptions[0]?.value ?? null,
      })),
  }));
}

export const AttendanceContext = createContext<AttendanceStore | null>(null);

export function useAttendanceMirror<K extends keyof AttendanceState>(key: K): AttendanceState[K] {
  const store = useContext(AttendanceContext);
  if (!store) throw new Error('useAttendanceMirror must be used within <AttendanceController>.');
  return useStore(store, (state) => state[key]);
}
