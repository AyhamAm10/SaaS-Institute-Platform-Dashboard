'use client';

import Link from 'next/link';
import { Center, Loader, Table, Text } from '@mantine/core';
import { IconCalendar, IconInfoCircle, IconUsers } from '@tabler/icons-react';
import { AppSurface, DetailList, StatusBadge } from '@/src/components/controllers';
import { DetailPage, type DetailPageTab } from '@/src/components/controllers/detail-page';
import { useAcademicYearQuery, useAcademicYearSectionsQuery } from '@/src/core/api';
import { formatDate, formatNumber } from '@/src/core/format';
import { yearDetailLabels as labels } from './static-data/year-detail.data';

const icon = { size: 16, stroke: 1.6 };

/** Sections of the year (own query, loaded only when the tab opens). */
function YearSections({ id }: { id: number }) {
  const { data, isLoading } = useAcademicYearSectionsQuery(id);
  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (!data || data.length === 0)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noSections}
      </Text>
    );
  return (
    <AppSurface level={1} radius="lg" padding="sm">
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{labels.section}</Table.Th>
            <Table.Th>{labels.branch}</Table.Th>
            <Table.Th>{labels.students}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((s) => (
            <Table.Tr key={s.id}>
              <Table.Td>
                <Text component={Link} href={`/sections/${s.id}`} size="sm" fw={500} c="inherit">
                  {s.name}
                </Text>
              </Table.Td>
              <Table.Td>{s.branch?.name ?? '—'}</Table.Td>
              <Table.Td>{formatNumber(s._count?.studentEnrollments ?? 0)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </AppSurface>
  );
}

/** Academic year page: its dates and the sections that belong to it. */
export function AcademicYearDetailController({ id }: { id: number }) {
  const { data: year, isLoading } = useAcademicYearQuery(id);
  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (!year)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );

  const tabs: DetailPageTab[] = [
    {
      value: 'overview',
      label: labels.tabOverview,
      icon: <IconInfoCircle {...icon} />,
      content: (
        <AppSurface level={2} radius="lg" padding="md">
          <DetailList
            columns={2}
            items={[
              { label: labels.start, value: formatDate(year.startDate.slice(0, 10)) },
              { label: labels.end, value: formatDate(year.endDate.slice(0, 10)) },
            ]}
          />
        </AppSurface>
      ),
    },
    { value: 'sections', label: labels.tabSections, icon: <IconUsers {...icon} />, content: <YearSections id={year.id} /> },
  ];

  return (
    <DetailPage
      icon={<IconCalendar size={22} />}
      title={year.name}
      description={`${formatDate(year.startDate.slice(0, 10))} – ${formatDate(year.endDate.slice(0, 10))}`}
      badge={year.isCurrent && <StatusBadge tone="success" size="sm">{labels.current}</StatusBadge>}
      breadcrumbs={[{ label: labels.list, href: '/academic-years' }, { label: year.name }]}
      tabs={tabs}
    />
  );
}
