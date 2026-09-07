'use client';

import { Box, Stack } from '@mantine/core';
import { InstitutesHeader } from './InstitutesHeader';
import { InstitutesFilters } from './InstitutesFilters';
import { InstitutesTable } from './InstitutesTable';
import { CreateInstituteDrawer } from './CreateInstituteDrawer';
import { InstituteDetailsDrawer } from './InstituteDetailsDrawer';

export interface InstitutesViewProps {
  onRefresh?: () => void;
  onCreateSubmit: () => Promise<void>;
}

/**
 * InstitutesView
 *
 * Presentation container layout for the Institutes management page.
 * Strictly adheres to role.md.
 */
export function InstitutesView({ onRefresh, onCreateSubmit }: InstitutesViewProps) {
  return (
    <Box p={{ base: 'xs', sm: 'md' }}>
      <Stack gap="xl">
        <InstitutesHeader />
        <InstitutesFilters onRefresh={onRefresh} />
        <InstitutesTable />
        <CreateInstituteDrawer onSubmit={onCreateSubmit} />
        <InstituteDetailsDrawer />
      </Stack>
    </Box>
  );
}
