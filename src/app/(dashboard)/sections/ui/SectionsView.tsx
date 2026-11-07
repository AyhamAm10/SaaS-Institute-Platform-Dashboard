'use client';

import { AppModule } from '@/src/components/controllers';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { sectionsPageMetadata } from '../static-data/sections.data';
import { SectionsActions } from './SectionsActions';
import { SectionsFilters } from './SectionsFilters';
import { SectionsOverview } from './SectionsOverview';
import { SectionsDrawers } from './SectionsDrawers';
import { useSectionsColumns } from './SectionsTable';
import { useSectionsMirror } from '../store/useSectionsMirror';

interface SectionsViewProps {
  onFormSubmit: () => Promise<void>;
  onFeeSubmit: () => Promise<void>;
  onBranchCreate: () => Promise<void>;
  onBranchDelete: (id: number, name: string) => Promise<void>;
  onAssignSubject: (
    sectionId: number,
    subjectId: number,
    weeklyPeriods?: number,
    teacherId?: number | null,
  ) => Promise<void>;
  onRemoveSubject: (sectionId: number, subjectId: number) => Promise<void>;
  canManage?: boolean;
}

export function SectionsView({
  onFormSubmit,
  onFeeSubmit,
  onBranchCreate,
  onBranchDelete,
  onAssignSubject,
  onRemoveSubject,
  canManage = true,
}: SectionsViewProps) {
  const data = useSectionsMirror('data');
  const total = useSectionsMirror('total');
  const page = useSectionsMirror('page');
  const limit = useSectionsMirror('limit');
  const totalPages = useSectionsMirror('totalPages');
  const isLoading = useSectionsMirror('isLoading');
  const isFetching = useSectionsMirror('isFetching');
  const setPage = useSectionsMirror('setPage');
  const setSearch = useSectionsMirror('setSearch');

  const formModalOpened = useSectionsMirror('formModalOpened');
  const closeFormModal = useSectionsMirror('closeFormModal');
  const feeModalOpened = useSectionsMirror('feeModalOpened');
  const closeFeeModal = useSectionsMirror('closeFeeModal');
  const drawerOpened = useSectionsMirror('drawerOpened');
  const detailSectionId = useSectionsMirror('detailSectionId');
  const closeDrawer = useSectionsMirror('closeDrawer');
  const branchesModalOpened = useSectionsMirror('branchesModalOpened');
  const closeBranchesModal = useSectionsMirror('closeBranchesModal');
  const academicBranches = useSectionsMirror('academicBranches');
  const openEdit = useSectionsMirror('openEdit');
  const openFeeModal = useSectionsMirror('openFeeModal');
  const openDetails = useSectionsMirror('openDetails');

  const columns = useSectionsColumns(openEdit, openFeeModal, openDetails, { canManage });

  return (
    <AppModule exportTitle="الشعب">
      <SectionsOverview />

      <AppModule.Table>
        <DataModuleController
          selectable
          title={sectionsPageMetadata.title}
          description={sectionsPageMetadata.description}
          data={data}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          isFetching={isFetching}
          searchPlaceholder={sectionsPageMetadata.searchPlaceholder}
          emptyMessage={sectionsPageMetadata.emptyMessage}
          emptyDescription={sectionsPageMetadata.emptyDescription}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.Header>
            <DataModuleController.Title />
            <DataModuleController.Actions>
              <SectionsActions canManage={canManage} />
            </DataModuleController.Actions>
          </DataModuleController.Header>

          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput />
            <DataModuleController.FilterSlot>
              <SectionsFilters />
            </DataModuleController.FilterSlot>
            <DataModuleController.ResetButton />
          </DataModuleController.FilterBar>

          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>

          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>

      <SectionsDrawers
        canManage={canManage}
        formModalOpened={formModalOpened}
        closeFormModal={closeFormModal}
        onFormSubmit={onFormSubmit}
        feeModalOpened={feeModalOpened}
        closeFeeModal={closeFeeModal}
        onFeeSubmit={onFeeSubmit}
        drawerOpened={drawerOpened}
        closeDrawer={closeDrawer}
        detailSectionId={detailSectionId}
        onAssignSubject={onAssignSubject}
        onRemoveSubject={onRemoveSubject}
        branchesModalOpened={branchesModalOpened}
        closeBranchesModal={closeBranchesModal}
        academicBranches={academicBranches}
        onBranchCreate={onBranchCreate}
        onBranchDelete={onBranchDelete}
      />
    </AppModule>
  );
}
