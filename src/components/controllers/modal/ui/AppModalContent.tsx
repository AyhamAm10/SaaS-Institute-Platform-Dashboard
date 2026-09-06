'use client';

import { Box, Center, Loader, ScrollArea, Stack, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { useModalMirror } from '../store/useModalMirror';

export interface AppModalContentProps {
  children?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  padding?: string | number;
  maxHeight?: number | string;
  className?: string;
}

export function AppModalContent({
  children,
  loading,
  loadingText = 'جاري التحميل...',
  padding = 'lg',
  maxHeight = '70vh',
  className,
}: AppModalContentProps) {
  const storeLoading = useModalMirror('loading');
  const isLoading = loading ?? storeLoading;

  return (
    <Box style={{ flex: 1, minHeight: 0, position: 'relative' }}>
      <ScrollArea.Autosize
        mah={maxHeight}
        type="auto"
        scrollbarSize={6}
        className={className}
      >
        <Box p={padding}>
          {isLoading ? (
            <Center py={40}>
              <Stack align="center" gap="sm">
                <Loader size="md" color="primary" />
                <Text size="sm" c="dimmed">
                  {loadingText}
                </Text>
              </Stack>
            </Center>
          ) : (
            children
          )}
        </Box>
      </ScrollArea.Autosize>
    </Box>
  );
}
