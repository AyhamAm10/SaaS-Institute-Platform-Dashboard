'use client';

import { useMemo } from 'react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconBook, IconPlus, IconRefresh } from '@tabler/icons-react';
import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { Subject } from '@/src/core/api';
import { useSubjectsMirror } from '../store/useSubjectsMirror';
import { subjectsLabels } from '../static-data/subjects.data';
import { getSubjectsColumns } from './SubjectsTable';
import { SubjectDrawer } from './SubjectDrawer';
import { SubjectDeleteModal } from './SubjectDeleteModal';

export interface SubjectsViewProps {
  onRefresh?: () => void;
  onSubmit: () => Promise<void>;
  onConfirmDelete: (subject: Subject) => Promise<void>;
  canManage?: boolean;
}

export function SubjectsView({
  onRefresh,
  onSubmit,
  onConfirmDelete,
  canManage = true,
}: SubjectsViewProps) {
  const data = useSubjectsMirror('data');
  const isLoading = useSubjectsMirror('isLoading');
  const isFetching = useSubjectsMirror('isFetching');
  const page = useSubjectsMirror('page');
  const totalPages = useSubjectsMirror('totalPages');
  const total = useSubjectsMirror('total');
  const limit = useSubjectsMirror('limit');
  const setPage = useSubjectsMirror('setPage');
  const setSearch = useSubjectsMirror('setSearch');
  const openCreateDrawer = useSubjectsMirror('openCreateDrawer');
  const openEditDrawer = useSubjectsMirror('openEditDrawer');
  const openDeleteModal = useSubjectsMirror('openDeleteModal');

  const columns = useMemo(
    () => getSubjectsColumns(openEditDrawer, openDeleteModal, { canManage }),
    [openEditDrawer, openDeleteModal, canManage],
  );

  return (
    <AppModule exportTitle="المواد الدراسية">
      <AppModule.Table>
        <DataModuleController
          selectable
          title={subjectsLabels.title}
          description={subjectsLabels.subtitle}
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          isFetching={isFetching}
          emptyMessage={subjectsLabels.emptyState}
          emptyDescription={subjectsLabels.emptyStateDesc}
          searchPlaceholder={subjectsLabels.searchPlaceholder}
          keyExtractor={(item: Subject) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.Header>
            <DataModuleController.Title
              icon={<IconBook size={18} />}
              badgeLabel={subjectsLabels.totalCountBadge}
            />
            {canManage && (
              <DataModuleController.Actions>
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={openCreateDrawer}
                  color="primary"
                  radius="md"
                >
                  {subjectsLabels.createNewButton}
                </Button>
              </DataModuleController.Actions>
            )}
          </DataModuleController.Header>

          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder={subjectsLabels.searchPlaceholder} />
            <DataModuleController.FilterSlot>
              {onRefresh && (
                <Tooltip label={subjectsLabels.refreshButton} withArrow>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="md"
                    radius="md"
                    onClick={onRefresh}
                    loading={isFetching}
                    aria-label={subjectsLabels.refreshButton}
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

      {canManage && (
        <>
          <SubjectDrawer onSubmit={onSubmit} />
          <SubjectDeleteModal onConfirmDelete={onConfirmDelete} />
        </>
      )}
    </AppModule>
  );
}
