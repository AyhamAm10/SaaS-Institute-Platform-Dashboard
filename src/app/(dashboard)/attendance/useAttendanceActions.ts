'use client';

import { useCallback } from 'react';
import {
  getApiErrorMessage,
  useBulkAttendanceMutation,
  useCheckInMutation,
  useCheckOutMutation,
  useExcuseMutation,
  useUpdateAttendanceMutation,
} from '@/src/core/api';
import type { DailyAttendanceRow } from '@/src/core/api';
import { AttendanceStore } from './store/attendance.store';
import { bulkNotice, isBeforeDayEnd, isValidTime, toUpdatePayload } from './utils/attendance.utils';
import { attendanceLabels as labels } from './static-data/attendance.data';

/** Orchestrates the attendance mutations. Controller-level hook (role.md §3). */
export function useAttendanceActions(store: AttendanceStore) {
  const checkIn = useCheckInMutation();
  const checkOut = useCheckOutMutation();
  const bulk = useBulkAttendanceMutation();
  const excuse = useExcuseMutation();
  const update = useUpdateAttendanceMutation();

  const mark = useCallback(
    async (studentId: number, action: 'check-in' | 'check-out', note?: string) => {
      const { setBusyStudentId, setNotice } = store.getState();
      setNotice(null);
      setBusyStudentId(studentId);
      try {
        if (action === 'check-in') await checkIn.mutateAsync(studentId);
        else await checkOut.mutateAsync({ studentId, note });
      } catch (err: unknown) {
        setNotice({ tone: 'error', text: getApiErrorMessage(err, labels.actionError) });
      } finally {
        setBusyStudentId(null);
      }
    },
    [store, checkIn, checkOut],
  );

  /** Check-out: before the end of the day it asks for the reason first (early exit). */
  const requestCheckOut = useCallback(
    (row: DailyAttendanceRow) => {
      const { day, timeZone, openExit } = store.getState();
      if (isBeforeDayEnd(day?.dayEndTime, timeZone)) openExit(row);
      else void mark(row.student.id, 'check-out');
    },
    [store, mark],
  );

  const submitExit = useCallback(async () => {
    const { exitRow, exitNote, closeModals } = store.getState();
    if (!exitRow) return;
    closeModals();
    await mark(exitRow.student.id, 'check-out', exitNote.trim() || undefined);
  }, [store, mark]);

  const markAll = useCallback(
    async (action: 'check-in' | 'check-out') => {
      const { sectionId, day, setBulkBusy, setNotice } = store.getState();
      if (!sectionId) return;
      setNotice(null);
      setBulkBusy(action);
      try {
        const result = await bulk.mutateAsync({ sectionId: Number(sectionId), action });
        const done = action === 'check-in' ? labels.bulkCheckInDone : labels.bulkCheckOutDone;
        setNotice(bulkNotice(result, day?.rows ?? [], done));
      } catch (err: unknown) {
        setNotice({ tone: 'error', text: getApiErrorMessage(err, labels.actionError) });
      } finally {
        setBulkBusy(null);
      }
    },
    [store, bulk],
  );

  /** Runs a modal submit: closes on success, shows the server message on failure. */
  const submitModal = useCallback(
    async (fn: () => Promise<unknown>) => {
      const { setModalError, setIsSubmitting, closeModals } = store.getState();
      setIsSubmitting(true);
      try {
        await fn();
        closeModals();
      } catch (err: unknown) {
        setModalError(getApiErrorMessage(err, labels.actionError));
      } finally {
        setIsSubmitting(false);
      }
    },
    [store],
  );

  const submitExcuse = useCallback(async () => {
    const { excuseRow, excuseNote, date } = store.getState();
    if (!excuseRow) return;
    await submitModal(() =>
      excuse.mutateAsync({ studentId: excuseRow.student.id, date, note: excuseNote.trim() || undefined }),
    );
  }, [store, submitModal, excuse]);

  const submitEdit = useCallback(async () => {
    const { editRecord, editForm, timeZone, setModalError } = store.getState();
    if (!editRecord) return;
    if (!isValidTime(editForm.checkIn) || !isValidTime(editForm.checkOut)) {
      return setModalError(labels.invalidTime);
    }
    await submitModal(() =>
      update.mutateAsync({ id: editRecord.id, payload: toUpdatePayload(editForm, editRecord, timeZone) }),
    );
  }, [store, submitModal, update]);

  return { mark, requestCheckOut, submitExit, markAll, submitExcuse, submitEdit };
}

export type AttendanceActions = ReturnType<typeof useAttendanceActions>;
