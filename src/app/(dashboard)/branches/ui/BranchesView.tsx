'use client';

import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Branch } from '@/src/core/api';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { useBranchesMirror } from '../store/useBranchesMirror';
import { branchesLabels } from '../static-data/branches.data';
import { getBranchesColumns } from './BranchesTable';
import { BranchDrawer } from './BranchDrawer';

export interface BranchesViewProps {
  onSubmit: () => Promise<void>;
}

export function BranchesView({ onSubmit }: BranchesViewProps) {
  const branches = useBranchesMirror('branches');
  const isLoading = useBranchesMirror('isLoading');
  const search = useBranchesMirror('search');
  const setSearch = useBranchesMirror('setSearch');
  const openCreateDrawer = useBranchesMirror('openCreateDrawer');
  const openEditDrawer = useBranchesMirror('openEditDrawer');

  const filteredBranches = useMemo(() => {
    if (!search.trim()) return branches;
    const q = search.trim().toLowerCase();
    return branches.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.code?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q) ||
        b.phone?.includes(q),
    );
  }, [branches, search]);

  const columns = useMemo(() => getBranchesColumns(openEditDrawer), [openEditDrawer]);

  return (
    <>
      <DataModuleController
        title={branchesLabels.title}
        description={branchesLabels.description}
        data={filteredBranches}
        columns={columns}
        total={filteredBranches.length}
        page={1}
        limit={50}
        totalPages={1}
        isLoading={isLoading}
        emptyMessage={branchesLabels.emptyMessage}
        emptyDescription={branchesLabels.emptyDescription}
        searchPlaceholder={branchesLabels.searchPlaceholder}
        keyExtractor={(item: Branch) => item.id}
        onSearchChange={setSearch}
      >
        <DataModuleController.Header>
          <DataModuleController.Title />
          <DataModuleController.Actions>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={openCreateDrawer}
              color="teal"
              radius="md"
            >
              {branchesLabels.createAction}
            </Button>
          </DataModuleController.Actions>
        </DataModuleController.Header>

        <DataModuleController.FilterBar>
          <DataModuleController.SearchInput placeholder={branchesLabels.searchPlaceholder} />
        </DataModuleController.FilterBar>

        <DataModuleController.Content>
          <DataModuleController.Table />
        </DataModuleController.Content>

        <DataModuleController.Footer />
      </DataModuleController>

      <BranchDrawer onSubmit={onSubmit} />
    </>
  );
}
