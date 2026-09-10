'use client';

import { useStore } from 'zustand';
import { useScheduleSettingsStore } from './schedule-settings.store';
import { ScheduleSettingsState } from '../state/schedule-settings.state';

export function useScheduleSettingsMirror<K extends keyof ScheduleSettingsState>(
  key: K,
): ScheduleSettingsState[K] {
  const store = useScheduleSettingsStore();
  return useStore(store, (state) => state[key]);
}

export function useScheduleSettingsMirrorSelector<TSelected>(
  selector: (state: ScheduleSettingsState) => TSelected,
): TSelected {
  const store = useScheduleSettingsStore();
  return useStore(store, selector);
}
