'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import {
  useRoomsQuery,
  useScheduleConfigQuery,
  useSectionSubjectsQuery,
  useSectionsQuery,
  useTeachersQuery,
  useTimetableQuery,
} from '@/src/core/api';
import { useOperationalContext } from '@/src/core/context';
import { TimetableStore } from './store/timetable.store';

/** Timetable + lookups into the store; follows the header year (no query in ui/). */
export function QuerySync({ store }: { store: TimetableStore }) {
  const { activeAcademicYearId } = useOperationalContext();
  const academicYearId = useStore(store, (s) => s.academicYearId);
  const sectionId = useStore(store, (s) => s.sectionId);
  const syncTimetableData = useStore(store, (s) => s.syncTimetableData);

  // The year is the header context only; a new year clears the chosen section
  useEffect(() => {
    if (activeAcademicYearId !== academicYearId) {
      store.getState().setAcademicYearId(activeAcademicYearId);
      store.getState().setSectionId(null);
    }
  }, [activeAcademicYearId, academicYearId, store]);

  const { data: timetable, isLoading, isFetching } = useTimetableQuery(academicYearId ?? 0, sectionId ?? 0);
  const { data: scheduleConfig } = useScheduleConfigQuery();
  const { data: sectionsData } = useSectionsQuery({ limit: 100 });
  const { data: teachersData } = useTeachersQuery({ limit: 100 });
  const { data: roomsData } = useRoomsQuery({ limit: 100 });
  const { data: sectionSubjects } = useSectionSubjectsQuery(sectionId ?? 0);

  useEffect(() => {
    syncTimetableData({
      timetable: timetable ?? null,
      scheduleConfig: scheduleConfig ?? null,
      sections: sectionsData?.data ?? [],
      teachers: teachersData?.data ?? [],
      rooms: roomsData?.data ?? [],
      sectionSubjects: sectionSubjects ?? [],
      isLoading,
      isFetching,
    });
  }, [
    timetable,
    scheduleConfig,
    sectionsData,
    teachersData,
    roomsData,
    sectionSubjects,
    isLoading,
    isFetching,
    syncTimetableData,
  ]);

  return null;
}
