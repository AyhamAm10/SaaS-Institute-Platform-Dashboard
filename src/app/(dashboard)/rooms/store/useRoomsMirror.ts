'use client';

import { useStore } from 'zustand';
import { useRoomsStore } from './rooms.store';
import { RoomsState } from '../state/rooms.state';

export function useRoomsMirror<K extends keyof RoomsState>(
  key: K,
): RoomsState[K] {
  const store = useRoomsStore();
  return useStore(store, (state) => state[key]);
}

export function useRoomsMirrorSelector<TSelected>(
  selector: (state: RoomsState) => TSelected,
): TSelected {
  const store = useRoomsStore();
  return useStore(store, selector);
}
