'use client';

import { useMemo } from 'react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import Link from 'next/link';
import {
  IconPlus,
  IconRefresh,
  IconUserCheck,
} from '@tabler/icons-react';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { Teacher } from '@/src/core/api';
import { useTeachersMirror } from '../store/useTeachersMirror';
import { getTeachersColumns } from './TeachersTable';
import { TeacherFormDrawer } from './TeacherFormDrawer';
import { TeacherDetailsDrawer } from './TeacherDetailsDrawer';
import { TeacherDeleteModal } from './TeacherDeleteModal';

interface TeachersViewProps {
  onRefresh: () => void;
  onSubmit: () => void;
  onConfirmDelete: (teacher: Teacher) => Promise<void>;
  onAssignQualification: (branchId: number, subjectId: number) => Promise<void>;
  onRemoveQualification: (assignmentId: number) => Promise<void>;
  onSaveAvailabilities: () => Promise<void>;
  newAvailDay: string;
  setNewAvailDay: (v: string) => void;
  newAvailStart: string;
  setNewAvailStart: (v: string) => void;
  newAvailEnd: string;
  setNewAvailEnd: (v: string) => void;
  onAddAvailabilityWindow: () => void;
}

export function TeachersView({
  onRefresh,
  onSubmit,
  onConfirmDelete,
  onAssignQualification,
  onRemoveQualification,
  onSaveAvailabilities,
  newAvailDay,
  setNewAvailDay,
  newAvailStart,
  setNewAvailStart,
  newAvailEnd,
  setNewAvailEnd,
  onAddAvailabilityWindow,
}: TeachersViewProps) {
  const data = useTeachersMirror('data');
  const search = useTeachersMirror('search');
  const isFetching = useTeachersMirror('isFetching');
  const isLoading = useTeachersMirror('isLoading');
  const page = useTeachersMirror('page');
  const totalPages = useTeachersMirror('totalPages');
  const total = useTeachersMirror('total');
  const limit = useTeachersMirror('limit');
  const setPage = useTeachersMirror('setPage');
  const setSearch = useTeachersMirror('setSearch');
  const openCreateDrawer = useTeachersMirror('openCreateDrawer');
  const openEditDrawer = useTeachersMirror('openEditDrawer');
  const openDetailsDrawer = useTeachersMirror('openDetailsDrawer');
  const openDeleteModal = useTeachersMirror('openDeleteModal');

  const columns = useMemo(
    () => getTeachersColumns(openDetailsDrawer, openEditDrawer, openDeleteModal),
    [openDetailsDrawer, openEditDrawer, openDeleteModal],
  );

  return (
    <>
      <DataModuleController
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
        </DataModuleController.Header>

        <DataModuleController.FilterBar>
          <DataModuleController.SearchInput placeholder="البحث بالاسم أو رقم الهاتف..." />
          <DataModuleController.FilterSlot>
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

      {/* Drawers and Modals */}
      <TeacherFormDrawer onSubmit={onSubmit} />
      <TeacherDetailsDrawer
        onAssignQualification={onAssignQualification}
        onRemoveQualification={onRemoveQualification}
        onSaveAvailabilities={onSaveAvailabilities}
        newAvailDay={newAvailDay}
        setNewAvailDay={setNewAvailDay}
        newAvailStart={newAvailStart}
        setNewAvailStart={setNewAvailStart}
        newAvailEnd={newAvailEnd}
        setNewAvailEnd={setNewAvailEnd}
        onAddAvailabilityWindow={onAddAvailabilityWindow}
      />
      <TeacherDeleteModal onConfirmDelete={onConfirmDelete} />
    </>
  );
}
