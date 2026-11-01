'use client';

import { AppShell, Container } from '@mantine/core';
import { ReactNode } from 'react';

export interface MainContentProps {
  children: ReactNode;
}

/**
 * Main content area. Intentionally transparent and un-blurred:
 * the glass effect belongs to the cards, so the ambient blobs stay visible between them.
 */
export function MainContent({ children }: MainContentProps) {
  return (
    <AppShell.Main style={{ position: 'relative', minHeight: '100vh' }}>
      <Container fluid px={{ base: 'md', sm: 'lg', md: 'xl' }} pt="lg" pb="xl">
        {children}
      </Container>
    </AppShell.Main>
  );
}
