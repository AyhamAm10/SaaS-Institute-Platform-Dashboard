'use client';

import { useMemo } from 'react';
import { Button } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { studentsLabels } from '../static-data/students.data';
import { getStudentsColumns } from './StudentsTable';
import { Student } from '@/src/core/api';

export function StudentsView() {
  const students = useStudentsMirror('students');
  const total = useStudentsMirror('total');
  const totalPages = useStudentsMirror('totalPages');
  const page = useStudentsMirror('page');
  const limit = useStudentsMirror('limit');
  const isLoading = useStudentsMirror('isLoading');
  const setPage = useStudentsMirror('setPage');
  const setSearch = useStudentsMirror('setSearch');

  const columns = useMemo(() => getStudentsColumns(), []);

  return (
    <DataModuleController
      title={studentsLabels.title}
      description={studentsLabels.description}
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
        <DataModuleController.Title />
        <DataModuleController.Actions>
          <Button
            component={Link}
            href="/students/new"
            leftSection={<IconUserPlus size={16} />}
            color="primary"
            radius="md"
          >
            {studentsLabels.createAction}
          </Button>
        </DataModuleController.Actions>
      </DataModuleController.Header>

      <DataModuleController.FilterBar>
        <DataModuleController.SearchInput placeholder={studentsLabels.searchPlaceholder} />
      </DataModuleController.FilterBar>

      <DataModuleController.Content>
        <DataModuleController.Table />
      </DataModuleController.Content>

      <DataModuleController.Footer />
    </DataModuleController>
  );
}
