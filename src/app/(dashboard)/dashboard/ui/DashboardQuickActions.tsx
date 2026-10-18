'use client';

import {
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconBuildingCommunity,
  IconCalendarEvent,
  IconClockPlay,
  IconLayoutGrid,
} from '@tabler/icons-react';
import Link from 'next/link';
import { dashboardStaticData, QuickActionItem } from '../static-data/dashboard.data';

function getActionIcon(iconType: QuickActionItem['iconType']) {
  switch (iconType) {
    case 'section':
      return <IconLayoutGrid size={22} />;
    case 'branch':
      return <IconBuildingCommunity size={22} />;
    case 'year':
      return <IconCalendarEvent size={22} />;
    case 'timetable':
      return <IconClockPlay size={22} />;
  }
}

export function DashboardQuickActions() {
  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={3} size="h5" fw={700}>
          إجراءات سريعة واختصارات الإدارة
        </Title>
        <Text size="xs" c="dimmed">
          الوصول الفوري للعمليات التأسيسية وإعدادات النظام
        </Text>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        {dashboardStaticData.quickActions.map((action) => (
          <Card
            key={action.id}
            component={Link}
            href={action.href}
            radius="xl"
            withBorder
            p="md"
            style={{
              borderColor: 'var(--mantine-color-gray-2)',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
            }}
          >
            <Stack justify="space-between" h="100%" gap="md">
              <Group justify="space-between" align="flex-start">
                <ThemeIcon
                  size={42}
                  radius="xl"
                  color={action.color}
                  variant="light"
                >
                  {getActionIcon(action.iconType)}
                </ThemeIcon>
                <ThemeIcon size="sm" radius="xl" variant="subtle" color="gray">
                  <IconArrowLeft size={16} />
                </ThemeIcon>
              </Group>

              <Stack gap={2}>
                <Text size="sm" fw={700}>
                  {action.title}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {action.description}
                </Text>
              </Stack>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
