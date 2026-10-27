'use client';

import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconClock,
  IconDoor,
  IconLivePhoto,
  IconUserCheck,
} from '@tabler/icons-react';
import { dashboardStaticData, LiveScheduleItem } from '../static-data/dashboard.data';

function getStatusBadge(status: LiveScheduleItem['status'], text: string) {
  switch (status) {
    case 'live':
      return (
        <Badge
          color="teal"
          variant="filled"
          radius="xl"
          size="sm"
          leftSection={
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'inline-block',
              }}
            />
          }
        >
          {text}
        </Badge>
      );
    case 'upcoming':
      return (
        <Badge color="orange" variant="light" radius="xl" size="sm">
          {text}
        </Badge>
      );
    case 'completed':
      return (
        <Badge color="gray" variant="light" radius="xl" size="sm">
          {text}
        </Badge>
      );
  }
}

export function DashboardLiveScheduleCard() {
  return (
    <Card
      radius="xl"
      withBorder
      p="lg"
      style={{
        borderColor: 'var(--app-border)',
        height: '100%',
      }}
    >
      <Stack justify="space-between" h="100%" gap="md">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <ThemeIcon size={38} radius="xl" color="secondary" variant="light">
              <IconLivePhoto size={20} />
            </ThemeIcon>
            <Stack gap={2}>
              <Title order={3} size="h5" fw={700}>
                نبض اليوم الدراسي والحصص
              </Title>
              <Text size="xs" c="dimmed">
                متابعة الحصص الجارية والقادمة بالقاعات الدراسية
              </Text>
            </Stack>
          </Group>
          <Badge variant="light" color="secondary" radius="xl" size="sm">
            اليوم (مباشر)
          </Badge>
        </Group>

        <Stack gap="xs">
          {dashboardStaticData.liveSchedule.map((item) => (
            <Card
              key={item.id}
              radius="lg"
              withBorder
              p="sm"
              style={{
                borderColor:
                  item.status === 'live'
                    ? 'rgba(196, 166, 107, 0.4)'
                    : 'var(--app-border)',
                backgroundColor:
                  item.status === 'live'
                    ? 'rgba(196, 166, 107, 0.08)'
                    : 'var(--app-surface)',
              }}
            >
              <Stack gap={6}>
                <Group justify="space-between" align="center" wrap="wrap" gap="xs">
                  <Group gap="xs">
                    <Text size="sm" fw={700}>
                      {item.sectionName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      • {item.subjectName}
                    </Text>
                  </Group>
                  {getStatusBadge(item.status, item.statusText)}
                </Group>

                <Group justify="space-between" align="center" wrap="wrap" gap="sm">
                  <Group gap="md">
                    <Group gap={4}>
                      <IconUserCheck size={14} color="var(--mantine-color-dimmed)" />
                      <Text size="xs" c="dimmed">
                        {item.teacherName}
                      </Text>
                    </Group>
                    <Group gap={4}>
                      <IconDoor size={14} color="var(--mantine-color-dimmed)" />
                      <Text size="xs" c="dimmed">
                        {item.roomName}
                      </Text>
                    </Group>
                  </Group>

                  <Group gap={4} dir="ltr">
                    <IconClock size={13} color="var(--mantine-color-dimmed)" />
                    <Text size="xs" fw={600} c="dimmed">
                      {item.timeSlot}
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
