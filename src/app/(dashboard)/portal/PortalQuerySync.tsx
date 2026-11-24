'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import {
  usePortalAttendanceQuery,
  usePortalFinanceQuery,
  usePortalMeQuery,
  usePortalNotesQuery,
  usePortalOverviewQuery,
  usePortalResultsQuery,
  usePortalTimetableQuery,
} from '@/src/core/api';
import { useAuth } from '@/src/core/auth';
import { usePortalStore } from './store/portal.store';

/** The signed-in guardian / student and the children of the account (always mounted). */
export function MeSync() {
  const store = usePortalStore();
  const syncMe = useStore(store, (s) => s.syncMe);
  const { user } = useAuth();
  const { data, isLoading } = usePortalMeQuery();
  const timeZone = user?.institute?.timezone ?? 'Asia/Damascus';

  useEffect(() => {
    syncMe(data ?? null, isLoading, timeZone);
  }, [data, isLoading, timeZone, syncMe]);
  return null;
}

/** Each of these is mounted by its tab only, so nothing loads before the tab is opened. */
export function OverviewSync() {
  const store = usePortalStore();
  const childId = useStore(store, (s) => s.childId);
  const syncSlot = useStore(store, (s) => s.syncSlot);
  const { data, isLoading } = usePortalOverviewQuery(childId);
  useEffect(() => syncSlot('overview', data ?? null, isLoading), [data, isLoading, syncSlot]);
  return null;
}

export function AttendanceSync() {
  const store = usePortalStore();
  const childId = useStore(store, (s) => s.childId);
  const month = useStore(store, (s) => s.month);
  const syncSlot = useStore(store, (s) => s.syncSlot);
  const { data, isLoading } = usePortalAttendanceQuery(childId, month);
  useEffect(() => syncSlot('attendance', data ?? null, isLoading), [data, isLoading, syncSlot]);
  return null;
}

export function TimetableSync() {
  const store = usePortalStore();
  const childId = useStore(store, (s) => s.childId);
  const syncSlot = useStore(store, (s) => s.syncSlot);
  const { data, isLoading } = usePortalTimetableQuery(childId);
  useEffect(() => syncSlot('timetable', data ?? null, isLoading), [data, isLoading, syncSlot]);
  return null;
}

export function ResultsSync() {
  const store = usePortalStore();
  const childId = useStore(store, (s) => s.childId);
  const syncSlot = useStore(store, (s) => s.syncSlot);
  const { data, isLoading } = usePortalResultsQuery(childId);
  useEffect(() => syncSlot('results', data ?? null, isLoading), [data, isLoading, syncSlot]);
  return null;
}

/** Guardians only (a student account is refused by the server). */
export function FinanceSync() {
  const store = usePortalStore();
  const childId = useStore(store, (s) => s.childId);
  const syncSlot = useStore(store, (s) => s.syncSlot);
  const { data, isLoading } = usePortalFinanceQuery(childId);
  useEffect(() => syncSlot('finance', data ?? null, isLoading), [data, isLoading, syncSlot]);
  return null;
}

/** Guardians only. */
export function NotesSync() {
  const store = usePortalStore();
  const childId = useStore(store, (s) => s.childId);
  const syncSlot = useStore(store, (s) => s.syncSlot);
  const { data, isLoading } = usePortalNotesQuery(childId);
  useEffect(() => syncSlot('notes', data ?? null, isLoading), [data, isLoading, syncSlot]);
  return null;
}
