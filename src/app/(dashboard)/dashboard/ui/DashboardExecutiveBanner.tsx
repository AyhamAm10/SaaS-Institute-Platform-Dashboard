'use client';

import {
  Badge,
  Card,
  Group,
  Progress,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCalendarCheck, IconSchool } from '@tabler/icons-react';
import { useAuth } from '@/src/core/auth';
import { useOperationalContext } from '@/src/core/context';
import { useBranchesQuery, useAcademicYearsQuery } from '@/src/core/api';
import { useDashboardMirror } from '../store/useDashboardMirror';
import { dashboardStaticData } from '../static-data/dashboard.data';
import { DashboardPeriod } from '../state/dashboard.state';

export function DashboardExecutiveBanner() {
  const { user } = useAuth();
  const { activeBranchId, activeAcademicYearId } = useOperationalContext();
  const { data: branches } = useBranchesQuery();
  const { data: yearsData } = useAcademicYearsQuery({ limit: 50 });

  const selectedPeriod = useDashboardMirror('selectedPeriod');
  const setSelectedPeriod = useDashboardMirror('setSelectedPeriod');

  const currentBranch = branches?.find((b) => b.id === activeBranchId);
  const currentAcademicYear =
    yearsData?.data?.find((y) => y.id === activeAcademicYearId) ||
    yearsData?.data?.find((y) => y.isCurrent);

  return (
    <Card
      radius="xl"
      p={{ base: 'md', sm: 'xl' }}
      withBorder
      style={{
        background:
          'linear-gradient(135deg, rgba(30, 78, 140, 0.04) 0%, rgba(20, 184, 166, 0.03) 100%)',
        borderColor: 'var(--mantine-color-gray-2)',
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Stack gap={6}>
            <Group gap="xs" wrap="wrap">
              <Title order={2} size="h3" fw={800}>
                أهلاً بك، {user?.fullName || 'مدير المعهد'}
              </Title>
              <Badge variant="light" color="teal" radius="xl" size="sm">
                لوحة المتابعة التنفيذية
              </Badge>
              {currentBranch && (
                <Badge variant="outline" color="primary" radius="xl" size="sm">
                  {currentBranch.name}
                </Badge>
              )}
            </Group>
            <Text size="sm" c="dimmed" lineClamp={2}>
              {dashboardStaticData.header.welcomeSubtitle}
            </Text>
          </Stack>

          <Group gap="sm" wrap="wrap">
            {currentAcademicYear && (
              <Card radius="xl" withBorder p="xs" px="md" bg="var(--mantine-color-body)">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" color="teal" variant="light">
                    <IconCalendarCheck size={18} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="11px" c="dimmed">
                      العام الدراسي النشط
                    </Text>
                    <Text size="xs" fw={700} c="teal">
                      {currentAcademicYear.name}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            )}

            <SegmentedControl
              radius="xl"
              size="xs"
              value={selectedPeriod}
              onChange={(val) => setSelectedPeriod(val as DashboardPeriod)}
              data={[
                { label: 'هذا الفصل', value: 'semester' },
                { label: 'هذا الشهر', value: 'month' },
                { label: 'اليوم', value: 'today' },
              ]}
            />
          </Group>
        </Group>

        {/* Capacity Strip */}
        <Card radius="lg" withBorder p="sm" px="md" bg="var(--mantine-color-body)">
          <Stack gap="xs">
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="xl" color="primary" variant="light">
                  <IconSchool size={14} />
                </ThemeIcon>
                <Text size="xs" fw={700}>
                  {dashboardStaticData.header.capacityTitle}
                </Text>
              </Group>
              <Group gap="xs">
                <Text size="xs" c="dimmed">
                  {dashboardStaticData.header.capacityDetail}
                </Text>
                <Badge size="sm" color="teal" variant="light" radius="xl">
                  {dashboardStaticData.header.capacityValue}
                </Badge>
              </Group>
            </Group>
            <Progress
              value={83}
              color="teal"
              size="sm"
              radius="xl"
              animated
              aria-label="سعة استيعاب المعهد"
            />
          </Stack>
        </Card>
      </Stack>
    </Card>
  );
}
