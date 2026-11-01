'use client';

import React from 'react';
import { Box, Flex, rem } from '@mantine/core';
import { AppAmbient } from '../../ambient';
import { LoginForm } from './LoginForm';
import { LoginHeroPanel } from './LoginHeroPanel';

/**
 * Pure presentation layout assembling the Login view:
 * living orange blobs behind a glass sign-in card and the institute brand panel.
 */
export function LoginView() {
  return (
    <Box
      mih="100dvh"
      style={{
        position: 'relative',
        backgroundColor: 'var(--app-bg)',
        overflow: 'hidden',
      }}
    >
      <AppAmbient variant="login" />

      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="center"
        gap={{ base: 'xl', md: rem(64) }}
        mih="100dvh"
        px={{ base: 'md', sm: 'xl' }}
        py="xl"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <LoginForm />
        <LoginHeroPanel />
      </Flex>
    </Box>
  );
}
