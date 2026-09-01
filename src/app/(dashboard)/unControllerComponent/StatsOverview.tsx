'use client';

import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';
import { statCardsData } from '../static-data/dashboard.data';

export function StatsOverview() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
      {statCardsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            padding="lg"
            radius="lg"
            style={{
              transition: 'transform 150ms ease, box-shadow 150ms ease',
            }}
          >
            <Group justify="space-between" align="flex-start">
              <Stack gap={4}>
                <Text size="xs" c="dimmed" fw={700}>
                  {stat.title}
                </Text>
                <Title order={3} fw={800} style={{ letterSpacing: '-0.3px' }}>
                  {stat.value}
                </Title>
              </Stack>
              <ThemeIcon
                color={stat.color}
                variant="light"
                size={44}
                radius="xl"
                style={{
                  boxShadow: `0 4px 12px var(--mantine-color-${stat.color}-1)`,
                }}
              >
                <Icon size={22} stroke={1.8} />
              </ThemeIcon>
            </Group>
            <Group gap="xs" mt="md">
              <Badge
                color={stat.color}
                size="sm"
                radius="xl"
                variant="light"
                leftSection={<IconArrowUpRight size={12} />}
                style={{ fontWeight: 700 }}
              >
                {stat.diff}
              </Badge>
              <Text size="xs" c="dimmed" fw={500}>
                مقارنة بالفصل السابق
              </Text>
            </Group>
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
