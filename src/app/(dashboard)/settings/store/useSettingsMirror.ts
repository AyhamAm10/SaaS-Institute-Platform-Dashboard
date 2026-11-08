'use client';

import { useStore } from 'zustand';
import { SettingsState } from '../state/settings.state';
import { useSettingsStore } from './settings.store';

export function useSettingsMirror<K extends keyof SettingsState>(key: K): SettingsState[K] {
  const store = useSettingsStore();
  return useStore(store, (state) => state[key]);
}

