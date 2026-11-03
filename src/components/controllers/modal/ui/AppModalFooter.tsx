'use client';

import { Box, Flex } from '@mantine/core';
import { ReactNode } from 'react';
import { AppModalCancel } from './AppModalCancel';
import { AppModalConfirm } from './AppModalConfirm';

export interface AppModalFooterProps {
  children?: ReactNode;
  className?: string;
}

/** Action row: actions sit at the end side; a FooterStart (if any) takes the start side. */
export function AppModalFooter({ children, className }: AppModalFooterProps) {
  return (
    <Box
      px="xl"
      pt="sm"
      pb="xl"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <Flex justify="flex-end" align="center" gap="sm" wrap="wrap">
        {children ?? (
          <>
            <AppModalCancel />
            <AppModalConfirm />
          </>
        )}
      </Flex>
    </Box>
  );
}
