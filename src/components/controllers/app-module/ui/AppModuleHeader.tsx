'use client';

import { Anchor, Box, Breadcrumbs, Group, Stack, Text, Title, rem } from '@mantine/core';
import Link from 'next/link';
import { ReactNode } from 'react';
import { AppModuleBreadcrumbItem } from '../init/app-module.init';

export interface AppModuleHeaderProps {
  breadcrumbs?: AppModuleBreadcrumbItem[];
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  actions?: ReactNode;
}

export function AppModuleHeader({
  breadcrumbs,
  title,
  description,
  icon,
  badge,
  actions,
}: AppModuleHeaderProps) {
  if (!title && !breadcrumbs && !actions) return null;

  return (
    <Box mb={rem(18)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs separator="←" mb={rem(8)} style={{ fontSize: rem(12) }}>
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            if (isLast || !item.href) {
              return (
                <Text key={idx} size="xs" fw={isLast ? 600 : 400} c={isLast ? 'var(--app-text-primary)' : 'dimmed'}>
                  {item.label}
                </Text>
              );
            }
            return (
              <Anchor key={idx} component={Link} href={item.href} size="xs" c="dimmed">
                {item.label}
              </Anchor>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Main Title & Action Bar */}
      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
        <Stack gap={3}>
          <Group gap="xs" align="center">
            {icon && (
              <Box
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--app-brand-primary)',
                }}
              >
                {icon}
              </Box>
            )}
            {title && (
              <Title
                order={2}
                fw={800}
                style={{
                  fontSize: rem(22),
                  color: 'var(--app-text-primary)',
                  letterSpacing: '-0.3px',
                }}
              >
                {title}
              </Title>
            )}
            {badge}
          </Group>

          {description && (
            <Text
              size="xs"
              style={{
                fontSize: rem(13),
                color: 'var(--app-text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {description}
            </Text>
          )}
        </Stack>

        {actions && (
          <Group gap="xs" align="center">
            {actions}
          </Group>
        )}
      </Group>
    </Box>
  );
}
