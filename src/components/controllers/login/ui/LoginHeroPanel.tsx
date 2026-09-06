'use client';

import React from 'react';
import Image from 'next/image';
import { Box } from '@mantine/core';
import loginHeroImage from '@/src/assets/login-hero.png';

/**
 * LoginHeroPanel
 *
 * Displays the hero illustration filling the full 100vh height
 * without any margin or padding.
 */
export function LoginHeroPanel() {
  return (
    <Box
      visibleFrom="md"
      style={{
        flex: 1,
        height: '100vh',
        maxHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glow */}
      <Box
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(circle at center, rgba(32, 183, 223, 0.16) 0%, rgba(20, 184, 166, 0.06) 55%, transparent 75%)',
          filter: 'blur(50px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <Image
        src={loginHeroImage}
        alt="SaaS Platform Educational Hero Illustration"
        priority
        style={{
          width: '100%',
          height: '100vh',
          maxHeight: '100vh',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
          margin: 0,
          padding: 0,
          filter: 'drop-shadow(0 14px 28px rgba(10, 25, 45, 0.08))',
        }}
      />
    </Box>
  );
}
