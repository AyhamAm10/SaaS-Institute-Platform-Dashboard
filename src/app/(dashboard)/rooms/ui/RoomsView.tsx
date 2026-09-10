'use client';

import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconBuildingCommunity,
  IconPlus,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { useBranchesQuery } from '@/src/core/api';
import { Room } from '@/src/core/api';
import { useRoomsMirror } from '../store/useRoomsMirror';
import { RoomsTable } from './RoomsTable';
import { RoomFormDrawer } from './RoomFormDrawer';
import { RoomDetailsDrawer } from './RoomDetailsDrawer';
import { RoomDeleteModal } from './RoomDeleteModal';

const ROOM_TYPE_FILTER_OPTIONS = [
  { value: '', label: 'كافة أنواع القاعات' },
  { value: 'CLASSROOM', label: 'صف دراسي' },
  { value: 'LAB', label: 'مختبر علمي / حاسوب' },
  { value: 'HALL', label: 'مدرج / قاعة محاضرات' },
  { value: 'ACTIVITY', label: 'قاعة أنشطة وورش عمل' },
];

interface RoomsViewProps {
  onRefresh: () => void;
  onSubmit: () => void;
  onConfirmDelete: (room: Room) => Promise<void>;
  onSaveAvailabilities: () => Promise<void>;
  newAvailDay: string;
  setNewAvailDay: (v: string) => void;
  newAvailStart: string;
  setNewAvailStart: (v: string) => void;
  newAvailEnd: string;
  setNewAvailEnd: (v: string) => void;
  onAddAvailabilityWindow: () => void;
}

export function RoomsView({
  onRefresh,
  onSubmit,
  onConfirmDelete,
  onSaveAvailabilities,
  newAvailDay,
  setNewAvailDay,
  newAvailStart,
  setNewAvailStart,
  newAvailEnd,
  setNewAvailEnd,
  onAddAvailabilityWindow,
}: RoomsViewProps) {
  const search = useRoomsMirror('search');
  const type = useRoomsMirror('type');
  const branchId = useRoomsMirror('branchId');
  const isFetching = useRoomsMirror('isFetching');

  const setSearch = useRoomsMirror('setSearch');
  const setType = useRoomsMirror('setType');
  const setBranchId = useRoomsMirror('setBranchId');
  const openCreateDrawer = useRoomsMirror('openCreateDrawer');

  const { data: branches } = useBranchesQuery();
  const branchOptions = [
    { value: '', label: 'كافة الفروع' },
    ...(branches || []).map((b: any) => ({
      value: String(b.id),
      label: b.name,
    })),
  ];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Paper p="lg" radius="xl" withBorder>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="sm">
            <Paper
              p="xs"
              radius="xl"
              bg="var(--mantine-color-teal-0)"
              c="teal.7"
            >
              <IconBuildingCommunity size={28} />
            </Paper>
            <Stack gap={2}>
              <Title order={2} fw={800}>
                القاعات والمختبرات
              </Title>
              <Text c="dimmed" size="xs">
                إدارة القاعات الدراسية، المختبرات، السعة الاستيعابية، وتحديد فترات التوافر
              </Text>
            </Stack>
          </Group>

          <Group gap="sm">
            <Button
              leftSection={<IconRefresh size={18} />}
              variant="light"
              color="gray"
              radius="xl"
              onClick={onRefresh}
              loading={isFetching}
            >
              تحديث
            </Button>
            <Button
              leftSection={<IconPlus size={18} />}
              radius="xl"
              onClick={openCreateDrawer}
            >
              إضافة قاعة
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Filters Toolbar */}
      <Paper p="md" radius="xl" withBorder>
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <AppInput
            placeholder="البحث باسم القاعة..."
            value={search}
            onChange={setSearch}
            leftSection={<IconSearch size={16} />}
            clearable
          />
          <AppSelect
            placeholder="تصفية حسب نوع القاعة"
            data={ROOM_TYPE_FILTER_OPTIONS}
            value={type || ''}
            onChange={(val: any) => setType(val || undefined)}
          />
          <AppSelect
            placeholder="تصفية حسب الفرع"
            data={branchOptions}
            value={branchId ? String(branchId) : ''}
            onChange={(val: any) => setBranchId(val ? Number(val) : undefined)}
          />
        </SimpleGrid>
      </Paper>

      {/* Table */}
      <RoomsTable />

      {/* Drawers & Modals */}
      <RoomFormDrawer onSubmit={onSubmit} />
      <RoomDetailsDrawer
        onSaveAvailabilities={onSaveAvailabilities}
        newAvailDay={newAvailDay}
        setNewAvailDay={setNewAvailDay}
        newAvailStart={newAvailStart}
        setNewAvailStart={setNewAvailStart}
        newAvailEnd={newAvailEnd}
        setNewAvailEnd={setNewAvailEnd}
        onAddAvailabilityWindow={onAddAvailabilityWindow}
      />
      <RoomDeleteModal onConfirmDelete={onConfirmDelete} />
    </Stack>
  );
}
