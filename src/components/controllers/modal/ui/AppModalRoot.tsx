'use client';

import { Box, Modal, rem } from '@mantine/core';
import { ReactNode } from 'react';
import { useModalMirror } from '../store/useModalMirror';

export interface AppModalRootProps {
  children?: ReactNode;
  zIndex?: number;
  className?: string;
}

export function AppModalRoot({ children, zIndex = 350, className }: AppModalRootProps) {
  const opened = useModalMirror('opened');
  const close = useModalMirror('close');
  const config = useModalMirror('config');

  return (
    <Modal
      opened={opened}
      onClose={close}
      size={config.size}
      centered={config.centered}
      radius={config.radius}
      withCloseButton={false} // Header component owns close button
      closeOnClickOutside={config.closeOnClickOutside}
      closeOnEscape={config.closeOnEscape}
      padding={0} // Inner content owns its padding
      zIndex={zIndex}
      className={className}
      styles={{
        content: {
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          overflow: 'hidden',
          direction: 'rtl',
          borderRadius: rem(20),
          boxShadow: 'var(--app-dropdown-shadow)',
          border: '1px solid var(--app-border)',
          backgroundColor: 'var(--app-surface)',
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: 0,
          overflow: 'hidden',
        },
      }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Modal>
  );
}
