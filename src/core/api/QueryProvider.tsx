'use client';

import { ReactNode, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from './query-client';

export interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Root QueryProvider supplying the React Query client context.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
