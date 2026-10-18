'use client';

import { useMemo } from 'react';
import { Button } from '@mantine/core';
import { IconPlus, IconUserPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppSelect } from '@/src/components/controllers/input';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { studentsLabels } from '../static-data/students.data';
import { getStudentsColumns } from './StudentsTable';
import { Branch, Student } from '@/src/core/api';

export interface StudentsViewProps {
  branches: Branch[];
}

export function StudentsView({ branches }: StudentsViewProps) {
  const students = useStudentsMirror('students');
  const total = useStudentsMirror('total');
  const totalPages = useStudentsMirror('totalPages');
  const page = useStudentsMirror('page');
  const limit = useStudentsMirror('limit');
  const isLoading = useStudentsMirror('isLoading');
  const search = useStudentsMirror('search');
  const selectedBranchId = useStudentsMirror('selectedBranchId');
  const setPage = useStudentsMirror('setPage');
  const setSearch = useStudentsMirror('setSearch');
  const setSelectedBranchId = useStudentsMirror('setSelectedBranchId');

  const columns = useMemo(() => getStudentsColumns(), []);

  const branchOptions = useMemo(
    () => [
      { value: 'all', label: studentsLabels.allBranches },
      ...branches.map((b) => ({ value: String(b.id), label: b.name })),
    ],
    [branches],
  );

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
        <DataModuleController.FilterSlot>
          <AppSelect
            placeholder={studentsLabels.allBranches}
            data={branchOptions}
            value={selectedBranchId ? String(selectedBranchId) : 'all'}
            onChange={(val: string | null) =>
              setSelectedBranchId(val && val !== 'all' ? Number(val) : null)
            }
            clearable
          />
        </DataModuleController.FilterSlot>
      </DataModuleController.FilterBar>

      <DataModuleController.Content>
        <DataModuleController.Table />
      </DataModuleController.Content>

      <DataModuleController.Footer />
    </DataModuleController>
  );
}
