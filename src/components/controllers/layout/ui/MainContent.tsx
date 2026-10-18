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
      <Container fluid px={{ base: 'md', sm: 'lg', md: 'xl' }} py="md">
        {children}
      </Container>
    </AppShell.Main>
  );
}
