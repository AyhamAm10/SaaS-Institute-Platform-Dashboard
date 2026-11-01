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
  description?: ReactNode;
  breadcrumbs?: AppPageBreadcrumb[];
  icon?: ReactNode;
  /** Small element next to the title (e.g. a count StatusBadge). */
  badge?: ReactNode;
  actions?: ReactNode;
}

/**
 * AppPageHeader
 *
 * The single page title block: quiet breadcrumbs, a 600-weight title,
 * a light description and right-aligned actions. Used by AppModule and DataModule.
 */
export function AppPageHeader({ title, description, breadcrumbs, icon, badge, actions }: AppPageHeaderProps) {
  if (!title && !breadcrumbs?.length && !actions) return null;

  return (
    <Box mb={rem(22)} px={rem(4)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
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

      <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
        <Stack gap={6} style={{ minWidth: 0 }}>
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
            <Text fw={300} style={{ fontSize: rem(13.5), color: 'var(--app-text-secondary)', lineHeight: 1.6 }}>
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
