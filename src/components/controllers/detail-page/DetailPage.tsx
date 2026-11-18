'use client';

import { type ReactNode, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Box, Stack } from '@mantine/core';
import { AppPageHeader, type AppPageBreadcrumb } from '../page-header';
import { AppTabs } from '../tabs';

export interface DetailPageTab {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  /** Rendered only while the tab is open, so nothing loads before it is needed. */
  content: ReactNode;
}

export interface DetailPageProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Small element next to the title (a status badge). */
  badge?: ReactNode;
  breadcrumbs: AppPageBreadcrumb[];
  /** Quick actions of the entity (buttons, report menu). */
  actions?: ReactNode;
  /** Strip under the header: key facts and counters. */
  summary?: ReactNode;
  /** Tabs the user may open, in display order (leave out for a one-block page). */
  tabs?: DetailPageTab[];
  /** Body of a page without tabs. */
  children?: ReactNode;
  /** The `?tab=` value used when the address has none (default: first tab). */
  defaultTab?: string;
}

/**
 * DetailPage
 *
 * The one layout of every detail page (student, section, family, teacher...):
 * header with breadcrumbs and quick actions, a summary strip, and tabs whose
 * state lives in the address (`?tab=`), so a link opens the right tab and the
 * back button works. Each tab is mounted only while open.
 */
export function DetailPage({
  title,
  description,
  icon,
  badge,
  breadcrumbs,
  actions,
  summary,
  tabs = [],
  children,
  defaultTab,
}: DetailPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get('tab');
  const fallback = defaultTab ?? tabs[0]?.value ?? '';
  const active = tabs.some((t) => t.value === requested) ? (requested as string) : fallback;

  const change = useCallback(
    (value: string) => {
      const next = new URLSearchParams(params.toString());
      next.set('tab', value);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  return (
    <Stack gap="lg">
      <AppPageHeader
        withBreadcrumbs
        breadcrumbs={breadcrumbs}
        title={title}
        description={description}
        icon={icon}
        badge={badge}
        actions={actions}
      />
      {summary && <Box px={4}>{summary}</Box>}
      {children}
      {tabs.length > 0 && (
        <AppTabs
          value={active}
          onChange={change}
          items={tabs.map(({ value, label, icon: tabIcon, count }) => ({ value, label, icon: tabIcon, count }))}
        >
          <AppTabs.List />
          {tabs.map((tab) => (
            <AppTabs.Panel key={tab.value} value={tab.value}>
              {tab.content}
            </AppTabs.Panel>
          ))}
        </AppTabs>
      )}
    </Stack>
  );
}
