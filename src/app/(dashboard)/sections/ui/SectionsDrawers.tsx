'use client';

import { AcademicBranch } from '@/src/core/api';
import { SectionDrawer } from './SectionDrawer';
import { SectionFeeDrawer } from './SectionFeeDrawer';
import { SectionDetailsDrawer } from './SectionDetailsDrawer';
import { AcademicBranchesDrawer } from './AcademicBranchesDrawer';

interface SectionsDrawersProps {
  canManage: boolean;
  formModalOpened: boolean;
  closeFormModal: () => void;
  onFormSubmit: () => Promise<void>;
  feeModalOpened: boolean;
  closeFeeModal: () => void;
  onFeeSubmit: () => Promise<void>;
  drawerOpened: boolean;
  closeDrawer: () => void;
  detailSectionId: number | null;
  onAssignSubject: (
    sectionId: number,
    subjectId: number,
    weeklyPeriods?: number,
    teacherId?: number | null,
  ) => Promise<void>;
  onRemoveSubject: (sectionId: number, subjectId: number) => Promise<void>;
  branchesModalOpened: boolean;
  closeBranchesModal: () => void;
  academicBranches: AcademicBranch[];
  onBranchCreate: () => Promise<void>;
  onBranchDelete: (id: number, name: string) => Promise<void>;
}

export function SectionsDrawers({
  canManage,
  formModalOpened,
  closeFormModal,
  onFormSubmit,
  feeModalOpened,
  closeFeeModal,
  onFeeSubmit,
  drawerOpened,
  closeDrawer,
  detailSectionId,
  onAssignSubject,
  onRemoveSubject,
  branchesModalOpened,
  closeBranchesModal,
  academicBranches,
  onBranchCreate,
  onBranchDelete,
}: SectionsDrawersProps) {
  return (
    <>
      {canManage && (
        <SectionDrawer
          opened={formModalOpened}
          onClose={closeFormModal}
          onSubmit={onFormSubmit}
        />
      )}

      {canManage && (
        <SectionFeeDrawer
          opened={feeModalOpened}
          onClose={closeFeeModal}
          onSubmit={onFeeSubmit}
        />
      )}

      <SectionDetailsDrawer
        opened={drawerOpened}
        onClose={closeDrawer}
        sectionId={detailSectionId}
        onAssignSubject={canManage ? onAssignSubject : undefined}
        onRemoveSubject={canManage ? onRemoveSubject : undefined}
        canManage={canManage}
      />

      {canManage && (
        <AcademicBranchesDrawer
          opened={branchesModalOpened}
          onClose={closeBranchesModal}
          branches={academicBranches}
          onCreate={onBranchCreate}
          onDelete={onBranchDelete}
        />
      )}
    </>
  );
}

