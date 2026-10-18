'use client';

import { useMemo } from 'react';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { useStudentFieldsMirror } from '../store/useStudentFieldsMirror';
import { studentFieldsLabels } from '../static-data/student-fields.data';
import { getStudentFieldsColumns } from './StudentFieldsTable';
import { StudentFieldDrawer } from './StudentFieldDrawer';
import { StudentField } from '@/src/core/api';

export interface StudentFieldsViewProps {
  onSubmit: () => Promise<void>;
}

export function StudentFieldsView({ onSubmit }: StudentFieldsViewProps) {
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
        f.label?.toLowerCase().includes(q) ||
        f.name?.toLowerCase().includes(q) ||
        f.type?.toLowerCase().includes(q),
    );
  }, [fields, search]);

  const columns = useMemo(() => getStudentFieldsColumns(openEditDrawer), [openEditDrawer]);

  return (
    <>
      <DataModuleController
        title={studentFieldsLabels.title}
        description={studentFieldsLabels.description}
        data={filteredFields}
        columns={columns}
        total={filteredFields.length}
        page={1}
        limit={50}
        totalPages={1}
        isLoading={isLoading}
        emptyMessage={studentFieldsLabels.emptyMessage}
        emptyDescription={studentFieldsLabels.emptyDescription}
        searchPlaceholder={studentFieldsLabels.searchPlaceholder}
        keyExtractor={(item: StudentField) => item.id}
        onSearchChange={setSearch}
      >
        <DataModuleController.Header>
          <DataModuleController.Title />
          <DataModuleController.Actions>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateDrawer}
              color="primary"
              radius="md"
            >
              {studentFieldsLabels.createAction}
            </Button>
          </DataModuleController.Actions>
        </DataModuleController.Header>

        <DataModuleController.FilterBar>
          <DataModuleController.SearchInput placeholder={studentFieldsLabels.searchPlaceholder} />
        </DataModuleController.FilterBar>

        <DataModuleController.Content>
          <DataModuleController.Table />
        </DataModuleController.Content>

        <DataModuleController.Footer />
      </DataModuleController>

      <StudentFieldDrawer onSubmit={onSubmit} />
    </>
  );
}
