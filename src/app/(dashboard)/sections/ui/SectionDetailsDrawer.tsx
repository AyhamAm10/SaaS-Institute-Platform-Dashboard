'use client';

import {
  Badge,
  Card,
  Drawer,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconBook,
  IconCalendar,
  IconCalendarTime,
  IconCoin,
  IconMapPin,
  IconSchool,
  IconUsers,
} from '@tabler/icons-react';
import { useSectionDetailsQuery } from '@/src/core/api';
import { sectionFormLabels } from '../static-data/sections.data';

export interface SectionDetailsDrawerProps {
  opened: boolean;
  onClose: () => void;
  sectionId: number | null;
}

export function SectionDetailsDrawer({
  opened,
  onClose,
  sectionId,
}: SectionDetailsDrawerProps) {
  const { data: details, isLoading } = useSectionDetailsQuery(sectionId ?? 0);

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={
        <Title order={3} size="h4" fw={700}>
          {sectionFormLabels.detailsTitle}
        </Title>
      }
      styles={{
        header: {
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          paddingBottom: '1rem',
        },
      }}
    >
      {isLoading ? (
        <Stack align="center" justify="center" py={60}>
          <Loader size="md" color="primary" />
          <Text size="sm" c="dimmed">
            جاري تحميل تفاصيل الشُعبة...
          </Text>
        </Stack>
      ) : details ? (
        <Stack gap="lg" mt="md">
          {/* Main Info Card */}
          <Card radius="lg" withBorder p="md">
            <Stack gap="xs">
              <Group justify="space-between">
                <Title order={4} size="h5" fw={700}>
                  {details.name}
                </Title>
                <Badge radius="xl" variant="light" color="primary">
                  {details.grade}
                </Badge>
              </Group>

              <Group gap="xs" mt="xs">
                <ThemeIcon size="sm" variant="transparent" color="gray">
                  <IconCalendar size={16} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  السنة الدراسية:{' '}
                  <Text span fw={600} c="var(--mantine-color-text)">
                    {details.academicYear?.name ?? '—'}
                  </Text>
                </Text>
              </Group>

              <Group gap="xs">
                <ThemeIcon size="sm" variant="transparent" color="gray">
                  <IconMapPin size={16} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  الفرع:{' '}
                  <Text span fw={600} c="var(--mantine-color-text)">
                    {details.branch?.name ?? 'الفرع الرئيسي'}
                  </Text>
                </Text>
              </Group>

              <Group gap="xs">
                <ThemeIcon size="sm" variant="transparent" color="teal">
                  <IconCoin size={16} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">
                  الرسوم المعتمدة:{' '}
                  <Text span fw={700} c="teal">
                    {Number(details.feeAmount).toLocaleString('ar-SA')} ر.س
                  </Text>
                </Text>
              </Group>
            </Stack>
          </Card>

          {/* Quick Metrics Grid */}
          <SimpleGrid cols={2} spacing="sm">
            <Card radius="md" withBorder p="sm">
              <Group gap="xs">
                <ThemeIcon size="lg" radius="xl" variant="light" color="blue">
                  <IconUsers size={20} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    الطلاب المسجلين
                  </Text>
                  <Text fw={700} size="md">
                    {details._count?.studentEnrollments ?? 0} طالب
                  </Text>
                </Stack>
              </Group>
            </Card>

            <Card radius="md" withBorder p="sm">
              <Group gap="xs">
                <ThemeIcon size="lg" radius="xl" variant="light" color="violet">
                  <IconBook size={20} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    المواد المقررة
                  </Text>
                  <Text fw={700} size="md">
                    {details._count?.sectionSubjects ?? 0} مادة
                  </Text>
                </Stack>
              </Group>
            </Card>

            <Card radius="md" withBorder p="sm">
              <Group gap="xs">
                <ThemeIcon size="lg" radius="xl" variant="light" color="orange">
                  <IconSchool size={20} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    المدرسين
                  </Text>
                  <Text fw={700} size="md">
                    {details._count?.sectionTeachers ?? 0} معلم
                  </Text>
                </Stack>
              </Group>
            </Card>

            <Card radius="md" withBorder p="sm">
              <Group gap="xs">
                <ThemeIcon size="lg" radius="xl" variant="light" color="teal">
                  <IconCalendarTime size={20} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text size="xs" c="dimmed">
                    الحصص والجدول
                  </Text>
                  <Text fw={700} size="md">
                    {details._count?.timetables ?? 0} حصة
                  </Text>
                </Stack>
              </Group>
            </Card>
          </SimpleGrid>
        </Stack>
      ) : null}
    </Drawer>
  );
}
