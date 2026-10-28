'use client';

import { AppShell, Box, Container } from '@mantine/core';
import { ReactNode } from 'react';

export interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <AppShell.Main
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'transparent',
      }}
    >
      <Box
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: 'var(--app-glass-bg)',
          backdropFilter: 'blur(26px)',
          WebkitBackdropFilter: 'blur(26px)',
          transition: 'background-color 200ms ease',
        }}
      >
        <Container fluid px={{ base: 'md', sm: 'lg', md: 'xl' }} py="md">
          {children}
        </Container>
      </Box>
    </AppShell.Main>
  );
}
