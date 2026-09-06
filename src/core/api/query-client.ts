import { QueryClient } from '@tanstack/react-query';
import { tokenRefreshHandler } from './refresh';

/**
 * Creates and configures a TanStack QueryClient instance.
 */
export function createQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes
        refetchOnWindowFocus: false,
        retry: (failureCount, error: unknown) => {
          // Do not retry 401, 403, or 404 client errors
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          if (status === 401 || status === 403 || status === 404) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });

  // Wire auth failure callback to clear query cache
  tokenRefreshHandler.setOnAuthFailure(() => {
    queryClient.clear();
    if (
      typeof window !== 'undefined' &&
      !window.location?.pathname?.startsWith('/login')
    ) {
      window.location.replace('/login');
    }
  });

  return queryClient;
}
