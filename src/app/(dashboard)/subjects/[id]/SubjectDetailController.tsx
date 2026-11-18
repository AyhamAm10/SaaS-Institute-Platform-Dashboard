'use client';

import Link from 'next/link';
import { Center, Loader, Table, Text } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';
import { AppSurface, StatusBadge } from '@/src/components/controllers';
import { DetailPage } from '@/src/components/controllers/detail-page';
import { useSubjectDetailsQuery, useSubjectPlacementsQuery } from '@/src/core/api';
import { formatNumber } from '@/src/core/format';
import { subjectDetailLabels as labels } from './static-data/subject-detail.data';

/** Subject page: the sections that teach it, with weekly periods and teacher. */
export function SubjectDetailController({ id }: { id: number }) {
  const { data: subject, isLoading } = useSubjectDetailsQuery(id);
  const placements = useSubjectPlacementsQuery(id);
  if (isLoading || placements.isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (!subject)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );
  const rows = placements.data ?? [];

  return (
    <DetailPage
      icon={<IconBook size={22} />}
      title={subject.name}
      description={`${labels.taughtIn}: ${formatNumber(rows.length)}`}
      breadcrumbs={[{ label: labels.list, href: '/subjects' }, { label: subject.name }]}
    >
      {rows.length === 0 ? (
        <Text ta="center" py="xl" c="var(--app-text-muted)">
          {labels.noSections}
        </Text>
      ) : (
        <AppSurface level={1} radius="lg" padding="sm">
          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{labels.section}</Table.Th>
                <Table.Th>{labels.branch}</Table.Th>
                <Table.Th>{labels.teacher}</Table.Th>
                <Table.Th>{labels.periods}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((r) => (
                <Table.Tr key={r.sectionId}>
                  <Table.Td>
                    <Text component={Link} href={`/sections/${r.sectionId}`} size="sm" fw={500} c="inherit">
                      {r.sectionName}
                    </Text>
                  </Table.Td>
                  <Table.Td>{r.branchName ?? '—'}</Table.Td>
                  <Table.Td>
                    {r.teacherId ? (
                      <Text component={Link} href={`/teachers/${r.teacherId}`} size="sm" c="inherit">
                        {r.teacherName}
                      </Text>
                    ) : (
                      <StatusBadge size="xs">{labels.noTeacher}</StatusBadge>
                    )}
                  </Table.Td>
                  <Table.Td>{formatNumber(r.weeklyPeriods)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </AppSurface>
      )}
    </DetailPage>
  );
}
