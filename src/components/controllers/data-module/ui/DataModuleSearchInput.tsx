'use client';

import { Box, rem } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useState } from 'react';
import { AppInput } from '@/src/components/controllers/input';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModuleSearchInputProps {
  placeholder?: string;
  width?: number | string;
  debounceMs?: number;
}

export function DataModuleSearchInput({
  placeholder,
  width = rem(280),
  debounceMs = 300,
}: DataModuleSearchInputProps) {
  const storeSearch = useDataModuleMirror('search');
  const storePlaceholder = useDataModuleMirror('searchPlaceholder');
  const setSearch = useDataModuleMirror('setSearch');

  const [localValue, setLocalValue] = useState(storeSearch);
  const [prevStoreSearch, setPrevStoreSearch] = useState(storeSearch);

  if (storeSearch !== prevStoreSearch) {
    setPrevStoreSearch(storeSearch);
    setLocalValue(storeSearch);
  }

  const debouncedSetSearch = useDebouncedCallback((val: string) => {
    setSearch(val);
  }, debounceMs);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | number | string,
  ) => {
    const val = typeof e === 'string' ? e : typeof e === 'number' ? String(e) : e?.target?.value ?? '';
    setLocalValue(val);
    debouncedSetSearch(val);
  };

  return (
    <Box style={{ width: typeof width === 'number' ? rem(width) : width, minWidth: rem(200) }}>
      <AppInput
        type="search"
        placeholder={placeholder ?? storePlaceholder}
        value={localValue}
        onChange={handleChange}
      />
    </Box>
  );
}
