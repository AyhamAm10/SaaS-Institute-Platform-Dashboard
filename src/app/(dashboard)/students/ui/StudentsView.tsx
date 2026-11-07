'use client';

import { useMemo } from 'react';
import { IconUserPlus, IconUsers } from '@tabler/icons-react';
import { AppButton, AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { studentsLabels } from '../static-data/students.data';
import { getStudentsColumns, StudentsAccess } from './StudentsTable';
import { StudentEditDrawer } from './StudentEditDrawer';
import { StudentDeleteModal } from './StudentDeleteModal';
import { StudentsFilters } from './StudentsFilters';
import { StudentFinanceSlot } from './StudentFinanceSlot';
import { StudentsOverview } from './StudentsOverview';
import { Student } from '@/src/core/api';

export interface StudentsViewProps {
  /** What the role may do here (computed by the controller from permissions). */
  access: StudentsAccess;
  onSubmitEdit: () => Promise<void>;
  onConfirmDelete: (student: Student) => Promise<void>;
}

export function StudentsView({ access, onSubmitEdit, onConfirmDelete }: StudentsViewProps) {
  const students = useStudentsMirror('students');
  const total = useStudentsMirror('total');
  const totalPages = useStudentsMirror('totalPages');
  const page = useStudentsMirror('page');
  const limit = useStudentsMirror('limit');
  const isLoading = useStudentsMirror('isLoading');
  const setPage = useStudentsMirror('setPage');
  const setSearch = useStudentsMirror('setSearch');
  const openEditDrawer = useStudentsMirror('openEditDrawer');
  const openDeleteModal = useStudentsMirror('openDeleteModal');
  const openFinance = useStudentsMirror('openFinance');

  const columns = useMemo(
    () => getStudentsColumns(openEditDrawer, openDeleteModal, openFinance, access),
    [openEditDrawer, openDeleteModal, openFinance, access],
  );

  return (
    <AppModule exportTitle="قائمة الطلاب">
      {/* Note: AppModule.Header is intentionally omitted on this page per requirements */}

      {/* 1. Real KPI cards and charts (GET /dashboard/overview) */}
      <StudentsOverview />

      {/* 3. Modern Floating Strip Table */}
      <AppModule.Table>
        <DataModuleController
          selectable
          title={studentsLabels.title}
          description=""
          data={students}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          emptyMessage={studentsLabels.emptyMessage}
          emptyDescription={studentsLabels.emptyDescription}
          searchPlaceholder={studentsLabels.searchPlaceholder}
          keyExtractor={(item: Student) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.Header>
            <DataModuleController.Title icon={<IconUsers size={22} stroke={1.7} />} badgeLabel="طالب" />
            {access.canManage && (
              <DataModuleController.Actions>
                <AppButton href="/students/new" leftSection={<IconUserPlus size={16} stroke={1.7} />}>
                  {studentsLabels.createAction}
                </AppButton>
              </DataModuleController.Actions>
            )}
          </DataModuleController.Header>

          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder={studentsLabels.searchPlaceholder} />
            <DataModuleController.FilterSlot>
              <StudentsFilters />
            </DataModuleController.FilterSlot>
          </DataModuleController.FilterBar>

          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>

          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>

      <StudentEditDrawer onSubmit={onSubmitEdit} />
      <StudentDeleteModal onConfirmDelete={onConfirmDelete} />
      <StudentFinanceSlot />
    </AppModule>
  );
}
