'use client';

import { useState } from 'react';
import { Stack } from '@mantine/core';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createTimetableStore, TimetableContext } from './store/timetable.store';
import { QuerySync } from './TimetableQuerySync';
import { useTimetableActions } from './useTimetableActions';

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
export function TimetableController() {
  const [store] = useState(() => createTimetableStore());
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.academicManage);
  const { handleRefresh, handleSaveEntry, handleDeleteEntry, handleToggleLock, handleGenerate } =
    useTimetableActions(store);

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
