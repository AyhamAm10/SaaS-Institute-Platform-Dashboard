'use client';

import { Box, Card, Group, TextInput, rem } from '@mantine/core';
import { IconRefresh, IconSearch, IconX } from '@tabler/icons-react';
import { useSubjectsMirror } from '../store/useSubjectsMirror';
import { subjectsLabels } from '../static-data/subjects.data';
import { AppIconButton } from '@/src/components/controllers/button';

export interface SubjectsFiltersProps {
  onRefresh?: () => void;
}

/**
 * SubjectsFilters
 *
 * Search input and controls for the subjects list.
 * Pure presentation layer — reads and writes through useSubjectsMirror.
 * ZERO useState hooks.
 */
export function SubjectsFilters({ onRefresh }: SubjectsFiltersProps) {
  const search = useSubjectsMirror('search');
  const setSearch = useSubjectsMirror('setSearch');
  const isFetching = useSubjectsMirror('isFetching');

  return (
    <Card radius="xl" withBorder p="md" shadow="none">
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Box style={{ flex: 1, minWidth: rem(260) }}>
          <TextInput
            placeholder={subjectsLabels.searchPlaceholder}
            size="sm"
            radius="xl"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leftSection={<IconSearch size={16} color="var(--mantine-color-dimmed)" />}
            rightSection={
              search ? (
                <AppIconButton variant="ghost" label="مسح البحث" size="xs" onClick={() => setSearch('')}>
                  <IconX size={12} />
                </AppIconButton>
              ) : null
            }
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-gray-0)',
                border: '1px solid var(--mantine-color-gray-2)',
              },
            }}
          />
        </Box>

        <Group gap="xs">
          {onRefresh && (
            <AppIconButton label={subjectsLabels.refreshButton} size="lg" onClick={onRefresh} loading={isFetching}>
              <IconRefresh size={18} />
            </AppIconButton>
          )}
        </Group>
      </Group>
    </Card>
  );
}
