'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { roomsKeys } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createRoomsStore, RoomsContext } from './store/rooms.store';
import { RoomsView } from './ui/RoomsView';
import { QuerySync } from './RoomsQuerySync';
import { useRoomsActions } from './useRoomsActions';

export function RoomsController() {
  const [store] = useState(() => createRoomsStore());
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.academicManage);
  const queryClient = useQueryClient();

  const { handleSubmit, handleConfirmDelete, handleSaveAvailabilities, ...availability } = useRoomsActions(store);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: roomsKeys.all });
  }, [queryClient]);

  return (
    <RoomsContext.Provider value={store}>
      <QuerySync store={store} />
      <RoomsView
        onRefresh={handleRefresh}
        onSubmit={handleSubmit}
        onConfirmDelete={handleConfirmDelete}
        onSaveAvailabilities={handleSaveAvailabilities}
        canManage={canManage}
        {...availability}
      />
    </RoomsContext.Provider>
  );
}
