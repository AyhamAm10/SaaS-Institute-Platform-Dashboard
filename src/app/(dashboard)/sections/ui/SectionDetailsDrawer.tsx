'use client';

import {
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconBook,
  IconCalendar,
  IconCalendarTime,
  IconCoin,
  IconInfoCircle,
  IconMapPin,
  IconSchool,
  IconUsers,
} from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/ui';
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
    <AppDrawer
      opened={opened}
      onClose={onClose}
      size="md"
      loading={isLoading}
    >
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconInfoCircle size={20} />} color="blue" />
        <AppDrawer.Title>{sectionFormLabels.detailsTitle}</AppDrawer.Title>
        <AppDrawer.Description>
          {details?.name ? `بيانات وإحصائيات شُعبة ${details.name}` : 'عرض تفاصيل الشُعبة والطلاب المسجلين'}
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        {details && (
          <Stack gap="lg">
            {/* Section Basic Details Card */}
            <AppDrawer.Section
              title={
                <Group justify="space-between" align="center" style={{ width: '100%' }}>
                  <Text fw={700} size="md">
                    {details.name}
                  </Text>
                  <Badge radius="xl" variant="light" color="primary">
                    {details.grade}
                  </Badge>
                </Group>
              }
              description="المعلومات الأساسية والفرع والسنة الدراسية"
            >
              <AppDrawer.Details>
                <AppDrawer.Detail
                  label="السنة الدراسية"
                  value={details.academicYear?.name ?? '—'}
                  icon={<IconCalendar size={16} />}
                />
                <AppDrawer.Detail
                  label="الفرع"
                  value={details.branch?.name ?? 'الفرع الرئيسي'}
                  icon={<IconMapPin size={16} />}
                />
                <AppDrawer.Detail
                  label="الرسوم المعتمدة"
                  value={
                    <Text fw={700} c="teal" span>
                      {Number(details.feeAmount).toLocaleString('ar-SA')} ر.س
                    </Text>
                  }
                  icon={<IconCoin size={16} />}
                  iconColor="teal"
                />
              </AppDrawer.Details>
            </AppDrawer.Section>

            {/* Quick Metrics Section */}
            <AppDrawer.Section
              title="إحصائيات الشُعبة"
              description="نظرة سريعة على أعداد الطلاب والمعلمين والمواد"
            >
              <SimpleGrid cols={2} spacing="sm">
                <Card radius="md" withBorder p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
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

                <Card radius="md" withBorder p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
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

                <Card radius="md" withBorder p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
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

                <Card radius="md" withBorder p="sm" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
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
            </AppDrawer.Section>
          </Stack>
        )}
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>إغلاق</AppDrawer.Cancel>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
