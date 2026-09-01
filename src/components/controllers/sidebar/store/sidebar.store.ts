'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { defaultNavigationConfig } from '../init/navigation';
import { SidebarState, SidebarInitialProps } from '../state/sidebar.state';
import { findInitialOpenedSections } from '../utils/nav.utils';

export type SidebarStore = ControllerStoreApi<SidebarState>;

export function createSidebarStore(props?: SidebarInitialProps): SidebarStore {
  const initialItems = props?.items ?? defaultNavigationConfig;
  const initialActive = props?.initialRoute ?? '/';
  const initialCollapsed = props?.defaultCollapsed ?? false;
  const initialSections = findInitialOpenedSections(initialItems, initialActive);

  return createControllerStore<SidebarState>((set) => ({
    items: initialItems,
    isDesktopCollapsed: initialCollapsed,
    isMobileOpen: false,
    activeRoute: initialActive,
    openedSections: initialSections,

    toggleDesktopCollapse: () =>
      set((state) => ({ isDesktopCollapsed: !state.isDesktopCollapsed })),

    setDesktopCollapse: (collapsed: boolean) =>
      set({ isDesktopCollapsed: collapsed }),

    toggleMobile: () =>
      set((state) => ({ isMobileOpen: !state.isMobileOpen })),

    openMobile: () => set({ isMobileOpen: true }),

    closeMobile: () => set({ isMobileOpen: false }),

    setActiveRoute: (route: string) =>
      set((state) => ({
        activeRoute: route,
        openedSections: Array.from(
          new Set([...state.openedSections, ...findInitialOpenedSections(state.items, route)]),
        ),
      })),

    toggleSection: (sectionKey: string) =>
      set((state) => {
        const exists = state.openedSections.includes(sectionKey);
        return {
          openedSections: exists
            ? state.openedSections.filter((k) => k !== sectionKey)
            : [...state.openedSections, sectionKey],
        };
      }),
  }));
}

export const SidebarContext = createContext<SidebarStore | null>(null);

export function useSidebarStore(): SidebarStore {
  const store = useContext(SidebarContext);
  if (!store) {
    throw new Error(
      'useSidebarStore must be used within a <SidebarController> component hierarchy.',
    );
  }
  return store;
}
