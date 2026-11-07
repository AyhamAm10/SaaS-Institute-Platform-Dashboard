import type { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * Query keys that do NOT depend on the active branch / academic year
 * (institute-wide or account data). Everything else is dropped when the
 * context changes, so a page never shows another year's rows while it
 * refetches. A new context-free query must be added here (tested).
 */
export const CONTEXT_FREE_QUERY_PREFIXES: readonly (readonly string[])[] = [
  ['auth'],
  ['branches'],
  ['academic-years'],
  ['academic-branches'],
  ['subjects'],
  ['student-fields'],
  ['schedule-config'],
  ['institutes'],
  ['staff'],
  ['reports', 'catalog'],
  ['reports', 'verify'],
];

export function isContextFreeQuery(key: QueryKey): boolean {
  return CONTEXT_FREE_QUERY_PREFIXES.some((prefix) => prefix.every((part, i) => key[i] === part));
}

/**
 * Resets every context-dependent query to its initial state (no old data is
 * shown); the mounted ones refetch at once with the new headers.
 */
export function clearContextQueries(queryClient: QueryClient): Promise<void> {
  return queryClient.resetQueries({ predicate: (query) => !isContextFreeQuery(query.queryKey) });
}
