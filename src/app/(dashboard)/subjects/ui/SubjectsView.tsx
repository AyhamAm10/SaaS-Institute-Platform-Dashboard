'use client';

import { Box, Stack } from '@mantine/core';
import { SubjectsHeader } from './SubjectsHeader';
import { SubjectsFilters } from './SubjectsFilters';
import { SubjectsTable } from './SubjectsTable';
import { SubjectDrawer } from './SubjectDrawer';
import { SubjectDeleteModal } from './SubjectDeleteModal';
import { Subject } from '@/src/core/api';

export interface SubjectsViewProps {
  onRefresh?: () => void;
  onSubmit: () => Promise<void>;
  onConfirmDelete: (subject: Subject) => Promise<void>;
}

/**
 * SubjectsView
 *
 * Presentation container layout for the Subjects page.
 * Strictly adheres to role.md.
 * ZERO useState hooks.
 */
export function SubjectsView({
  onRefresh,
  onSubmit,
  onConfirmDelete,
}: SubjectsViewProps) {
  return (
    <Box p={{ base: 'xs', sm: 'md' }}>
      <Stack gap="xl">
        <SubjectsHeader />
        <SubjectsFilters onRefresh={onRefresh} />
        <SubjectsTable />
        <SubjectDrawer onSubmit={onSubmit} />
        <SubjectDeleteModal onConfirmDelete={onConfirmDelete} />
      </Stack>
    </Box>
  );
}
