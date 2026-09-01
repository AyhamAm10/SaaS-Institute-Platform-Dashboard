'use client';

import { useState, ReactNode } from 'react';
import { SidebarInitialProps } from './state/sidebar.state';
import { createSidebarStore, SidebarContext } from './store/sidebar.store';
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
export function SidebarController(props: SidebarControllerProps) {
  const [store] = useState(() => createSidebarStore(props));

  return (
    <SidebarContext.Provider value={store}>
      {props.children ?? <SidebarFactory />}
    </SidebarContext.Provider>
  );
}
