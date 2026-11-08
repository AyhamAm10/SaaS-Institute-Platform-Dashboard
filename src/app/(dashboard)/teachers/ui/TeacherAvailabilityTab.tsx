'use client';

import { Center, Group, Paper, SimpleGrid, Stack, Table, Text } from '@mantine/core';
import { IconDeviceFloppy, IconPlus, IconTrash } from '@tabler/icons-react';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { StatusBadge } from '@/src/components/controllers/badge';
import { AppButton, AppIconButton } from '@/src/components/controllers/button';
import { inputText, WEEK_DAY_OPTIONS as DAYS_OF_WEEK, weekDayName } from '@/src/core/format';
import { useTeachersMirror } from '../store/useTeachersMirror';

export interface TeacherAvailabilityTabProps {
  onSaveAvailabilities: () => Promise<void>;
  newAvailDay: string;
  setNewAvailDay: (v: string) => void;
  newAvailStart: string;
  setNewAvailStart: (v: string) => void;
  newAvailEnd: string;
  setNewAvailEnd: (v: string) => void;
  onAddAvailabilityWindow: () => void;
}

/** Weekly availability windows (staged locally, saved together). */
export function TeacherAvailabilityTab({
  onSaveAvailabilities,
  newAvailDay,
  setNewAvailDay,
  newAvailStart,
  setNewAvailStart,
  newAvailEnd,
  setNewAvailEnd,
  onAddAvailabilityWindow,
}: TeacherAvailabilityTabProps) {
  const stagedAvailabilities = useTeachersMirror('stagedAvailabilities');
  const isSavingAvailabilities = useTeachersMirror('isSavingAvailabilities');
  const removeStagedAvailability = useTeachersMirror('removeStagedAvailability');

  return (
    <Stack gap="md">
      <Text size="xs" c="dimmed">
        حدد الفترات الزمنية الأسبوعية التي يتواجد فيها المعلم في المعهد. في حال عدم تحديد أي فترات، يعتبر المعلم متاحا
        في كامل أوقات دوام المعهد.
      </Text>

      {/* Add Availability Window Bar */}
      <Paper p="md" radius="xl" withBorder bg="var(--app-subtle)">
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xs">
          <AppSelect
            placeholder="اختر اليوم"
            data={DAYS_OF_WEEK}
            value={newAvailDay}
            onChange={(val: string | null) => setNewAvailDay(val || '0')}
          />
          <AppInput
            placeholder="من (08:00)"
            value={newAvailStart}
            onChange={(val) => setNewAvailStart(inputText(val))}
          />
          <AppInput placeholder="إلى (12:00)" value={newAvailEnd} onChange={(val) => setNewAvailEnd(inputText(val))} />
          <AppButton
            variant="outline"
            leftSection={<IconPlus size={16} />}
            onClick={onAddAvailabilityWindow}
            disabled={!newAvailStart || !newAvailEnd}
          >
            إضافة فترة
          </AppButton>
        </SimpleGrid>
      </Paper>

      {/* Availability Windows Table */}
      {stagedAvailabilities.length === 0 ? (
        <Center py="xl">
          <Text size="sm" c="dimmed">
            لا توجد فترات دوام مخصصة (المعلم متاح طيلة الدوام الرسمي)
          </Text>
        </Center>
      ) : (
        <Table.ScrollContainer minWidth={400}>
          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>اليوم</Table.Th>
                <Table.Th>الفترة الزمنية</Table.Th>
                <Table.Th ta="center">حذف</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {stagedAvailabilities.map((win, idx) => (
                <Table.Tr key={idx}>
                  <Table.Td>
                    <StatusBadge tone="info">{weekDayName(win.dayOfWeek)}</StatusBadge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500} dir="ltr">
                      {win.startTime} - {win.endTime}
                    </Text>
                  </Table.Td>
                  <Table.Td ta="center">
                    <AppIconButton variant="danger" label="حذف الفترة" onClick={() => removeStagedAvailability(idx)}>
                      <IconTrash size={16} />
                    </AppIconButton>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      <Group justify="flex-end" mt="md">
        <AppButton
          leftSection={<IconDeviceFloppy size={18} />}
          loading={isSavingAvailabilities}
          onClick={onSaveAvailabilities}
        >
          حفظ أوقات الدوام
        </AppButton>
      </Group>
    </Stack>
  );
}
