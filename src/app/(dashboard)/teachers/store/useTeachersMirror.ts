'use client';

import { useStore } from 'zustand';
import { useTeachersStore } from './teachers.store';
import { TeachersState } from '../state/teachers.state';

export function useTeachersMirror<K extends keyof TeachersState>(
  key: K,
): TeachersState[K] {
  const store = useTeachersStore();
  return useStore(store, (state) => state[key]);
}

export function useTeachersMirrorSelector<TSelected>(
  selector: (state: TeachersState) => TSelected,
): TSelected {
  const store = useTeachersStore();
  return useStore(store, selector);
}
