'use client';

import { useStore } from 'zustand';
import { useBranchesStore } from './branches.store';
import { BranchesState } from '../state/branches.state';

export function useBranchesMirror<K extends keyof BranchesState>(key: K): BranchesState[K] {
  const store = useBranchesStore();
  return useStore(store, (state) => state[key]);
}
