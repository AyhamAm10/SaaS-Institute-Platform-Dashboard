'use client';

import { useMemo } from 'react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { IconPlus, IconRefresh, IconUserCheck } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { Teacher } from '@/src/core/api';
import { useTeachersMirror } from '../store/useTeachersMirror';
import { getTeachersColumns } from './TeachersTable';
import { TeachersModals, TeachersModalsProps } from './TeachersModals';

export interface TeachersViewAccess {
  canManage?: boolean;
}

export interface TeachersViewProps extends Omit<TeachersModalsProps, 'canManage'> {
  access?: TeachersViewAccess;
  onRefresh: () => void;
}

export function TeachersView({ access, onRefresh, ...modalProps }: TeachersViewProps) {
  const canManage = access?.canManage ?? true;
  const data = useTeachersMirror('data');
  const isFetching = useTeachersMirror('isFetching');
  const isLoading = useTeachersMirror('isLoading');
  const page = useTeachersMirror('page');
  const totalPages = useTeachersMirror('totalPages');
  const total = useTeachersMirror('total');
  const limit = useTeachersMirror('limit');
  const setPage = useTeachersMirror('setPage');
  const setSearch = useTeachersMirror('setSearch');
  const openEditDrawer = useTeachersMirror('openEditDrawer');
  const openDetailsDrawer = useTeachersMirror('openDetailsDrawer');
  const openDeleteModal = useTeachersMirror('openDeleteModal');
  const openPasswordModal = useTeachersMirror('openPasswordModal');

  const columns = useMemo(
    () =>
      getTeachersColumns(
        openDetailsDrawer,
        openEditDrawer,
        openDeleteModal,
        openPasswordModal,
        { canManage },
      ),
    [openDetailsDrawer, openEditDrawer, openDeleteModal, openPasswordModal, canManage],
  );

  return (
    <AppModule exportTitle="الكادر التدريسي">
      <AppModule.Table>
        <DataModuleController
          selectable
          title="الكادر التدريسي"
          description="إدارة المعلمين، تخصصاتهم، مؤهلات الفروع والمواد، وتحديد أوقات تفرغهم الأسبوعية"
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyMessage="لا يوجد معلمون مسجلون حاليا"
          emptyDescription="يمكنك إضافة معلم جديد بالنقر على زر إضافة معلم في الأعلى"
          searchPlaceholder="البحث بالاسم أو رقم الهاتف..."
          keyExtractor={(item: Teacher) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.Header>
            <DataModuleController.Title
              icon={<IconUserCheck size={18} />}
              badgeLabel="معلم"
            />
            {canManage && (
              <DataModuleController.Actions>
                <Button
                  component={Link}
                  href="/teachers/new"
                  leftSection={<IconPlus size={16} />}
                  color="primary"
                  radius="md"
                >
                  إضافة معلم
                </Button>
              </DataModuleController.Actions>
            )}
          </DataModuleController.Header>

          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder="البحث بالاسم أو رقم الهاتف..." />
            <DataModuleController.FilterSlot>
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

      <TeachersModals canManage={canManage} {...modalProps} />
    </AppModule>
  );
}
