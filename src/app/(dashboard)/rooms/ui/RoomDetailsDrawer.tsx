'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Divider,
  Drawer,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconBuildingCommunity,
  IconCalendarTime,
  IconClock,
  IconDeviceFloppy,
  IconPlus,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { useRoomsMirror } from '../store/useRoomsMirror';

const DAYS_OF_WEEK = [
  { value: '0', label: 'الأحد' },
  { value: '1', label: 'الإثنين' },
  { value: '2', label: 'الثلاثاء' },
  { value: '3', label: 'الأربعاء' },
  { value: '4', label: 'الخميس' },
  { value: '5', label: 'الجمعة' },
  { value: '6', label: 'السبت' },
];

const dayNameMap: Record<number, string> = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

interface RoomDetailsDrawerProps {
  onSaveAvailabilities: () => Promise<void>;
  newAvailDay: string;
  setNewAvailDay: (v: string) => void;
  newAvailStart: string;
  setNewAvailStart: (v: string) => void;
  newAvailEnd: string;
  setNewAvailEnd: (v: string) => void;
  onAddAvailabilityWindow: () => void;
}

export function RoomDetailsDrawer({
  onSaveAvailabilities,
  newAvailDay,
  setNewAvailDay,
  newAvailStart,
  setNewAvailStart,
  newAvailEnd,
  setNewAvailEnd,
  onAddAvailabilityWindow,
}: RoomDetailsDrawerProps) {
  const detailsDrawerOpened = useRoomsMirror('detailsDrawerOpened');
  const selectedRoomDetails = useRoomsMirror('selectedRoomDetails');
  const stagedAvailabilities = useRoomsMirror('stagedAvailabilities');
  const isSavingAvailabilities = useRoomsMirror('isSavingAvailabilities');

  const closeDetailsDrawer = useRoomsMirror('closeDetailsDrawer');
  const removeStagedAvailability = useRoomsMirror('removeStagedAvailability');

  if (!selectedRoomDetails) return null;

  return (
    <Drawer
      opened={detailsDrawerOpened}
      onClose={closeDetailsDrawer}
      position="right"
      size="lg"
      title={
        <Group gap="xs">
          <IconBuildingCommunity size={20} />
          <Text fw={700} size="md">
            تفاصيل القاعة: {selectedRoomDetails.name}
          </Text>
        </Group>
      }
      padding="lg"
      radius="md"
    >
      <Tabs defaultValue="overview">
        <Tabs.List mb="md">
          <Tabs.Tab
            value="overview"
            leftSection={<IconBuildingCommunity size={16} />}
          >
            نظرة عامة
          </Tabs.Tab>
          <Tabs.Tab
            value="availability"
            leftSection={<IconCalendarTime size={16} />}
          >
            أوقات إتاحة القاعة ({stagedAvailabilities.length})
          </Tabs.Tab>
        </Tabs.List>

        {/* ── Tab 1: Overview ── */}
        <Tabs.Panel value="overview">
          <Stack gap="md">
            <Paper p="md" radius="xl" withBorder>
              <SimpleGrid cols={2} spacing="md">
                <div>
                  <Text size="xs" c="dimmed">
                    اسم القاعة
                  </Text>
                  <Text size="sm" fw={700}>
                    {selectedRoomDetails.name}
                  </Text>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    نوع القاعة
                  </Text>
                  <Badge variant="light" color="blue" radius="xl">
                    {selectedRoomDetails.type}
                  </Badge>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    السعة الاستيعابية
                  </Text>
                  <Group gap={4}>
                    <IconUsers size={16} color="gray" />
                    <Text size="sm" fw={700}>
                      {selectedRoomDetails.capacity} مقعد
                    </Text>
                  </Group>
                </div>
                <div>
                  <Text size="xs" c="dimmed">
                    الفرع
                  </Text>
                  <Text size="sm" fw={700}>
                    {selectedRoomDetails.branch?.name || 'كافة الفروع'}
                  </Text>
                </div>
              </SimpleGrid>
            </Paper>

            <Paper p="md" radius="xl" withBorder>
              <Group justify="space-between" align="center">
                <Text size="xs" c="dimmed">
                  إجمالي الحصص المجدولة في هذه القاعة
                </Text>
                <Badge variant="filled" color="blue" radius="xl">
                  {selectedRoomDetails._count?.timetableEntries ?? 0} حصة
                </Badge>
              </Group>
            </Paper>
          </Stack>
        </Tabs.Panel>

        {/* ── Tab 2: Availability Windows ── */}
        <Tabs.Panel value="availability">
          <Stack gap="md">
            <Text size="xs" c="dimmed">
              حدد الفترات التي تتاح فيها القاعة للتدريس. إذا لم يتم إدخال فترات، تُعتبر القاعة متاحة طيلة أوقات دوام المعهد.
            </Text>

            {/* Add Availability Window Bar */}
            <Paper p="md" radius="xl" withBorder bg="var(--mantine-color-gray-0)">
              <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xs">
                <AppSelect
                  placeholder="اختر اليوم"
                  data={DAYS_OF_WEEK}
                  value={newAvailDay}
                  onChange={(val: any) => setNewAvailDay(val || '0')}
                />
                <AppInput
                  placeholder="من (08:00)"
                  value={newAvailStart}
                  onChange={(val) => setNewAvailStart(val)}
                />
                <AppInput
                  placeholder="إلى (14:00)"
                  value={newAvailEnd}
                  onChange={(val) => setNewAvailEnd(val)}
                />
                <Button
                  leftSection={<IconPlus size={16} />}
                  variant="light"
                  color="blue"
                  radius="xl"
                  onClick={onAddAvailabilityWindow}
                  disabled={!newAvailStart || !newAvailEnd}
                >
                  إضافة فترة
                </Button>
              </SimpleGrid>
            </Paper>

            {/* Windows Table */}
            {stagedAvailabilities.length === 0 ? (
              <Center py="xl">
                <Text size="sm" c="dimmed">
                  القاعة متاحة في جميع أيام وساعات الدوام الرسمي
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
                          <Badge variant="light" color="blue" radius="xl">
                            {dayNameMap[win.dayOfWeek] || `يوم ${win.dayOfWeek}`}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600} dir="ltr">
                            {win.startTime} - {win.endTime}
                          </Text>
                        </Table.Td>
                        <Table.Td ta="center">
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            radius="xl"
                            onClick={() => removeStagedAvailability(idx)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            )}

            <Group justify="flex-end" mt="md">
              <Button
                leftSection={<IconDeviceFloppy size={18} />}
                radius="xl"
                loading={isSavingAvailabilities}
                onClick={onSaveAvailabilities}
              >
                حفظ أوقات الإتاحة
              </Button>
            </Group>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Drawer>
  );
}
