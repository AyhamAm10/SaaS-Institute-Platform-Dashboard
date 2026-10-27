'use client';

import {
  Badge,
  Card,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCoin,
  IconLayoutGrid,
  IconSchool,
  IconUsers,
} from '@tabler/icons-react';
import { dashboardStaticData, DashboardKpiItem } from '../static-data/dashboard.data';

function getKpiIcon(iconType: DashboardKpiItem['iconType']) {
  switch (iconType) {
    case 'students':
      return <IconUsers size={22} />;
    case 'sections':
      return <IconLayoutGrid size={22} />;
    case 'teachers':
      return <IconSchool size={22} />;
    case 'finance':
      return <IconCoin size={22} />;
  }
}

export function DashboardKpiGrid() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      {dashboardStaticData.kpis.map((kpi) => (
        <Card
          key={kpi.id}
          radius="xl"
          withBorder
          p="lg"
          style={{
            borderColor: 'var(--app-border)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <Stack justify="space-between" h="100%" gap="md">
            <Group justify="space-between" align="flex-start">
              <ThemeIcon
                size={44}
                radius="xl"
                color={kpi.badgeColor}
                variant="light"
              >
                {getKpiIcon(kpi.iconType)}
              </ThemeIcon>
              <Badge
                variant="light"
                color={kpi.badgeColor}
                radius="xl"
                size="sm"
              >
                {kpi.badgeText}
              </Badge>
            </Group>

            <Stack gap={2}>
              <Text size="xs" fw={600} c="dimmed">
                {kpi.title}
              </Text>
              <Text size="1.8rem" fw={800} lh={1.1}>
                {kpi.value}
              </Text>
              <Text size="xs" c="dimmed">
                {kpi.subtitle}
              </Text>
            </Stack>

            <Progress
              value={kpi.progressPercent}
              color={kpi.badgeColor}
              size="xs"
              radius="xl"
              aria-label={kpi.title}
            />
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
