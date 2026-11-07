'use client';

import { useMemo } from 'react';
import { Group } from '@mantine/core';
import { IconClipboardList, IconPlus } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton, AppDatePicker, AppSelect } from '@/src/components/controllers';
import type { Exam } from '@/src/core/api';
import { useExamsMirror } from '../store/exams.store';
import { examsLabels as labels } from '../static-data/exams.data';
import { type ExamsAccess, getExamsColumns } from './ExamsColumns';
import { DeleteExamModal } from './DeleteExamModal';
import { ExamDrawer } from './ExamDrawer';
import { ExamsOverview } from './ExamsOverview';

function ExamsFilters() {
  const filters = useExamsMirror('filters');
  const setFilter = useExamsMirror('setFilter');
  const sections = useExamsMirror('sectionOptions');
  const types = useExamsMirror('examTypeOptions');
  return (
    <Group gap="xs" wrap="wrap">
      <AppSelect
        placeholder={labels.sectionFilter}
        data={sections}
        value={filters.sectionId}
        onChange={(v: string | null) => setFilter('sectionId', v)}
        clearable
        searchable
        size="sm"
        w={170}
      />
      <AppSelect
        placeholder={labels.typeFilter}
        data={types}
        value={filters.examTypeId}
        onChange={(v: string | null) => setFilter('examTypeId', v)}
        clearable
        size="sm"
        w={150}
      />
      <AppDatePicker
        placeholder={labels.from}
        value={filters.from}
        onChange={(v) => setFilter('from', v)}
        clearable
        size="sm"
        w={150}
      />
      <AppDatePicker
        placeholder={labels.to}
        value={filters.to}
        onChange={(v) => setFilter('to', v)}
        clearable
        size="sm"
        w={150}
      />
    </Group>
  );
}

interface ExamsViewProps {
  onSubmit: () => Promise<void>;
  onConfirmDelete: () => Promise<void>;
  access: ExamsAccess;
}

export function ExamsView({ onSubmit, onConfirmDelete, access }: ExamsViewProps) {
  const data = useExamsMirror('data');
  const total = useExamsMirror('total');
  const page = useExamsMirror('page');
  const limit = useExamsMirror('limit');
  const totalPages = useExamsMirror('totalPages');
  const isLoading = useExamsMirror('isLoading');
  const setPage = useExamsMirror('setPage');
  const setSearch = useExamsMirror('setSearch');
  const openCreate = useExamsMirror('openCreate');
  const openEdit = useExamsMirror('openEdit');
  const openDelete = useExamsMirror('openDelete');
  const columns = useMemo(() => getExamsColumns(openEdit, openDelete, access), [openEdit, openDelete, access]);

  return (
    <AppModule exportTitle="المذاكرات">
      <ExamsOverview />

      <AppModule.Table>
        <DataModuleController
          selectable
          title={labels.title}
          description={labels.description}
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          emptyMessage={labels.emptyMessage}
          emptyDescription={labels.emptyDescription}
          searchPlaceholder={labels.searchPlaceholder}
          keyExtractor={(item: Exam) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.Header>
            <DataModuleController.Title icon={<IconClipboardList size={20} />} badgeLabel="مذاكرة" />
            <DataModuleController.Actions>
              {access.canManage && (
                <AppButton leftSection={<IconPlus size={16} />} onClick={openCreate}>
                  {labels.create}
                </AppButton>
              )}
            </DataModuleController.Actions>
          </DataModuleController.Header>
          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder={labels.searchPlaceholder} />
            <DataModuleController.FilterSlot>
              <ExamsFilters />
            </DataModuleController.FilterSlot>
          </DataModuleController.FilterBar>
          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>
          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>

      <ExamDrawer onSubmit={onSubmit} />
      <DeleteExamModal onConfirm={onConfirmDelete} />
    </AppModule>
  );
}
