'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { SettingsState } from '../state/settings.state';
import { SettingsTabKey } from '../static-data/settings-tabs.data';

export type SettingsStore = ReturnType<typeof createSettingsStore>;

export function createSettingsStore(initialTab: SettingsTabKey, permittedTabs: SettingsTabKey[]) {
  return createControllerStore<SettingsState>((set) => ({
    activeTab: initialTab,
    permittedTabs,
    setActiveTab: (activeTab) => set({ activeTab }),
    setPermittedTabs: (tabs) => set({ permittedTabs: tabs }),
  }));
}

export const SettingsContext = createContext<SettingsStore | null>(null);

export function useSettingsStore(): SettingsStore {
  const store = useContext(SettingsContext);
  if (!store) {
    throw new Error('useSettingsStore must be used within a SettingsContext.Provider');
  }
  return store;
}

