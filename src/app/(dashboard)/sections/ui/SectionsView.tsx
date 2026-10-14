'use client';

import { DataModuleController } from '@/src/components/controllers/data-module';
import { sectionsPageMetadata } from '../static-data/sections.data';
import { SectionDrawer } from './SectionDrawer';
import { SectionFeeDrawer } from './SectionFeeDrawer';
import { SectionDetailsDrawer } from './SectionDetailsDrawer';
import { AcademicBranchesDrawer } from './AcademicBranchesDrawer';
import { SectionsActions } from './SectionsActions';
import { SectionsFilters } from './SectionsFilters';
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
}

/**
 * SectionsView
 *
 * Pure presentation layout assembling the Sections page.
 * Reads ALL state via useMirror hooks — contains ZERO useState.
 */
export function SectionsView({
  onFormSubmit,
  onFeeSubmit,
  onBranchCreate,
  onBranchDelete,
  onAssignSubject,
  onRemoveSubject,
}: SectionsViewProps) {
  // ── Pagination & Query data via mirror ──
  const data = useSectionsMirror('data');
  const total = useSectionsMirror('total');
  const page = useSectionsMirror('page');
  const limit = useSectionsMirror('limit');
  const totalPages = useSectionsMirror('totalPages');
  const isLoading = useSectionsMirror('isLoading');
  const isFetching = useSectionsMirror('isFetching');
  const setPage = useSectionsMirror('setPage');
  const setSearch = useSectionsMirror('setSearch');

  // ── Form Drawer state via mirror ──
  const formModalOpened = useSectionsMirror('formModalOpened');
  const closeFormModal = useSectionsMirror('closeFormModal');

  // ── Fee Drawer state via mirror ──
  const feeModalOpened = useSectionsMirror('feeModalOpened');
  const closeFeeModal = useSectionsMirror('closeFeeModal');

  // ── Details Drawer state via mirror ──
  const drawerOpened = useSectionsMirror('drawerOpened');
  const detailSectionId = useSectionsMirror('detailSectionId');
  const closeDrawer = useSectionsMirror('closeDrawer');

  // ── Branches Drawer state via mirror ──
  const branchesModalOpened = useSectionsMirror('branchesModalOpened');
  const closeBranchesModal = useSectionsMirror('closeBranchesModal');
  const academicBranches = useSectionsMirror('academicBranches');

  // ── Actions for table ──
  const openEdit = useSectionsMirror('openEdit');
  const openFeeModal = useSectionsMirror('openFeeModal');
  const openDetails = useSectionsMirror('openDetails');

  // ── Column definitions ──
  const columns = useSectionsColumns(openEdit, openFeeModal, openDetails);

  return (
    <>
      <DataModuleController
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
            <SectionsActions />
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

      {/* Create / Edit Section Drawer */}
      <SectionDrawer
        opened={formModalOpened}
        onClose={closeFormModal}
        onSubmit={onFormSubmit}
      />

      {/* Update Section Fee Modal */}
      <SectionFeeDrawer
        opened={feeModalOpened}
        onClose={closeFeeModal}
        onSubmit={onFeeSubmit}
      />

      {/* View Section Details Drawer */}
      <SectionDetailsDrawer
        opened={drawerOpened}
        onClose={closeDrawer}
        sectionId={detailSectionId}
        onAssignSubject={onAssignSubject}
        onRemoveSubject={onRemoveSubject}
      />

      {/* Manage Academic Branches Drawer */}
      <AcademicBranchesDrawer
        opened={branchesModalOpened}
        onClose={closeBranchesModal}
        branches={academicBranches}
        onCreate={onBranchCreate}
        onDelete={onBranchDelete}
      />
    </>
  );
}
