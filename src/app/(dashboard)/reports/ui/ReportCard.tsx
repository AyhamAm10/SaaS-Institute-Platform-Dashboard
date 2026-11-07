'use client';

import Link from 'next/link';
import { Group, Stack, Text, ThemeIcon, UnstyledButton, rem } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { AppSurface, StatusBadge } from '@/src/components/controllers';
import type { ReportDefinition } from '@/src/core/api';
import { CATEGORY_META, PARAM_LABELS, reportsLabels as labels } from '../static-data/reports.data';
import { reportHref } from '../utils/reports.utils';

/** One report of the catalog: what it shows, what it needs. Props only. */
export function ReportCard({ report }: { report: ReportDefinition }) {
  const meta = CATEGORY_META[report.category];
  const Icon = meta.icon;
  const required = report.params.filter((p) => p.required);

  return (
    <UnstyledButton component={Link} href={reportHref(report.key)} style={{ display: 'block', height: '100%' }}>
      <AppSurface level={2} radius="lg" padding="md" interactive style={{ height: '100%' }}>
        <Stack gap="sm" h="100%" justify="space-between">
          <Stack gap={6}>
            <Group justify="space-between" wrap="nowrap" align="flex-start">
              <ThemeIcon size={rem(38)} radius="md" variant="light" color="primary">
                <Icon size={20} stroke={1.6} />
              </ThemeIcon>
              {report.verifiable && (
                <StatusBadge tone="success" size="xs">
                  {labels.verifiable}
                </StatusBadge>
              )}
            </Group>
            <Text fw={600} size="md">
              {report.title}
            </Text>
            <Text size="xs" c="var(--app-text-muted)" lineClamp={2}>
              {report.description}
            </Text>
          </Stack>
          <Group justify="space-between" wrap="nowrap">
            <Group gap={4} wrap="wrap">
              {required.map((p) => (
                <StatusBadge key={p.kind} tone="neutral" size="xs">
                  {labels.needs} {PARAM_LABELS[p.kind]}
                </StatusBadge>
              ))}
            </Group>
            <IconArrowLeft size={16} color="var(--app-text-muted)" />
          </Group>
        </Stack>
      </AppSurface>
    </UnstyledButton>
  );
}
