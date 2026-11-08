'use client';

import { useStore } from 'zustand';
import { InstituteTabState } from '../state/institute-tab.state';
import { useInstituteTabStore } from './institute-tab.store';

export function useInstituteTabMirror<K extends keyof InstituteTabState>(key: K): InstituteTabState[K] {
  const store = useInstituteTabStore();
  return useStore(store, (state) => state[key]);
}

