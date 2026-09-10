'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import {
  Room,
  roomsKeys,
  useCreateRoomMutation,
  useDeleteRoomMutation,
  useRoomsQuery,
  useSetRoomAvailabilitiesMutation,
  useUpdateRoomMutation,
  getRoomById,
} from '@/src/core/api';
import {
  createRoomsStore,
  RoomsContext,
} from './store/rooms.store';
import { RoomsView } from './ui/RoomsView';

function QuerySync({
  store,
}: {
  store: ReturnType<typeof createRoomsStore>;
}) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const type = useStore(store, (s) => s.type);
  const branchId = useStore(store, (s) => s.branchId);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data: paginated, isLoading, isFetching } = useRoomsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    type,
    branchId,
  });

  useEffect(() => {
    syncQueryData({
      data: paginated?.data ?? [],
      total: paginated?.total ?? 0,
      totalPages: paginated?.totalPages ?? 1,
      isLoading,
      isFetching,
    });
  }, [paginated, isLoading, isFetching, syncQueryData]);

  return null;
}

export function RoomsController() {
  const [store] = useState(() => createRoomsStore());
  const queryClient = useQueryClient();

  const createMutation = useCreateRoomMutation();
  const updateMutation = useUpdateRoomMutation();
  const deleteMutation = useDeleteRoomMutation();
  const setAvailMutation = useSetRoomAvailabilitiesMutation();

  // Mini-form state for room availability
  const [newAvailDay, setNewAvailDay] = useState('0');
  const [newAvailStart, setNewAvailStart] = useState('08:00');
  const [newAvailEnd, setNewAvailEnd] = useState('14:00');

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: roomsKeys.all });
  }, [queryClient]);

  const handleAddAvailabilityWindow = useCallback(() => {
    if (!newAvailStart || !newAvailEnd) return;
    store.getState().addStagedAvailability({
      dayOfWeek: Number(newAvailDay),
      startTime: newAvailStart.trim(),
      endTime: newAvailEnd.trim(),
    });
  }, [store, newAvailDay, newAvailStart, newAvailEnd]);

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
            branchId: form.branchId,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: form.name.trim(),
          type: form.type,
          capacity: Number(form.capacity),
          branchId: form.branchId,
        });
      }

      store.getState().closeDrawer();
      store.getState().resetForm();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء حفظ بيانات القاعة';
      store.getState().setGeneralError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation]);

  const handleConfirmDelete = useCallback(
    async (room: Room) => {
      store.getState().setDeleteError(null);
      store.getState().setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(room.id);
        store.getState().closeDeleteModal();
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ أثناء حذف القاعة';
        store.getState().setDeleteError(Array.isArray(msg) ? msg.join(', ') : msg);
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
    } catch (err: any) {
      console.error('Failed to save room availabilities', err);
    } finally {
      store.getState().setIsSavingAvailabilities(false);
    }
  }, [store, setAvailMutation]);

  return (
    <RoomsContext.Provider value={store}>
      <QuerySync store={store} />
      <RoomsView
        onRefresh={handleRefresh}
        onSubmit={handleSubmit}
        onConfirmDelete={handleConfirmDelete}
        onSaveAvailabilities={handleSaveAvailabilities}
        newAvailDay={newAvailDay}
        setNewAvailDay={setNewAvailDay}
        newAvailStart={newAvailStart}
        setNewAvailStart={setNewAvailStart}
        newAvailEnd={newAvailEnd}
        setNewAvailEnd={setNewAvailEnd}
        onAddAvailabilityWindow={handleAddAvailabilityWindow}
      />
    </RoomsContext.Provider>
  );
}
