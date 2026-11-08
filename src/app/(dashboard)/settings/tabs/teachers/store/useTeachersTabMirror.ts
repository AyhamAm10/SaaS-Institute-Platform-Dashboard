'use client';

import { useStore } from 'zustand';
import { TeachersTabState } from '../state/teachers-tab.state';
import { useTeachersTabStore } from './teachers-tab.store';

export function useTeachersTabMirror<K extends keyof TeachersTabState>(key: K): TeachersTabState[K] {
  const store = useTeachersTabStore();
  return useStore(store, (state) => state[key]);
}

