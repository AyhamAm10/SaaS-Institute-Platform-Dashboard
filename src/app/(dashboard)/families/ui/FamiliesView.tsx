'use client';

import { useMemo } from 'react';
import { IconHome, IconPlus, IconRefresh } from '@tabler/icons-react';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { AppButton, AppIconButton } from '@/src/components/controllers/button';
import { Family } from '@/src/core/api';
import { useFamiliesMirror } from '../store/useFamiliesMirror';
import { familiesLabels } from '../static-data/families.data';
import { getFamiliesColumns } from './FamiliesTable';
import { FamilyDrawer } from './FamilyDrawer';
import { FamilyDeleteModal } from './FamilyDeleteModal';

export interface FamiliesViewProps {
  onRefresh: () => void;
  onSubmit: () => Promise<void>;
  onConfirmDelete: (family: Family) => Promise<void>;
}

/**
 * FamiliesView
 *
 * Presentation container layout for the Families page.
 * The search endpoint returns up to 50 matches, shown as a single page.
 * ZERO useState hooks. Layout is 100% controlled by DataModuleController.
 */
export function FamiliesView({ onRefresh, onSubmit, onConfirmDelete }: FamiliesViewProps) {
  const data = useFamiliesMirror('data');
  const isLoading = useFamiliesMirror('isLoading');
  const isFetching = useFamiliesMirror('isFetching');
  const setSearch = useFamiliesMirror('setSearch');
  const openCreateDrawer = useFamiliesMirror('openCreateDrawer');
  const openEditDrawer = useFamiliesMirror('openEditDrawer');
  const openDeleteModal = useFamiliesMirror('openDeleteModal');

  const columns = useMemo(
    () => getFamiliesColumns(openEditDrawer, openDeleteModal),
    [openEditDrawer, openDeleteModal],
  );

  return (
    <>
      <DataModuleController
        title={familiesLabels.title}
        description={familiesLabels.searchLimitHint}
        data={data}
        columns={columns}
        total={data.length}
        page={1}
        limit={Math.max(data.length, 1)}
        totalPages={1}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={familiesLabels.emptyState}
        emptyDescription={familiesLabels.emptyStateDesc}
        searchPlaceholder={familiesLabels.searchPlaceholder}
        keyExtractor={(item: Family) => item.id}
        onPageChange={() => undefined}
        onSearchChange={setSearch}
      >
        <DataModuleController.Header>
          <DataModuleController.Title
            icon={<IconHome size={18} />}
            badgeLabel={familiesLabels.totalCountBadge}
          />
          <DataModuleController.Actions>
            <AppButton leftSection={<IconPlus size={16} />} onClick={openCreateDrawer}>
              {familiesLabels.createNewButton}
            </AppButton>
          </DataModuleController.Actions>
        </DataModuleController.Header>

        <DataModuleController.FilterBar>
          <DataModuleController.SearchInput placeholder={familiesLabels.searchPlaceholder} />
          <DataModuleController.FilterSlot>
            <AppIconButton
              variant="brand"
              label={familiesLabels.refreshButton}
              onClick={onRefresh}
              loading={isFetching}
            >
              <IconRefresh size={16} />
            </AppIconButton>
          </DataModuleController.FilterSlot>
        </DataModuleController.FilterBar>

        <DataModuleController.Content>
          <DataModuleController.Table />
        </DataModuleController.Content>

        <DataModuleController.Footer />
      </DataModuleController>

      <FamilyDrawer onSubmit={onSubmit} />
      <FamilyDeleteModal onConfirmDelete={onConfirmDelete} />
    </>
  );
}
