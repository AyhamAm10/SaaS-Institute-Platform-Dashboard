'use client';

import { useCallback, useState } from 'react';
import {
  getTeacherById,
  useAssignTeacherQualificationMutation,
  useRemoveTeacherQualificationMutation,
  useSetTeacherAvailabilitiesMutation,
} from '@/src/core/api';
import { TeachersStore } from './store/teachers.store';

/** Qualifications and availability windows of the opened teacher. Controller-level hook (role.md §3). */
export function useTeacherProfileActions(store: TeachersStore) {
  const assignQualMutation = useAssignTeacherQualificationMutation();
  const removeQualMutation = useRemoveTeacherQualificationMutation();
  const setAvailMutation = useSetTeacherAvailabilitiesMutation();

  // Mini-form state for availability window inside details drawer
  const [newAvailDay, setNewAvailDay] = useState('0');
  const [newAvailStart, setNewAvailStart] = useState('08:00');
  const [newAvailEnd, setNewAvailEnd] = useState('14:00');

  const handleAddAvailabilityWindow = useCallback(() => {
    if (!newAvailStart || !newAvailEnd) return;
    store.getState().addStagedAvailability({
      dayOfWeek: Number(newAvailDay),
      startTime: newAvailStart.trim(),
      endTime: newAvailEnd.trim(),
    });
  }, [store, newAvailDay, newAvailStart, newAvailEnd]);

  const handleAssignQualification = useCallback(
    async (academicBranchId: number, subjectId: number) => {
      const current = store.getState().selectedTeacherDetails;
      if (!current) return;

      store.getState().setIsAssigningQualification(true);
      try {
        await assignQualMutation.mutateAsync({
          teacherId: current.id,
          payload: { academicBranchId, subjectId },
        });
        // Refetch full details
        const updated = await getTeacherById(current.id);
        store.getState().setSelectedTeacherDetails(updated);
        store.getState().setNewSubjectId(undefined);
      } catch (err: unknown) {
        console.error('Failed to assign qualification', err);
      } finally {
        store.getState().setIsAssigningQualification(false);
      }
    },
    [store, assignQualMutation],
  );

  const handleRemoveQualification = useCallback(
    async (assignmentId: number) => {
      const current = store.getState().selectedTeacherDetails;
      if (!current) return;

      try {
        await removeQualMutation.mutateAsync({
          teacherId: current.id,
          assignmentId,
        });
        const updated = await getTeacherById(current.id);
        store.getState().setSelectedTeacherDetails(updated);
      } catch (err: unknown) {
        console.error('Failed to remove qualification', err);
      }
    },
    [store, removeQualMutation],
  );

  const handleSaveAvailabilities = useCallback(async () => {
    const current = store.getState().selectedTeacherDetails;
    if (!current) return;

    const staged = store.getState().stagedAvailabilities;
    store.getState().setIsSavingAvailabilities(true);
    try {
      await setAvailMutation.mutateAsync({
        teacherId: current.id,
        windows: staged,
      });
      const updated = await getTeacherById(current.id);
      store.getState().setSelectedTeacherDetails(updated);
    } catch (err: unknown) {
      console.error('Failed to save availabilities', err);
    } finally {
      store.getState().setIsSavingAvailabilities(false);
    }
  }, [store, setAvailMutation]);

  return {
    handleAssignQualification,
    handleRemoveQualification,
    handleSaveAvailabilities,
    newAvailDay,
    setNewAvailDay,
    newAvailStart,
    setNewAvailStart,
    newAvailEnd,
    setNewAvailEnd,
    onAddAvailabilityWindow: handleAddAvailabilityWindow,
  };
}
