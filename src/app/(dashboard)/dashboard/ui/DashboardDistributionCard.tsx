'use client';

import {
  Badge,
  Card,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconChartPie } from '@tabler/icons-react';
import { dashboardStaticData } from '../static-data/dashboard.data';

export function DashboardDistributionCard() {
  return (
    <Card
      radius="xl"
      withBorder
      p="lg"
      style={{
        borderColor: 'var(--mantine-color-gray-2)',
        height: '100%',
      }}
    >
      <Stack justify="space-between" h="100%" gap="lg">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon size={38} radius="xl" color="primary" variant="light">
              <IconChartPie size={20} />
            </ThemeIcon>
            <Stack gap={2}>
              <Title order={3} size="h5" fw={700}>
                توزيع الطلاب حسب المراحل
              </Title>
              <Text size="xs" c="dimmed">
                نسبة الإقبال والتسجيل في التخصصات والشعب
              </Text>
            </Stack>
          </Group>
          <Badge variant="light" color="primary" radius="xl" size="sm">
            4 تخصصات نشطة
          </Badge>
        </Group>

        {/* Combined Segmented Bar */}
        <Progress.Root size="xl" radius="xl">
          {dashboardStaticData.stageDistribution.map((item) => (
            <Progress.Section
              key={item.id}
              value={item.percentage}
              color={item.color}
              aria-label={item.name}
            >
              <Progress.Label>{`${item.percentage}%`}</Progress.Label>
            </Progress.Section>
          ))}
        </Progress.Root>

        {/* Breakdown List */}
        <Stack gap="xs">
          {dashboardStaticData.stageDistribution.map((item) => (
            <Group
              key={item.id}
              justify="space-between"
              align="center"
              p="xs"
              px="sm"
              style={{
                backgroundColor: 'var(--mantine-color-gray-0)',
                borderRadius: '14px',
              }}
            >
              <Group gap="xs">
                <Badge size="xs" color={item.color} variant="filled" circle />
                <Text size="sm" fw={600}>
                  {item.name}
                </Text>
              </Group>

              <Group gap="xs">
                <Text size="xs" fw={700} c="dimmed">
                  {item.studentsCount} طالب
                </Text>
                <Badge size="sm" color={item.color} variant="light" radius="xl">
                  {item.percentage}%
                </Badge>
              </Group>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
