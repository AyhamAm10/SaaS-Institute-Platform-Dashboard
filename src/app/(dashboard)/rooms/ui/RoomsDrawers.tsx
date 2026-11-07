'use client';

import { Room } from '@/src/core/api';
import { RoomFormDrawer } from './RoomFormDrawer';
import { RoomDetailsDrawer } from './RoomDetailsDrawer';
import { RoomDeleteModal } from './RoomDeleteModal';

export interface RoomsDrawersProps {
  canManage: boolean;
  onSubmit: () => void;
  onConfirmDelete: (room: Room) => Promise<void>;
  onSaveAvailabilities: () => Promise<void>;
  newAvailDay: string;
  setNewAvailDay: (v: string) => void;
  newAvailStart: string;
  setNewAvailStart: (v: string) => void;
  newAvailEnd: string;
  setNewAvailEnd: (v: string) => void;
  onAddAvailabilityWindow: () => void;
}

export function RoomsDrawers({
  canManage,
  onSubmit,
  onConfirmDelete,
  onSaveAvailabilities,
  newAvailDay,
  setNewAvailDay,
  newAvailStart,
  setNewAvailStart,
  newAvailEnd,
  setNewAvailEnd,
  onAddAvailabilityWindow,
}: RoomsDrawersProps) {
  return (
    <>
      {canManage && <RoomFormDrawer onSubmit={onSubmit} />}
      <RoomDetailsDrawer
        onSaveAvailabilities={onSaveAvailabilities}
        newAvailDay={newAvailDay}
        setNewAvailDay={setNewAvailDay}
        newAvailStart={newAvailStart}
        setNewAvailStart={setNewAvailStart}
        newAvailEnd={newAvailEnd}
        setNewAvailEnd={setNewAvailEnd}
        onAddAvailabilityWindow={onAddAvailabilityWindow}
      />
      {canManage && <RoomDeleteModal onConfirmDelete={onConfirmDelete} />}
    </>
  );
}
