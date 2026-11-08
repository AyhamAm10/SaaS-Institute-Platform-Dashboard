'use client';

import { useCallback, useState } from 'react';
import {
  getApiErrorMessage,
  getRoomById,
  Room,
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useOperationalContext,
  useSetRoomAvailabilitiesMutation,
  useUpdateRoomMutation,
} from '@/src/core/api';
import { RoomsStore } from './store/rooms.store';

/** Room create / edit / delete and availability windows. Controller-level hook (role.md §3). */
export function useRoomsActions(store: RoomsStore) {
  const createMutation = useCreateRoomMutation();
  const updateMutation = useUpdateRoomMutation();
  const deleteMutation = useDeleteRoomMutation();
  const setAvailMutation = useSetRoomAvailabilitiesMutation();

  // Mini-form state for room availability
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

  const { activeBranchId } = useOperationalContext();

  const handleSubmit = useCallback(async () => {
    const { form, drawerMode, selectedRoom } = store.getState();
    store.getState().setGeneralError(null);
    store.getState().setGeneralSuccess(null);

    let hasError = false;
    if (!form.name.trim()) {
      store.getState().setFieldError('name', 'يرجى إدخال اسم القاعة');
      hasError = true;
    }
    if (!form.capacity || form.capacity <= 0) {
      store.getState().setFieldError('capacity', 'يرجى تحديد السعة الاستيعابية');
      hasError = true;
    }

    const targetBranchId = activeBranchId ?? selectedRoom?.branchId ?? undefined;

    if (hasError) return;

    store.getState().setIsSubmitting(true);
    try {
      if (drawerMode === 'edit' && selectedRoom) {
        await updateMutation.mutateAsync({
          id: selectedRoom.id,
          payload: {
            name: form.name.trim(),
            type: form.type,
            capacity: Number(form.capacity),
            branchId: targetBranchId,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: form.name.trim(),
          type: form.type,
          capacity: Number(form.capacity),
          branchId: targetBranchId,
        });
      }

      store.getState().closeDrawer();
      store.getState().resetForm();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'حدث خطأ أثناء حفظ بيانات القاعة');
      store.getState().setGeneralError(msg);
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation, activeBranchId]);

  const handleConfirmDelete = useCallback(
    async (room: Room) => {
      store.getState().setDeleteError(null);
      store.getState().setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(room.id);
        store.getState().closeDeleteModal();
      } catch (err: unknown) {
        const msg = getApiErrorMessage(err, 'حدث خطأ أثناء حذف القاعة');
        store.getState().setDeleteError(msg);
      } finally {
        store.getState().setIsDeleting(false);
      }
    },
    [store, deleteMutation],
  );

  const handleSaveAvailabilities = useCallback(async () => {
    const current = store.getState().selectedRoomDetails;
    if (!current) return;

    const staged = store.getState().stagedAvailabilities;
    store.getState().setIsSavingAvailabilities(true);
    try {
      await setAvailMutation.mutateAsync({
        roomId: current.id,
        windows: staged,
      });
      const updated = await getRoomById(current.id);
      store.getState().setSelectedRoomDetails(updated);
    } catch (err: unknown) {
      console.error('Failed to save room availabilities', err);
    } finally {
      store.getState().setIsSavingAvailabilities(false);
    }
  }, [store, setAvailMutation]);

  return {
    handleSubmit,
    handleConfirmDelete,
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
