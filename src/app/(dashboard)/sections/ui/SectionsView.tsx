'use client';

import { DataModuleController } from '@/src/components/controllers/data-module';
import { Section } from '@/src/core/api';
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
  onFormSubmit: (formData: {
    name: string;
    academicBranchId: number;
    branchId: number;
    academicYearId: number;
    feeAmount: number;
  }) => Promise<void>;
  onFeeSubmit: (feeAmount: number) => Promise<void>;
  onBranchCreate: () => Promise<void>;
  onBranchDelete: (id: number, name: string) => Promise<void>;
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
  const selectedSection = useSectionsMirror('selectedSection');
  const closeFormModal = useSectionsMirror('closeFormModal');
  const formSubmitting = useSectionsMirror('formSubmitting');
  const academicYears = useSectionsMirror('academicYears');
  const academicBranches = useSectionsMirror('academicBranches');

  // ── Fee Drawer state via mirror ──
  const feeModalOpened = useSectionsMirror('feeModalOpened');
  const feeSection = useSectionsMirror('feeSection');
  const closeFeeModal = useSectionsMirror('closeFeeModal');
  const feeSubmitting = useSectionsMirror('feeSubmitting');

  // ── Details Drawer state via mirror ──
  const drawerOpened = useSectionsMirror('drawerOpened');
  const detailSectionId = useSectionsMirror('detailSectionId');
  const closeDrawer = useSectionsMirror('closeDrawer');

  // ── Branches Drawer state via mirror ──
  const branchesModalOpened = useSectionsMirror('branchesModalOpened');
  const closeBranchesModal = useSectionsMirror('closeBranchesModal');

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
        section={selectedSection}
        academicYears={academicYears}
        academicBranches={academicBranches}
        onSubmit={onFormSubmit}
        isLoading={formSubmitting}
      />

      {/* Update Section Fee Drawer */}
      <SectionFeeDrawer
        opened={feeModalOpened}
        onClose={closeFeeModal}
        section={feeSection}
        onSubmit={onFeeSubmit}
        isLoading={feeSubmitting}
      />

      {/* View Section Details Drawer */}
      <SectionDetailsDrawer
        opened={drawerOpened}
        onClose={closeDrawer}
        sectionId={detailSectionId}
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
