'use client';

import { useStore } from 'zustand';
import { useTimetableStore } from './timetable.store';
import { TimetableState } from '../state/timetable.state';

export function useTimetableMirror<K extends keyof TimetableState>(
  key: K,
): TimetableState[K] {
  const store = useTimetableStore();
  return useStore(store, (state) => state[key]);
}

export function useTimetableMirrorSelector<TSelected>(
  selector: (state: TimetableState) => TSelected,
): TSelected {
  const store = useTimetableStore();
  return useStore(store, selector);
}
