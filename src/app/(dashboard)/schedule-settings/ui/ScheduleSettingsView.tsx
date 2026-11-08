'use client';

import { Box, SimpleGrid, Skeleton, Stack } from '@mantine/core';
import { useScheduleSettingsMirror } from '../store/useScheduleSettingsMirror';
import { AttendanceRulesSection } from './AttendanceRulesSection';
import { ScheduleSettingsHeader } from './ScheduleSettingsHeader';
import { WorkingDaysSection } from './WorkingDaysSection';
import { DailyHoursSection } from './DailyHoursSection';
import { BreaksSection, BreaksSectionProps } from './BreaksSection';
import { SlotsPreview } from './SlotsPreview';

interface ScheduleSettingsViewProps extends BreaksSectionProps {
  onSave: () => void;
  canManage?: boolean;
}

export function ScheduleSettingsView({ onSave, canManage = true, ...breaks }: ScheduleSettingsViewProps) {
  const isLoading = useScheduleSettingsMirror('isLoading');

  if (isLoading) {
    return (
      <Stack gap="lg" p="md">
        <Skeleton height={50} radius="xl" />
        <Skeleton height={200} radius="xl" />
        <Skeleton height={200} radius="xl" />
      </Stack>
    );
  }

  return (
    <Stack gap="xl">
      <ScheduleSettingsHeader onSave={onSave} canManage={canManage} />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Box>
          <Stack gap="lg">
            <WorkingDaysSection />
            <DailyHoursSection />
            <AttendanceRulesSection />
            <BreaksSection {...breaks} />
          </Stack>
        </Box>
        <Box>
          <SlotsPreview />
        </Box>
      </SimpleGrid>
    </Stack>
  );
}
