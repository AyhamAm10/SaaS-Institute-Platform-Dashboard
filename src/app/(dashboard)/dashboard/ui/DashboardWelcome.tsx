'use client';

import { SimpleGrid, Stack, Text } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { AppButton, AppPageHeader, AppSurface } from '@/src/components/controllers';
import type { NavItem } from '@/src/components/controllers/sidebar/init/navigation';

export interface DashboardWelcomeProps {
  fullName: string;
  roleLabel: string;
  /** Sidebar entries the user may open (already filtered by permissions). */
  items: NavItem[];
}

/**
 * Home page of roles without the statistics dashboard (e.g. teachers):
 * a greeting and one shortcut per page they can open. Props only.
 */
export function DashboardWelcome({ fullName, roleLabel, items }: DashboardWelcomeProps) {
  const links = items.flatMap((item) =>
    item.subItems?.length
      ? item.subItems.map((sub) => ({ key: sub.key, label: sub.label, href: sub.href }))
      : item.href && item.href !== '/'
        ? [{ key: item.key, label: item.label, href: item.href }]
        : [],
  );

  return (
    <Stack gap="lg">
      <AppPageHeader title={`أهلاً ${fullName}`} description={roleLabel} />
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
        {links.map((link) => (
          <AppSurface key={link.key} level={1} radius="lg" padding="md">
            <Stack gap="sm">
              <Text fw={600}>{link.label}</Text>
              <AppButton href={link.href} variant="outline" size="sm" rightSection={<IconArrowLeft size={14} />}>
                فتح
              </AppButton>
            </Stack>
          </AppSurface>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
