'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import {
  timetablesKeys,
  useDeleteTimetableEntryMutation,
  useGenerateTimetableMutation,
  useSaveTimetableEntryMutation,
  useScheduleConfigQuery,
  useSectionsQuery,
  useTeachersQuery,
  useRoomsQuery,
  useTimetableQuery,
  TimetableEntry,
  getApiErrorMessage,
} from '@/src/core/api';
import {
  createTimetableStore,
  TimetableContext,
} from './store/timetable.store';
import { useOperationalContext } from '@/src/core/context';
import {
  TimetableCell,
  TimetableConflictBanner,
  TimetableEntryModal,
  TimetableGenerateModal,
  TimetableGrid,
  TimetableHeader,
  TimetableStats,
  TimetableToolbar,
} from './ui';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { Stack } from '@mantine/core';

function QuerySync({
  store,
}: {
  store: ReturnType<typeof createTimetableStore>;
}) {
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

  const { data: timetable, isLoading, isFetching } = useTimetableQuery(
    academicYearId ?? 0,
    sectionId ?? 0,
  );
  const { data: scheduleConfig } = useScheduleConfigQuery();
  const { data: sectionsData } = useSectionsQuery({ limit: 100 });
  const { data: teachersData } = useTeachersQuery({ limit: 100 });
  const { data: roomsData } = useRoomsQuery({ limit: 100 });

  useEffect(() => {
    syncTimetableData({
      timetable: timetable ?? null,
      scheduleConfig: scheduleConfig ?? null,
      sections: sectionsData?.data ?? [],
      teachers: teachersData?.data ?? [],
      rooms: roomsData?.data ?? [],
      isLoading,
      isFetching,
    });
  }, [
    timetable,
    scheduleConfig,
    sectionsData,
    teachersData,
    roomsData,
    isLoading,
    isFetching,
    syncTimetableData,
  ]);

  return null;
}

export function TimetableController() {
  const [store] = useState(() => createTimetableStore());
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.academicManage);
  const queryClient = useQueryClient();

  const saveEntryMutation = useSaveTimetableEntryMutation();
  const deleteEntryMutation = useDeleteTimetableEntryMutation();
  const generateMutation = useGenerateTimetableMutation();

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: timetablesKeys.all });
  }, [queryClient]);

  const handleSaveEntry = useCallback(async () => {
    const { academicYearId, sectionId, entryForm } = store.getState();
    if (!academicYearId || !sectionId) return;

    if (!entryForm.subjectId || !entryForm.teacherId) {
      store.getState().setEntryFormError('يرجى اختيار المادة والمعلم');
      return;
    }

    store.getState().setIsSavingEntry(true);
    try {
      await saveEntryMutation.mutateAsync({
        academicYearId,
        sectionId,
        payload: {
          id: entryForm.id,
          subjectId: entryForm.subjectId,
          teacherId: entryForm.teacherId,
          roomId: entryForm.roomId,
          dayOfWeek: entryForm.dayOfWeek,
          periodNumber: entryForm.periodNumber,
          startTime: entryForm.startTime,
          endTime: entryForm.endTime,
          isLocked: entryForm.isLocked,
        },
      });
      store.getState().closeEntryModal();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'حدث خطأ أثناء حفظ الحصة الدراسية');
      store.getState().setEntryFormError(msg);
    } finally {
      store.getState().setIsSavingEntry(false);
    }
  }, [store, saveEntryMutation]);

  const handleDeleteEntry = useCallback(
    async (entry: TimetableEntry) => {
      const { academicYearId, sectionId } = store.getState();
      if (!academicYearId || !sectionId) return;

      try {
        await deleteEntryMutation.mutateAsync({
          academicYearId,
          sectionId,
          entryId: entry.id,
        });
      } catch (err: unknown) {
        console.error('Failed to delete entry', err);
      }
    },
    [store, deleteEntryMutation],
  );

  const handleToggleLock = useCallback(
    async (entry: TimetableEntry) => {
      const { academicYearId, sectionId } = store.getState();
      if (!academicYearId || !sectionId) return;

      try {
        await saveEntryMutation.mutateAsync({
          academicYearId,
          sectionId,
          payload: {
            id: entry.id,
            subjectId: entry.subjectId,
            teacherId: entry.teacherId,
            roomId: entry.roomId ?? null,
            dayOfWeek: entry.dayOfWeek,
            periodNumber: entry.periodNumber ?? 1,
            startTime: entry.startTime,
            endTime: entry.endTime,
            isLocked: !entry.isLocked,
          },
        });
      } catch (err: unknown) {
        console.error('Failed to toggle lock', err);
      }
    },
    [store, saveEntryMutation],
  );

  const handleGenerate = useCallback(async () => {
    const {
      academicYearId,
      sectionId,
      generateIncremental,
      generateLockExisting,
    } = store.getState();
    if (!academicYearId) return;

    store.getState().setIsGenerating(true);
    store.getState().setGenerateError(null);
    store.getState().setGenerateResult(null);

    try {
      const result = await generateMutation.mutateAsync({
        academicYearId,
        payload: {
          sectionIds: sectionId ? [sectionId] : undefined,
          incremental: generateIncremental,
          lockExisting: generateLockExisting,
        },
      });
      store.getState().setGenerateResult(result);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'حدث خطأ أثناء التوليد الآلي للجدول');
      store.getState().setGenerateError(msg);
    } finally {
      store.getState().setIsGenerating(false);
    }
  }, [store, generateMutation]);

  return (
    <TimetableContext.Provider value={store}>
      <QuerySync store={store} />
      <Stack gap="lg">
        <TimetableController.Header />
        <TimetableController.Toolbar onRefresh={handleRefresh} canManage={canManage} />
        <TimetableController.ConflictBanner />
        <TimetableController.Stats />
        <TimetableController.Grid
          onToggleLock={handleToggleLock}
          onDeleteEntry={handleDeleteEntry}
          canManage={canManage}
        />
        {canManage && (
          <>
            <TimetableController.EntryModal onSave={handleSaveEntry} />
            <TimetableController.GenerateModal onGenerate={handleGenerate} />
          </>
        )}
      </Stack>
    </TimetableContext.Provider>
  );
}

// Compound component pattern attachment
TimetableController.Header = TimetableHeader;
TimetableController.Toolbar = TimetableToolbar;
TimetableController.ConflictBanner = TimetableConflictBanner;
TimetableController.Stats = TimetableStats;
TimetableController.Cell = TimetableCell;
TimetableController.Grid = TimetableGrid;
TimetableController.EntryModal = TimetableEntryModal;
TimetableController.GenerateModal = TimetableGenerateModal;
