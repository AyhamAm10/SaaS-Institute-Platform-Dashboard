'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/src/core/auth';
import { SETTINGS_TABS, SettingsTabKey } from './static-data/settings-tabs.data';
import { createSettingsStore, SettingsContext } from './store/settings.store';
import { SettingsView } from './ui/SettingsView';

export function SettingsController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { can } = useAuth();

  const permittedTabs = useMemo(() => {
    return SETTINGS_TABS.filter((t) => can(t.permission)).map((t) => t.key);
  }, [can]);

  const defaultTab = permittedTabs[0] || 'institute';
  const urlTab = searchParams.get('tab') as SettingsTabKey | null;
  const initialTab = urlTab && permittedTabs.includes(urlTab) ? urlTab : defaultTab;

  const [store] = useState(() => createSettingsStore(initialTab, permittedTabs));

  // Sync permitted tabs when auth changes
  useEffect(() => {
    store.getState().setPermittedTabs(permittedTabs);
    const current = store.getState().activeTab;
    if (!permittedTabs.includes(current) && permittedTabs.length > 0) {
      const fallback = permittedTabs[0];
      store.getState().setActiveTab(fallback);
      router.replace(`/settings?tab=${fallback}`);
    }
  }, [permittedTabs, store, router]);

  // Sync with URL when search params change
  useEffect(() => {
    if (urlTab && permittedTabs.includes(urlTab)) {
      if (store.getState().activeTab !== urlTab) {
        store.getState().setActiveTab(urlTab);
      }
    } else if (permittedTabs.length > 0) {
      router.replace(`/settings?tab=${initialTab}`);
    }
  }, [urlTab, permittedTabs, initialTab, store, router]);

  const handleTabChange = useCallback(
    (val: string | null) => {
      if (!val) return;
      const key = val as SettingsTabKey;
      if (permittedTabs.includes(key)) {
        store.getState().setActiveTab(key);
        router.replace(`/settings?tab=${key}`);
      }
    },
    [permittedTabs, router, store],
  );

  return (
    <SettingsContext.Provider value={store}>
      <SettingsView onTabChange={handleTabChange} />
    </SettingsContext.Provider>
  );
}

