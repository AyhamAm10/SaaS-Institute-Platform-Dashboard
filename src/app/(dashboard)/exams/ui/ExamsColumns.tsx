'use client';

import { Group, Stack, Text } from '@mantine/core';
import { IconEdit, IconPencilCheck, IconTrash } from '@tabler/icons-react';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppButton, AppIconButton, ReportMenu, StatusBadge } from '@/src/components/controllers';
import type { Exam } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import { examsLabels as labels } from '../static-data/exams.data';

export interface ExamsAccess {
  canManage: boolean;
  canEnterMarks: boolean;
}

export function getExamsColumns(
  onEdit: (exam: Exam) => void,
  onDelete: (exam: Exam) => void,
  access: ExamsAccess = { canManage: true, canEnterMarks: true },
): DataModuleColumn<Exam>[] {
  return [
    {
      key: 'title',
      title: labels.colTitle,
      exportValue: (e) => (e.examType ? `${e.title} (${e.examType.name})` : e.title),
      exportKind: 'text',
      render: (e) => (
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            {e.title}
          </Text>
          {e.examType && (
            <StatusBadge tone="info" size="xs">
              {e.examType.name}
            </StatusBadge>
          )}
        </Stack>
      ),
    },
    {
      key: 'section',
      title: labels.colSection,
      exportValue: (e) => `${e.section.name} - ${e.subject.name}`,
      exportKind: 'text',
      render: (e) => (
        <Stack gap={0}>
          <Text size="sm">{e.section.name}</Text>
          <Text size="xs" c="var(--app-text-muted)">
            {e.subject.name}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'date',
      title: labels.colDate,
      exportValue: (e) => (e.examDate ? String(e.examDate).split('T')[0] : null),
      exportKind: 'date',
      render: (e) => formatDate(e.examDate),
    },
    {
      key: 'marks',
      title: labels.colMarks,
      exportValue: (e) => `${Number(e.maxMark)} / ${Number(e.passMark)}`,
      exportKind: 'text',
      render: (e) => `${Number(e.maxMark)} / ${Number(e.passMark)}`,
    },
    {
      key: 'results',
      title: labels.colResults,
      exportValue: (e) => e._count.results,
      exportKind: 'number',
      render: (e) => <StatusBadge size="xs">{e._count.results}</StatusBadge>,
    },
    {
      key: 'actions',
      title: labels.colActions,
      align: 'center',
      render: (e) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <ReportMenu compact keys={['exam-results', 'mark-entry-sheet']} params={{ examId: e.id }} />
          {access.canEnterMarks && (
            <AppButton size="xs" leftSection={<IconPencilCheck size={14} />} href={`/exams/${e.id}/results`}>
              {labels.enterMarks}
            </AppButton>
          )}
          {access.canManage && (
            <>
              <AppIconButton size="sm" variant="ghost" label={labels.edit} onClick={() => onEdit(e)}>
                <IconEdit size={15} />
              </AppIconButton>
              <AppIconButton size="sm" variant="danger" label={labels.delete} onClick={() => onDelete(e)}>
                <IconTrash size={15} />
              </AppIconButton>
            </>
          )}
        </Group>
      ),
    },
  ];
}
