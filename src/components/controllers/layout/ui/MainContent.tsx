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
        backgroundColor: 'var(--app-bg)',
        minHeight: '100vh',
        transition: 'background-color 200ms ease',
      }}
    >
      <Container fluid px={{ base: 'md', sm: 'lg', md: 'xl' }} py="md">
        {children}
      </Container>
    </AppShell.Main>
  );
}
