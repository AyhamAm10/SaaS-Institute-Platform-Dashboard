'use client';

import { Teacher } from '@/src/core/api';
import { TeacherFormDrawer } from './TeacherFormDrawer';
import { TeacherDetailsDrawer } from './TeacherDetailsDrawer';
import { TeacherDeleteModal } from './TeacherDeleteModal';
import { TeacherPasswordModal } from './TeacherPasswordModal';

export interface TeachersModalsProps {
  canManage: boolean;
  onSubmit: () => void;
  onConfirmDelete: (teacher: Teacher) => Promise<void>;
  onResetPassword: () => Promise<void>;
  onAssignQualification: (branchId: number, subjectId: number) => Promise<void>;
  onRemoveQualification: (assignmentId: number) => Promise<void>;
  onSaveAvailabilities: () => Promise<void>;
  newAvailDay: string;
  setNewAvailDay: (v: string) => void;
  newAvailStart: string;
  setNewAvailStart: (v: string) => void;
  newAvailEnd: string;
  setNewAvailEnd: (v: string) => void;
  onAddAvailabilityWindow: () => void;
}

export function TeachersModals({
  canManage,
  onSubmit,
  onConfirmDelete,
  onResetPassword,
  onAssignQualification,
  onRemoveQualification,
  onSaveAvailabilities,
  newAvailDay,
  setNewAvailDay,
  newAvailStart,
  setNewAvailStart,
  newAvailEnd,
  setNewAvailEnd,
  onAddAvailabilityWindow,
}: TeachersModalsProps) {
  return (
    <>
      {canManage && <TeacherFormDrawer onSubmit={onSubmit} />}
      <TeacherDetailsDrawer
        onAssignQualification={onAssignQualification}
        onRemoveQualification={onRemoveQualification}
        onSaveAvailabilities={onSaveAvailabilities}
        newAvailDay={newAvailDay}
        setNewAvailDay={setNewAvailDay}
        newAvailStart={newAvailStart}
        setNewAvailStart={setNewAvailStart}
        newAvailEnd={newAvailEnd}
        setNewAvailEnd={setNewAvailEnd}
        onAddAvailabilityWindow={onAddAvailabilityWindow}
      />
      {canManage && <TeacherDeleteModal onConfirmDelete={onConfirmDelete} />}
      {canManage && <TeacherPasswordModal onSubmit={onResetPassword} />}
    </>
  );
}
