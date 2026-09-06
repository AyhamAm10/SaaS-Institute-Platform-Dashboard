'use client';

import { Pagination } from '@mantine/core';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModulePaginationProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function DataModulePagination({ size = 'sm' }: DataModulePaginationProps) {
  const page = useDataModuleMirror('page');
  const totalPages = useDataModuleMirror('totalPages');
  const setPage = useDataModuleMirror('setPage');

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination
      value={page}
      onChange={setPage}
      total={totalPages}
      radius="xl"
      size={size}
      withEdges
    />
  );
}
