'use client';

import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useDailyAttendanceQuery, useSectionsQuery } from '@/src/core/api';
import { useAuth } from '@/src/core/auth';
import { AttendanceContext, AttendanceStore, createAttendanceStore } from './store/attendance.store';
import { useAttendanceActions } from './useAttendanceActions';
import { AttendanceView } from './ui/AttendanceView';

/** Sections of the active branch / year → select options. */
function SectionsSync({ store }: { store: AttendanceStore }) {
  const syncSectionOptions = useStore(store, (s) => s.syncSectionOptions);
  const { data } = useSectionsQuery({ limit: 100 });

  useEffect(() => {
    syncSectionOptions((data?.data ?? []).map((s) => ({ value: String(s.id), label: s.name })));
  }, [data, syncSectionOptions]);

  return null;
}

/** Institute time zone of the signed-in user → store. */
function TimeZoneSync({ store }: { store: AttendanceStore }) {
  const setTimeZone = useStore(store, (s) => s.setTimeZone);
  const timeZone = useAuth().user?.institute?.timezone ?? undefined;

  useEffect(() => {
    setTimeZone(timeZone);
  }, [timeZone, setTimeZone]);

  return null;
}

/** Day roster of the chosen section → store. */
function DaySync({ store }: { store: AttendanceStore }) {
  const sectionId = useStore(store, (s) => s.sectionId);
  const date = useStore(store, (s) => s.date);
  const syncDay = useStore(store, (s) => s.syncDay);
  const { data, isLoading } = useDailyAttendanceQuery(sectionId ? Number(sectionId) : null, date);

  useEffect(() => {
    syncDay(data ?? null, isLoading);
  }, [data, isLoading, syncDay]);

  return null;
}

/**
 * AttendanceController
 *
 * Daily attendance page (E8): section + date roster, check-in / check-out
 * per student or for the whole section, excuses and audited corrections.
 */
export function AttendanceController() {
  const [store] = useState(createAttendanceStore);
  const actions = useAttendanceActions(store);

  return (
    <AttendanceContext.Provider value={store}>
      <TimeZoneSync store={store} />
      <SectionsSync store={store} />
      <DaySync store={store} />
      <AttendanceView actions={actions} />
    </AttendanceContext.Provider>
  );
}
