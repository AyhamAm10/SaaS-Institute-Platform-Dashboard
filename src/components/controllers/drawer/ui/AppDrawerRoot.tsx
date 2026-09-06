'use client';

import { Box, Drawer } from '@mantine/core';
import { ReactNode } from 'react';
import { useDrawerMirror } from '../store/useDrawerMirror';
import { AppDrawerHeader } from './AppDrawerHeader';
import { AppDrawerContent } from './AppDrawerContent';

export interface AppDrawerRootProps {
  children?: ReactNode;
  zIndex?: number;
  className?: string;
}

export function AppDrawerRoot({ children, zIndex = 300, className }: AppDrawerRootProps) {
  const opened = useDrawerMirror('opened');
  const close = useDrawerMirror('close');
  const title = useDrawerMirror('title');
  const config = useDrawerMirror('config');

  // If children are provided, we check if they are compound components or simple content
  return (
    <Drawer
      opened={opened}
      onClose={close}
      size={config.size}
      position={config.position}
      withCloseButton={false} // Header component owns close button
      closeOnClickOutside={config.closeOnClickOutside}
      closeOnEscape={config.closeOnEscape}
      padding={0} // Outer drawer padding 0; layout areas control their own padding
      zIndex={zIndex}
      className={className}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
          direction: 'rtl',
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
          padding: 0,
          overflow: 'hidden',
        },
        inner: {
          direction: 'ltr',
          justifyContent: 'flex-end', // Physical right docking adherence (role.md Section 5.3)
        },
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
}
