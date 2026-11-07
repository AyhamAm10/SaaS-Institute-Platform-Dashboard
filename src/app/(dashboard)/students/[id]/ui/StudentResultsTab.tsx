'use client';

import { Center, Loader, Progress, SimpleGrid, Stack, Table, Text } from '@mantine/core';
import { AppSurface, StatusBadge } from '@/src/components/controllers';
import type { StudentResults } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import { RESULT_STATUS_META } from '../../../exams/static-data/exams.data';
import { profileLabels as labels } from '../static-data/student-profile.data';

/** Marks of the student and the average per subject. Props only. */
export function StudentResultsTab({ results, isLoading }: { results: StudentResults | null; isLoading: boolean }) {
  if (isLoading || !results) {
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  }
  if (results.results.length === 0) {
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noResults}
      </Text>
    );
  }

  return (
    <Stack gap="md">
      <Text size="sm" fw={500}>
        {labels.subjectAverages}
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
        {results.subjects.map((s) => (
          <AppSurface key={s.subjectId} level={2} radius="md" padding="sm">
            <Text size="sm" fw={500}>
              {s.subjectName}
            </Text>
            <Text size="xs" c="var(--app-text-muted)">
              {labels.averageOf(s.exams)}
            </Text>
            <Text fw={600}>{s.averagePercent === null ? '—' : `${s.averagePercent}%`}</Text>
            {s.averagePercent !== null && <Progress value={s.averagePercent} size="sm" radius="xl" />}
          </AppSurface>
        ))}
      </SimpleGrid>

      <AppSurface level={1} radius="lg" padding="sm">
        <Table verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{labels.exam}</Table.Th>
              <Table.Th>{labels.subject}</Table.Th>
              <Table.Th>{labels.date}</Table.Th>
              <Table.Th>{labels.mark}</Table.Th>
              <Table.Th>{labels.status}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {results.results.map((r) => {
              const meta = RESULT_STATUS_META[r.status];
              return (
                <Table.Tr key={r.id}>
                  <Table.Td>
                    {r.exam.title}
                    {r.exam.examType ? ` (${r.exam.examType.name})` : ''}
                  </Table.Td>
                  <Table.Td>{r.exam.subject.name}</Table.Td>
                  <Table.Td>{formatDate(r.exam.examDate.slice(0, 10))}</Table.Td>
                  <Table.Td>{r.mark === null ? '—' : `${r.mark} / ${Number(r.exam.maxMark)}`}</Table.Td>
                  <Table.Td>
                    <StatusBadge tone={meta.tone} variant="dot" size="xs">
                      {meta.label}
                    </StatusBadge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </AppSurface>
    </Stack>
  );
}
