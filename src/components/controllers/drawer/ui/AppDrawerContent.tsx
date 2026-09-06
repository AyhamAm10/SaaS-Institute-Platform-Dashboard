'use client';

import { Box, Center, Loader, ScrollArea, Stack, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { useDrawerMirror } from '../store/useDrawerMirror';

export interface AppDrawerContentProps {
  children?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  padding?: string | number;
  className?: string;
}

export function AppDrawerContent({
  children,
  loading,
  loadingText = 'جاري التحميل...',
  padding = 'lg',
  className,
}: AppDrawerContentProps) {
  const storeLoading = useDrawerMirror('loading');
  const isLoading = loading ?? storeLoading;

  return (
    <Box style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
      <ScrollArea
        h="100%"
        type="auto"
        offsetScrollbars
        scrollbarSize={6}
        className={className}
      >
        <Box p={padding}>
          {isLoading ? (
            <Center py={60}>
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
      </ScrollArea>
    </Box>
  );
}
