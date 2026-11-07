'use client';

import { Alert, Center, Checkbox, Group, Loader, SimpleGrid, Stack, Table, Text } from '@mantine/core';
import { IconArrowRight, IconDeviceFloppy, IconPencilCheck } from '@tabler/icons-react';
import { AppButton, AppInput, AppPageHeader, AppSurface, StatusBadge } from '@/src/components/controllers';
import { formatDate, inputText } from '@/src/core/format';
import { useMarkSheetMirror } from '../store/mark-sheet.store';
import { liveStats, liveStatus, markError } from '../../../utils/exams.utils';
import { RESULT_STATUS_META, sheetLabels as labels } from '../../../static-data/exams.data';

/** Mark sheet: stats, one row per student with mark / absent / live status. ZERO useState hooks. */
export function MarkSheetView({ onSave }: { onSave: () => Promise<void> }) {
  const sheet = useMarkSheetMirror('sheet');
  const isLoading = useMarkSheetMirror('isLoading');
  const entries = useMarkSheetMirror('entries');
  const dirty = useMarkSheetMirror('dirty');
  const isSaving = useMarkSheetMirror('isSaving');
  const notice = useMarkSheetMirror('notice');
  const setMark = useMarkSheetMirror('setMark');
  const toggleAbsent = useMarkSheetMirror('toggleAbsent');

  if (isLoading || !sheet) {
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  }
  const { exam } = sheet;
  const maxMark = Number(exam.maxMark);
  const passMark = Number(exam.passMark);
  const stats = liveStats(entries, passMark);
  const tiles: [string, string | number][] = [
    [labels.stats.students, stats.students],
    [labels.stats.average, stats.average ?? '—'],
    [labels.stats.passed, stats.passed],
    [labels.stats.failed, stats.failed],
    [labels.stats.absent, stats.absent],
    [labels.stats.pending, stats.pending],
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <AppPageHeader
          icon={<IconPencilCheck size={22} />}
          title={exam.title}
          description={`${exam.section.name} · ${exam.subject.name} · ${formatDate(exam.examDate)} · ${labels.outOf(maxMark)}`}
        />
        <Group gap="xs">
          <AppButton variant="outline" href="/exams" leftSection={<IconArrowRight size={16} />}>
            {labels.back}
          </AppButton>
          <AppButton onClick={onSave} loading={isSaving} disabled={!dirty} leftSection={<IconDeviceFloppy size={16} />}>
            {labels.save}
          </AppButton>
        </Group>
      </Group>

      {notice && (
        <Alert color={notice.tone === 'success' ? 'green' : 'red'} variant="light" radius="md">
          {notice.text}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 3, sm: 6 }} spacing="sm">
        {tiles.map(([label, value]) => (
          <AppSurface key={label} level={2} radius="md" padding="sm">
            <Text size="xs" c="var(--app-text-muted)">
              {label}
            </Text>
            <Text fw={600}>{value}</Text>
          </AppSurface>
        ))}
      </SimpleGrid>

      <AppSurface level={1} radius="lg" padding="sm">
        {sheet.rows.length === 0 ? (
          <Text c="var(--app-text-muted)" ta="center" py="xl">
            {labels.noStudents}
          </Text>
        ) : (
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{labels.student}</Table.Th>
                <Table.Th w={160}>{labels.mark}</Table.Th>
                <Table.Th w={90}>{labels.absent}</Table.Th>
                <Table.Th w={120}>{labels.status}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sheet.rows.map((row) => {
                const entry = entries[row.student.id] ?? {
                  mark: '',
                  absent: false,
                };
                const meta = RESULT_STATUS_META[liveStatus(entry, passMark)];
                return (
                  <Table.Tr key={row.student.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {row.student.fullName}
                      </Text>
                      {!row.eligible && (
                        <Text size="xs" c="var(--app-text-muted)">
                          {labels.notEligible}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <AppInput
                        type="number"
                        size="sm"
                        value={entry.mark}
                        disabled={entry.absent}
                        // "" clears the error (undefined keeps the previous one in AppInput)
                        error={markError(entry, maxMark)}
                        onChange={(e: unknown) => setMark(row.student.id, inputText(e))}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Checkbox
                        checked={entry.absent}
                        onChange={() => toggleAbsent(row.student.id)}
                        aria-label={labels.absent}
                      />
                    </Table.Td>
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
        )}
      </AppSurface>
    </Stack>
  );
}
