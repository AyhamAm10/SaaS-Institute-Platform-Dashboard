'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Anchor, Box, Breadcrumbs, Group, Stack, Text, Title, rem } from '@mantine/core';

export interface AppPageBreadcrumb {
  label: string;
  href?: string;
}

export interface AppPageHeaderProps {
  title?: ReactNode;
  /** One short line under the title. Keep it brief, or leave it out. */
  description?: ReactNode;
  breadcrumbs?: AppPageBreadcrumb[];
  /**
   * Breadcrumbs are hidden by default: the sidebar already shows where the user is.
   * Enable only for deep pages (e.g. a wizard inside a section).
   */
  withBreadcrumbs?: boolean;
  icon?: ReactNode;
  /** Small element next to the title (e.g. a count StatusBadge). */
  badge?: ReactNode;
  actions?: ReactNode;
}

/**
 * AppPageHeader
 *
 * The single page title block: a 600-weight title, an optional one-line description
 * and the page actions. Deliberately minimal so the page content leads.
 */
export function AppPageHeader({
  title,
  description,
  breadcrumbs,
  withBreadcrumbs = false,
  icon,
  badge,
  actions,
}: AppPageHeaderProps) {
  const showBreadcrumbs = withBreadcrumbs && breadcrumbs && breadcrumbs.length > 0;
  if (!title && !showBreadcrumbs && !actions) return null;

  return (
    <Box mb={rem(24)} px={rem(4)}>
      {showBreadcrumbs && (
        <Breadcrumbs separator="/" separatorMargin={6} mb={rem(8)}>
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            if (isLast || !item.href) {
              return (
                <Text key={index} size="xs" fw={400} c={isLast ? 'var(--app-text-secondary)' : 'var(--app-text-muted)'}>
                  {item.label}
                </Text>
              );
            }
            return (
              <Anchor key={index} component={Link} href={item.href} size="xs" c="var(--app-text-muted)">
                {item.label}
              </Anchor>
            );
          })}
        </Breadcrumbs>
      )}

      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Stack gap={4} style={{ minWidth: 0 }}>
          <Group gap="sm" align="center" wrap="nowrap">
            {icon && (
              <Box style={{ display: 'inline-flex', color: 'var(--app-brand-accent)' }}>{icon}</Box>
            )}
            {title && (
              <Title
                order={1}
                fw={600}
                style={{ fontSize: rem(26), letterSpacing: '-0.01em', color: 'var(--app-text-primary)' }}
              >
                {title}
              </Title>
            )}
            {badge}
          </Group>
          {description && (
            <Text fw={300} lineClamp={1} style={{ fontSize: rem(13.5), color: 'var(--app-text-muted)' }}>
              {description}
            </Text>
          )}
        </Stack>

        {actions && (
          <Group gap="sm" align="center">
            {actions}
          </Group>
        )}
      </Group>
    </Box>
  );
}
