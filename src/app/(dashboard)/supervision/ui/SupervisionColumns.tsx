'use client';

import { Stack, Text } from '@mantine/core';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers';
import type { MySupervision } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import { supervisionLabels as labels } from '../static-data/supervision.data';
import { dayBadge } from '../utils/supervision.utils';

export function getSupervisionColumns(today: string): DataModuleColumn<MySupervision>[] {
  return [
    {
      key: 'date',
      title: labels.colDate,
      exportValue: (s) => s.examDate,
      exportKind: 'date',
      render: (s) => {
        const badge = dayBadge(s.examDate, today);
        return (
          <Stack gap={2}>
            <Text size="sm" fw={500}>
              {formatDate(s.examDate)}
            </Text>
            {badge && (
              <StatusBadge tone={badge.tone} size="xs">
                {badge.label}
              </StatusBadge>
            )}
          </Stack>
        );
      },
    },
    { key: 'title', title: labels.colExam, exportValue: (s) => s.title, exportKind: 'text', render: (s) => s.title },
    {
      key: 'section',
      title: labels.colSection,
      exportValue: (s) => `${s.section.name} - ${s.subject.name}`,
      exportKind: 'text',
      render: (s) => (
        <Stack gap={0}>
          <Text size="sm">{s.section.name}</Text>
          <Text size="xs" c="var(--app-text-muted)">
            {s.subject.name}
          </Text>
        </Stack>
      ),
    },
    { key: 'branch', title: labels.colBranch, exportValue: (s) => s.branch.name, exportKind: 'text', render: (s) => s.branch.name },
    {
      key: 'colleagues',
      title: labels.colColleagues,
      exportValue: (s) => s.colleagues.map((c) => c.fullName).join('، ') || labels.alone,
      exportKind: 'text',
      render: (s) => (s.colleagues.length === 0 ? labels.alone : s.colleagues.map((c) => c.fullName).join('، ')),
    },
  ];
}
