'use client';

import { AppShell, Container } from '@mantine/core';
import { ReactNode } from 'react';

export interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <AppShell.Main
      style={{
        backgroundColor: 'var(--mantine-color-slate-0)',
        minHeight: '100vh',
      }}
    >
      <Container size="xl" py="lg" px={{ base: 'xs', sm: 'md', lg: 'xl' }}>
        {children}
      </Container>
    </AppShell.Main>
  );
}
