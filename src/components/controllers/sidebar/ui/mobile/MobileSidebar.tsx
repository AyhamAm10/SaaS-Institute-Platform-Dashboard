'use client';

import { Box, Drawer, ScrollArea } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSidebarMirror } from '../../store/useSidebarMirror';
import { SidebarBrand } from '../shared/SidebarBrand';
import { SidebarNavList } from '../shared/SidebarNavList';
import { SidebarLogout } from '../shared/SidebarLogout';

/** Mobile sidebar: floating glass drawer reusing the shared brand / nav / logout pieces. */
export function MobileSidebar() {
  const isOpen = useSidebarMirror('isMobileOpen');
  const close = useSidebarMirror('closeMobile');
  const setActiveRoute = useSidebarMirror('setActiveRoute');
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname);
      close(); // Auto-close drawer on route change
    }
  }, [pathname, setActiveRoute, close]);

  return (
    <Drawer
      opened={isOpen}
      onClose={close}
      size={300}
      padding="md"
      position="right"
      hiddenFrom="md"
      title={<SidebarBrand />}
    >
      <ScrollArea h="calc(100dvh - 190px)" offsetScrollbars>
        <SidebarNavList onNavigate={close} />
      </ScrollArea>

      <Box pt="md" mt="sm" style={{ borderTop: '1px solid var(--app-border)' }}>
        <SidebarLogout onBeforeLogout={close} />
      </Box>
    </Drawer>
  );
}
