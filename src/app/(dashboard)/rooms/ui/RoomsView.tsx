'use client';

import { useMemo } from 'react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import {
  IconBuildingCommunity,
  IconPlus,
  IconRefresh,
} from '@tabler/icons-react';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppSelect } from '@/src/components/controllers/input';
import { useBranchesQuery, Room } from '@/src/core/api';
import { useRoomsMirror } from '../store/useRoomsMirror';
import { getRoomsColumns } from './RoomsTable';
import { RoomFormDrawer } from './RoomFormDrawer';
import { RoomDetailsDrawer } from './RoomDetailsDrawer';
import { RoomDeleteModal } from './RoomDeleteModal';

const ROOM_TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'كافة أنواع القاعات' },
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
  const data = useRoomsMirror('data');
  const search = useRoomsMirror('search');
  const type = useRoomsMirror('type');
  const branchId = useRoomsMirror('branchId');
  const isFetching = useRoomsMirror('isFetching');
  const isLoading = useRoomsMirror('isLoading');
  const page = useRoomsMirror('page');
  const totalPages = useRoomsMirror('totalPages');
  const total = useRoomsMirror('total');
  const limit = useRoomsMirror('limit');

  const setSearch = useRoomsMirror('setSearch');
  const setType = useRoomsMirror('setType');
  const setBranchId = useRoomsMirror('setBranchId');
  const setPage = useRoomsMirror('setPage');
  const openCreateDrawer = useRoomsMirror('openCreateDrawer');
  const openEditDrawer = useRoomsMirror('openEditDrawer');
  const openDetailsDrawer = useRoomsMirror('openDetailsDrawer');
  const openDeleteModal = useRoomsMirror('openDeleteModal');

  const { data: branches } = useBranchesQuery();
  const branchOptions = useMemo(
    () => [
      { value: 'all', label: 'كافة الفروع' },
      ...(branches || []).map((b: any) => ({
        value: String(b.id),
        label: b.name,
      })),
    ],
    [branches],
  );

  const columns = useMemo(
    () => getRoomsColumns(openDetailsDrawer, openEditDrawer, openDeleteModal),
    [openDetailsDrawer, openEditDrawer, openDeleteModal],
  );

  return (
    <>
      <DataModuleController
        title="القاعات والمختبرات"
        description="إدارة القاعات الدراسية، المختبرات، السعة الاستيعابية، وتحديد فترات التوافر"
        data={data}
        columns={columns}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage="لا توجد قاعات دراسية مسجلة"
        emptyDescription="يمكنك إضافة قاعة جديدة بالنقر على زر إضافة قاعة في الأعلى"
        searchPlaceholder="البحث باسم القاعة..."
        keyExtractor={(item: Room) => item.id}
        onPageChange={setPage}
        onSearchChange={setSearch}
      >
        <DataModuleController.Header>
          <DataModuleController.Title
            icon={<IconBuildingCommunity size={18} />}
            badgeLabel="قاعة"
          />
          <DataModuleController.Actions>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateDrawer}
              color="primary"
              radius="md"
            >
              إضافة قاعة
            </Button>
          </DataModuleController.Actions>
        </DataModuleController.Header>

        <DataModuleController.FilterBar>
          <DataModuleController.SearchInput placeholder="البحث باسم القاعة..." />
          <DataModuleController.FilterSlot>
            <AppSelect
              placeholder="تصفية حسب نوع القاعة"
              data={ROOM_TYPE_FILTER_OPTIONS}
              value={type || 'all'}
              onChange={(val: any) => setType(val && val !== 'all' ? val : undefined)}
              clearable
            />
            <AppSelect
              placeholder="تصفية حسب الفرع"
              data={branchOptions}
              value={branchId ? String(branchId) : 'all'}
              onChange={(val: any) => setBranchId(val && val !== 'all' ? Number(val) : undefined)}
              clearable
            />
            {onRefresh && (
              <Tooltip label="تحديث البيانات" withArrow position="top">
                <ActionIcon
                  variant="light"
                  color="primary"
                  size="md"
                  radius="md"
                  onClick={onRefresh}
                  loading={isFetching}
                  aria-label="تحديث البيانات"
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              </Tooltip>
            )}
          </DataModuleController.FilterSlot>
        </DataModuleController.FilterBar>

        <DataModuleController.Content>
          <DataModuleController.Table />
        </DataModuleController.Content>

        <DataModuleController.Footer />
      </DataModuleController>

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
    </>
  );
}
