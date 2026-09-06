'use client';

import React from 'react';
import { Box, Flex, rem } from '@mantine/core';
import { LoginForm } from './LoginForm';
import { LoginHeroPanel } from './LoginHeroPanel';

/**
 * Pure presentation layout assembling the Login view.
 * Displays the Login Card alongside the full-height Hero Vector Illustration.
 */
export function LoginView() {
  return (
    <Box
      mih="100vh"
      h="100vh"
      style={{
        background: 'linear-gradient(135deg, #f8fbfd 0%, #edf6fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="center"
        w="100%"
        h="100vh"
        style={{
          margin: 0,
          padding: 0,
        }}
      >
        {/* Form Container centered in its section, shifted gently to the left */}
        <Box
          style={{
            flex: 1,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: rem(32),
            paddingRight: rem(72),
            paddingLeft: rem(24),
            zIndex: 2,
          }}
        >
          <LoginForm />
        </Box>

        {/* Hero Illustration touching full screen height */}
        <LoginHeroPanel />
      </Flex>
    </Box>
  );
}
