'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarInitialProps } from './state/sidebar.state';
import { createSidebarStore, SidebarContext, type SidebarStore } from './store/sidebar.store';
import { SidebarFactory } from './ui/SidebarFactory';

export interface SidebarControllerProps extends SidebarInitialProps {
  children?: ReactNode;
}

/**
 * SidebarController
 *
 * Owns the state, store, and responsive visual composition of the Sidebar.
 * Every instance of SidebarController gets its own independent Zustand store.
 */
/**
 * Router → store: marks the active route and closes the mobile drawer on
 * navigation (one place for desktop and mobile; ui/ stays effect-free).
 */
function RouteSync({ store }: { store: SidebarStore }) {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname) return;
    store.getState().setActiveRoute(pathname);
    store.getState().closeMobile();
  }, [pathname, store]);
  return null;
}

export function SidebarController(props: SidebarControllerProps) {
  const [store] = useState(() => createSidebarStore(props));

  return (
    <SidebarContext.Provider value={store}>
      <RouteSync store={store} />
      {props.children ?? <SidebarFactory />}
    </SidebarContext.Provider>
  );
}
