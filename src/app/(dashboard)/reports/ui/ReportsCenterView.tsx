'use client';

import { Center, Chip, Group, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconReportAnalytics, IconSearch } from '@tabler/icons-react';
import { AppEmptyState, AppInput, AppPageHeader } from '@/src/components/controllers';
import type { ReportCategory } from '@/src/core/api';
import { inputText } from '@/src/core/format';
import { useReportsCenterMirror } from '../store/reports-center.store';
import { CATEGORY_META, reportsLabels as labels } from '../static-data/reports.data';
import { filterCatalog, groupCatalog } from '../utils/reports.utils';
import { ReportCard } from './ReportCard';

/** Reports center: search, category filter and the grouped cards. ZERO useState hooks. */
export function ReportsCenterView() {
  const catalog = useReportsCenterMirror('catalog');
  const isLoading = useReportsCenterMirror('isLoading');
  const search = useReportsCenterMirror('search');
  const category = useReportsCenterMirror('category');
  const setSearch = useReportsCenterMirror('setSearch');
  const setCategory = useReportsCenterMirror('setCategory');
  const groups = groupCatalog(filterCatalog(catalog, search, category));
  const categories = groupCatalog(catalog).map((g) => ({ value: g.category, label: CATEGORY_META[g.category].label }));

  return (
    <Stack gap="lg">
      <AppPageHeader icon={<IconReportAnalytics size={22} />} title={labels.title} description={labels.description} />

      <Group justify="space-between" wrap="wrap" gap="sm">
        <AppInput
          placeholder={labels.search}
          value={search}
          onChange={(e: unknown) => setSearch(inputText(e))}
          leftSection={<IconSearch size={16} />}
          w={{ base: '100%', sm: 320 }}
        />
        {categories.length > 1 && (
          <Chip.Group multiple={false} value={category} onChange={(v) => setCategory(v as ReportCategory | 'all')}>
            <Group gap={6} wrap="wrap">
              {[{ value: 'all', label: labels.all }, ...categories].map((c) => (
                <Chip key={c.value} value={c.value} size="xs" radius="xl" variant="light">
                  {c.label}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
        )}
      </Group>

      {isLoading ? (
        <Center py="xl">
          <Loader size="sm" color="primary" />
        </Center>
      ) : groups.length === 0 ? (
        <AppEmptyState
          icon={<IconReportAnalytics size={26} />}
          title={catalog.length === 0 ? labels.noAccess : labels.empty}
          description={catalog.length === 0 ? undefined : labels.emptyHint}
        />
      ) : (
        groups.map(({ category: key, reports }) => {
          const meta = CATEGORY_META[key];
          const Icon = meta.icon;
          return (
            <Stack key={key} gap="sm">
              <Group gap="xs">
                <Icon size={18} stroke={1.7} />
                <Text fw={600}>{meta.label}</Text>
                <Text size="xs" c="var(--app-text-muted)">
                  · {meta.description}
                </Text>
              </Group>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
                {reports.map((report) => (
                  <ReportCard key={report.key} report={report} />
                ))}
              </SimpleGrid>
            </Stack>
          );
        })
      )}
    </Stack>
  );
}
