'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { LayoutState, LayoutInitialProps } from '../state/layout.state';

export type LayoutStore = ControllerStoreApi<LayoutState>;

export function createLayoutStore(props?: LayoutInitialProps): LayoutStore {
  return createControllerStore<LayoutState>((set) => ({
    headerHeight: props?.headerHeight ?? 64,
    searchQuery: '',
    isSearchOpen: false,

    setSearchQuery: (query: string) => set({ searchQuery: query }),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    openSearch: () => set({ isSearchOpen: true }),
    closeSearch: () => set({ isSearchOpen: false }),
  }));
}

export const LayoutContext = createContext<LayoutStore | null>(null);

export function useLayoutStore(): LayoutStore {
  const store = useContext(LayoutContext);
  if (!store) {
    throw new Error(
      'useLayoutStore must be used within a <LayoutController> component hierarchy.',
    );
  }
  return store;
}
