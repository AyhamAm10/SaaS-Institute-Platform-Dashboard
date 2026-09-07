'use client';

import { ActionIcon, Box, Card, Group, TextInput, Tooltip, rem } from '@mantine/core';
import { IconRefresh, IconSearch, IconX } from '@tabler/icons-react';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';

export interface InstitutesFiltersProps {
  onRefresh?: () => void;
}

/**
 * InstitutesFilters
 *
 * Search input and quick controls for the institutes list.
 * Pure presentation layer — reads and writes through useInstitutesMirror.
 */
export function InstitutesFilters({ onRefresh }: InstitutesFiltersProps) {
  const search = useInstitutesMirror('search');
  const setSearch = useInstitutesMirror('setSearch');
  const isFetching = useInstitutesMirror('isFetching');

  return (
    <Card radius="xl" withBorder p="md" shadow="none">
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Box style={{ flex: 1, minWidth: rem(260) }}>
          <TextInput
            placeholder={institutesLabels.searchPlaceholder}
            size="sm"
            radius="xl"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leftSection={<IconSearch size={16} color="var(--mantine-color-dimmed)" />}
            rightSection={
              search ? (
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={() => setSearch('')}
                  aria-label="مسح البحث"
                >
                  <IconX size={12} />
                </ActionIcon>
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
            <Tooltip label={institutesLabels.refreshButton} withArrow position="top">
              <ActionIcon
                variant="light"
                color="primary"
                size="lg"
                radius="xl"
                onClick={onRefresh}
                loading={isFetching}
                aria-label={institutesLabels.refreshButton}
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>
    </Card>
  );
}
