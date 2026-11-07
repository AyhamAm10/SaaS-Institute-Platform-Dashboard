'use client';

import type { ReactNode } from 'react';
import { Center, Loader } from '@mantine/core';
import { useContextReady } from '@/src/core/context';
import { useOperationalContextResolver } from './useOperationalContextResolver';
import { ContextCacheSync } from './ContextCacheSync';

/**
 * Renders its children only once the operational context (branch + year)
 * is resolved, so no page ever loads data with a missing or stale context.
 * Used by the dashboard layout and the print layout.
 */
export function OperationalContextGate({ children }: { children: ReactNode }) {
  useOperationalContextResolver();
  const ready = useContextReady();

  return (
    <>
      <ContextCacheSync />
      {ready ? (
        children
      ) : (
        <Center py={80}>
          <Loader size="sm" color="primary" />
        </Center>
      )}
    </>
  );
}
