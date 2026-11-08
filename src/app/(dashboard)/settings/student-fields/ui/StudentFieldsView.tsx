'use client';

import { useMemo } from 'react';

import { IconPlus } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers/app-module';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { useStudentFieldsMirror } from '../store/useStudentFieldsMirror';
import { studentFieldsLabels } from '../static-data/student-fields.data';
import { getStudentFieldsColumns } from './StudentFieldsTable';
import { StudentFieldDrawer } from './StudentFieldDrawer';
import { StudentField } from '@/src/core/api';
import { AppButton } from '@/src/components/controllers/button';

export interface StudentFieldsViewProps {
  onSubmit: () => Promise<void>;
  canManage?: boolean;
  hideHeader?: boolean;
}

export function StudentFieldsView({ onSubmit, canManage = true, hideHeader }: StudentFieldsViewProps) {
  const fields = useStudentFieldsMirror('fields');
  const isLoading = useStudentFieldsMirror('isLoading');
  const search = useStudentFieldsMirror('search');
  const setSearch = useStudentFieldsMirror('setSearch');
  const openCreateDrawer = useStudentFieldsMirror('openCreateDrawer');
  const openEditDrawer = useStudentFieldsMirror('openEditDrawer');

  const filteredFields = useMemo(() => {
    if (!search.trim()) return fields;
    const q = search.trim().toLowerCase();
    return fields.filter(
      (f) =>
        f.label?.toLowerCase().includes(q) || f.name?.toLowerCase().includes(q) || f.type?.toLowerCase().includes(q),
    );
  }, [fields, search]);

  const columns = useMemo(() => getStudentFieldsColumns(openEditDrawer, { canManage }), [openEditDrawer, canManage]);

  return (
    <AppModule exportTitle="الحقول المخصصة">
      <AppModule.Table>
        <DataModuleController
          title={hideHeader ? undefined : studentFieldsLabels.title}
          description={hideHeader ? undefined : studentFieldsLabels.description}
          data={filteredFields}
          columns={columns}
          total={filteredFields.length}
          page={1}
          limit={10}
          totalPages={1}
          isLoading={isLoading}
          emptyMessage={studentFieldsLabels.emptyMessage}
          emptyDescription={studentFieldsLabels.emptyDescription}
          searchPlaceholder={studentFieldsLabels.searchPlaceholder}
          keyExtractor={(item: StudentField) => item.id}
          onSearchChange={setSearch}
          selectable
        >
          <DataModuleController.Header>
            {!hideHeader && <DataModuleController.Title />}
            {canManage && (
              <DataModuleController.Actions>
                <AppButton leftSection={<IconPlus size={16} />} onClick={openCreateDrawer}>
                  {studentFieldsLabels.createAction}
                </AppButton>
              </DataModuleController.Actions>
            )}
          </DataModuleController.Header>

          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder={studentFieldsLabels.searchPlaceholder} />
          </DataModuleController.FilterBar>

          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>

          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>

      {canManage && <StudentFieldDrawer onSubmit={onSubmit} />}
    </AppModule>
  );
}
