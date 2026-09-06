'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { DrawerState, createInitialDrawerState } from '../state/drawer.state';
import { AppDrawerInitialProps, resolveDrawerConfig } from '../init/drawer.init';

export type DrawerStore = ControllerStoreApi<DrawerState>;

export function createDrawerStore(initialProps: AppDrawerInitialProps): DrawerStore {
  const initial = createInitialDrawerState(initialProps);

  return createControllerStore<DrawerState>((set, get) => ({
    ...initial,

    close: () => {
      get().rawProps.onClose();
    },

    setLoading: (loading: boolean) => set({ loading }),

    updateProps: (props: AppDrawerInitialProps) => {
      const config = resolveDrawerConfig(props);
      set({
        rawProps: props,
        config,
        opened: props.opened,
        loading: props.loading !== undefined ? props.loading : get().loading,
        title: props.title !== undefined ? props.title : get().title,
        description: props.description !== undefined ? props.description : get().description,
        icon: props.icon !== undefined ? props.icon : get().icon,
      });
    },
  }));
}

export const DrawerContext = createContext<DrawerStore | null>(null);

export function useDrawerStore(): DrawerStore {
  const store = useContext(DrawerContext);
  if (!store) {
    throw new Error('useDrawerStore must be used within an <AppDrawer> component hierarchy.');
  }
  return store;
}
