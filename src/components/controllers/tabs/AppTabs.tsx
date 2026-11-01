'use client';

import { useEffect, useState } from 'react';
import { AppTabsInitialProps } from './init/tabs.init';
import { createTabsStore, TabsContext } from './store/tabs.store';
import { AppTabsList } from './ui/AppTabsList';
import { AppTabsPanel } from './ui/AppTabsPanel';

/**
 * AppTabs
 *
 * One tab system for the whole dashboard (replaces ad-hoc Tabs / SegmentedControl).
 *
 * <AppTabs items={[{ value: 'info', label: 'البيانات' }]} value={tab} onChange={setTab}>
 *   <AppTabs.List />
 *   <AppTabs.Panel value="info">...</AppTabs.Panel>
 * </AppTabs>
 */
export function AppTabs(props: AppTabsInitialProps) {
  const [store] = useState(() => createTabsStore(props));

  useEffect(() => {
    store.getState().updateProps(props);
  }, [store, props.value, props.items, props.fullWidth, props.size, props.onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  return <TabsContext.Provider value={store}>{props.children}</TabsContext.Provider>;
}

AppTabs.List = AppTabsList;
AppTabs.Panel = AppTabsPanel;
