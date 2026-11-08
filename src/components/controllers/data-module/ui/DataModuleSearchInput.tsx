'use client';

import { Box, rem } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { AppInput } from '@/src/components/controllers/input';
import { inputText } from '@/src/core/format';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModuleSearchInputProps {
  placeholder?: string;
  width?: number | string;
  debounceMs?: number;
}

/**
 * Search box of the module: the typed text lives in the store (`searchInput`)
 * and is committed to `search` after the debounce. ZERO useState.
 */
export function DataModuleSearchInput({ placeholder, width = rem(320), debounceMs = 300 }: DataModuleSearchInputProps) {
  const searchInput = useDataModuleMirror('searchInput');
  const storePlaceholder = useDataModuleMirror('searchPlaceholder');
  const setSearchInput = useDataModuleMirror('setSearchInput');
  const setSearch = useDataModuleMirror('setSearch');
  const commitSearch = useDebouncedCallback((val: string) => setSearch(val), debounceMs);

  return (
    <Box style={{ width: typeof width === 'number' ? rem(width) : width, minWidth: rem(200) }}>
      <AppInput
        type="search"
        placeholder={placeholder ?? storePlaceholder}
        value={searchInput}
        onChange={(e: unknown) => {
          const value = inputText(e);
          setSearchInput(value);
          commitSearch(value);
        }}
      />
    </Box>
  );
}
