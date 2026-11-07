'use client';

import Link from 'next/link';
import { Menu, Text } from '@mantine/core';
import { IconChevronDown, IconFileDescription, IconReportAnalytics } from '@tabler/icons-react';
import { AppButton, AppIconButton } from '../button';
import { type ReportParams, useReportCatalogQuery } from '@/src/core/api';
import { reportLink } from './init/report-link';

export interface ReportMenuProps {
  /** Report keys offered here, in order (unknown / forbidden ones are hidden). */
  keys: string[];
  /** Parameters already known in this context (student, section, exam...). */
  params: ReportParams;
  label?: string;
  /** Compact icon trigger for table rows. */
  compact?: boolean;
}

/**
 * ReportMenu
 *
 * Contextual "تقارير" button (D3): the reports that fit the current page,
 * filtered by the server catalog (permissions), each opening the report
 * workspace with its parameters filled. Stateless (Mantine Menu owns open).
 */
export function ReportMenu({ keys, params, label = 'تقارير', compact }: ReportMenuProps) {
  const { data } = useReportCatalogQuery();
  const items = keys.flatMap((key) => {
    const report = data?.find((r) => r.key === key);
    return report ? [report] : [];
  });
  if (items.length === 0) return null;

  return (
    <Menu position="bottom-end" shadow="md" width={260} withinPortal>
      <Menu.Target>
        {compact ? (
          <AppIconButton size="sm" variant="ghost" label={label}>
            <IconReportAnalytics size={15} />
          </AppIconButton>
        ) : (
          <AppButton variant="outline" leftSection={<IconReportAnalytics size={16} />} rightSection={<IconChevronDown size={14} />}>
            {label}
          </AppButton>
        )}
      </Menu.Target>
      <Menu.Dropdown>
        {items.map((report) => (
          <Menu.Item key={report.key} component={Link} href={reportLink(report.key, params)} leftSection={<IconFileDescription size={16} />}>
            <Text size="sm" fw={500}>
              {report.title}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {report.description}
            </Text>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
