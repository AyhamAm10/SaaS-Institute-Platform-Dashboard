'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { PortalSlotKey, PortalState } from '../state/portal.state';

export type PortalStore = ControllerStoreApi<PortalState>;

const EMPTY = { data: null, isLoading: true } as const;
const SLOT_KEYS: PortalSlotKey[] = ['overview', 'attendance', 'timetable', 'results', 'finance', 'notes'];

/** Isolated store of the portal page (role.md §3). */
export function createPortalStore(): PortalStore {
  return createControllerStore<PortalState>((set) => ({
    me: null,
    meLoading: true,
    timeZone: 'Asia/Damascus',
    childId: null,
    month: '',
    slots: Object.fromEntries(SLOT_KEYS.map((k) => [k, { ...EMPTY }])) as unknown as PortalState['slots'],

    syncMe: (me, meLoading, timeZone) =>
      set((s) => ({
        me,
        meLoading,
        timeZone,
        // the first child is chosen once; a later choice is kept while he is still in the list
        childId: me && !me.children.some((c) => c.id === s.childId) ? (me.children[0]?.id ?? null) : s.childId,
      })),
    selectChild: (childId) => set({ childId, month: '' }),
    setMonth: (month) => set({ month }),
    syncSlot: (key, data, isLoading) => set((s) => ({ slots: { ...s.slots, [key]: { data, isLoading } } })),
  }));
}

export const PortalContext = createContext<PortalStore | null>(null);

export function usePortalMirror<K extends keyof PortalState>(key: K): PortalState[K] {
  const store = useContext(PortalContext);
  if (!store) throw new Error('usePortalMirror must be used within <PortalController>.');
  return useStore(store, (state) => state[key]);
}

/** The store itself (query-sync components write to it). */
export function usePortalStore(): PortalStore {
  const store = useContext(PortalContext);
  if (!store) throw new Error('usePortalStore must be used within <PortalController>.');
  return store;
}
