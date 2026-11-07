'use client';

import { useMemo } from 'react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconBuildingCommunity, IconPlus, IconRefresh } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppSelect } from '@/src/components/controllers/input';
import { Room } from '@/src/core/api';
import { useRoomsMirror } from '../store/useRoomsMirror';
import { getRoomsColumns } from './RoomsTable';
import { RoomsDrawers, RoomsDrawersProps } from './RoomsDrawers';

const ROOM_TYPE_FILTER_OPTIONS = [
  { value: 'all', label: 'كافة أنواع القاعات' },
  { value: 'CLASSROOM', label: 'صف دراسي' },
  { value: 'LAB', label: 'مختبر علمي / حاسوب' },
  { value: 'HALL', label: 'مدرج / قاعة محاضرات' },
  { value: 'ACTIVITY', label: 'قاعة أنشطة وورش عمل' },
];

export interface RoomsViewProps extends RoomsDrawersProps {
  onRefresh?: () => void;
}

export function RoomsView({ onRefresh, ...drawerProps }: RoomsViewProps) {
  const { canManage = true } = drawerProps;
  const data = useRoomsMirror('data');
  const type = useRoomsMirror('type');
  const isFetching = useRoomsMirror('isFetching');
  const isLoading = useRoomsMirror('isLoading');
  const page = useRoomsMirror('page');
  const totalPages = useRoomsMirror('totalPages');
  const total = useRoomsMirror('total');
  const limit = useRoomsMirror('limit');
  const setSearch = useRoomsMirror('setSearch');
  const setType = useRoomsMirror('setType');
  const setPage = useRoomsMirror('setPage');
  const openCreateDrawer = useRoomsMirror('openCreateDrawer');
  const openEditDrawer = useRoomsMirror('openEditDrawer');
  const openDetailsDrawer = useRoomsMirror('openDetailsDrawer');
  const openDeleteModal = useRoomsMirror('openDeleteModal');

  const columns = useMemo(
    () => getRoomsColumns(openDetailsDrawer, openEditDrawer, openDeleteModal, { canManage }),
    [openDetailsDrawer, openEditDrawer, openDeleteModal, canManage],
  );

  return (
    <AppModule exportTitle="القاعات">
      <AppModule.Table>
        <DataModuleController
          selectable
          title="القاعات والمختبرات"
          description="إدارة القاعات الصفية، المختبرات العلمية، الطاقة الاستيعابية وأوقات التفرغ الأسبوعية"
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyMessage="لا توجد قاعات مطابقة للبحث"
          emptyDescription="يمكنك إضافة قاعة جديدة أو تعديل معايير التصفية والبحث"
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
            {canManage && (
              <DataModuleController.Actions>
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={openCreateDrawer}
                  color="primary"
                  radius="md"
                >
                  إضافة قاعة جديدة
                </Button>
              </DataModuleController.Actions>
            )}
          </DataModuleController.Header>

          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder="البحث باسم القاعة..." />
            <DataModuleController.FilterSlot>
              <AppSelect
                data={ROOM_TYPE_FILTER_OPTIONS}
                value={type || 'all'}
                onChange={(val: string | null) => setType(val === 'all' ? '' : val || '')}
                placeholder="تصفية حسب نوع القاعة"
                style={{ width: 190 }}
              />
              {onRefresh && (
                <Tooltip label="تحديث البيانات">
                  <ActionIcon
                    variant="subtle"
                    color="gray"
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
      </AppModule.Table>

      <RoomsDrawers {...drawerProps} />
    </AppModule>
  );
}
