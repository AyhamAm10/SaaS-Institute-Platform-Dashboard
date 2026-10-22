'use client';

import { useMemo } from 'react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import {
  IconPlus,
  IconRefresh,
  IconUserCheck,
} from '@tabler/icons-react';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppSelect } from '@/src/components/controllers/input';
import { useBranchesQuery, Teacher } from '@/src/core/api';
import { useOperationalContext } from '@/src/core/context';
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
  const branchId = useTeachersMirror('branchId');
  const isFetching = useTeachersMirror('isFetching');
  const isLoading = useTeachersMirror('isLoading');
  const page = useTeachersMirror('page');
  const totalPages = useTeachersMirror('totalPages');
  const total = useTeachersMirror('total');
  const limit = useTeachersMirror('limit');
  const setPage = useTeachersMirror('setPage');
  const setSearch = useTeachersMirror('setSearch');
  const setBranchId = useTeachersMirror('setBranchId');
  const openCreateDrawer = useTeachersMirror('openCreateDrawer');
  const openEditDrawer = useTeachersMirror('openEditDrawer');
  const openDetailsDrawer = useTeachersMirror('openDetailsDrawer');
  const openDeleteModal = useTeachersMirror('openDeleteModal');
  const { activeBranchId } = useOperationalContext();

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
              leftSection={<IconPlus size={16} />}
              onClick={() => openCreateDrawer(activeBranchId ?? undefined)}
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
