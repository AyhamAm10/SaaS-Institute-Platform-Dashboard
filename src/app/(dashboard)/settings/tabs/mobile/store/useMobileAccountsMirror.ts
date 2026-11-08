'use client';

import { useStore } from 'zustand';
import { MobileAccountsState } from '../state/mobile-accounts.state';
import { useMobileAccountsStore } from './mobile-accounts.store';

export function useMobileAccountsMirror<K extends keyof MobileAccountsState>(key: K): MobileAccountsState[K] {
  const store = useMobileAccountsStore();
  return useStore(store, (state) => state[key]);
}

