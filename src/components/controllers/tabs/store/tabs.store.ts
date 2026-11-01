import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { TabsState, createInitialTabsState } from '../state/tabs.state';
import { AppTabsInitialProps, resolveTabsConfig } from '../init/tabs.init';

export type TabsStore = ControllerStoreApi<TabsState>;

export function createTabsStore(props: AppTabsInitialProps): TabsStore {
  const initial = createInitialTabsState(props);

  return createControllerStore<TabsState>((set, get) => ({
    ...initial,

    setActive: (value: string) => {
      const { rawProps } = get();
      // Controlled mode: only the parent decides; uncontrolled: update locally.
      if (rawProps.value === undefined) set({ active: value });
      rawProps.onChange?.(value);
    },

    updateProps: (props: AppTabsInitialProps) => {
      set({
        rawProps: props,
        items: props.items,
        config: resolveTabsConfig(props),
        ...(props.value !== undefined && props.value !== null && { active: props.value }),
      });
    },
  }));
}

export const TabsContext = createContext<TabsStore | null>(null);

export function useTabsStore(): TabsStore {
  const store = useContext(TabsContext);
  if (!store) {
    throw new Error('useTabsStore must be used within an <AppTabs> component hierarchy.');
  }
  return store;
}
