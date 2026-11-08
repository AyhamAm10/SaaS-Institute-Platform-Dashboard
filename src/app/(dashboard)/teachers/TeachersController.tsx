'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { teachersKeys } from '@/src/core/api';
import { useAuth, PERMISSIONS } from '@/src/core/auth';
import { createTeachersStore, TeachersContext } from './store/teachers.store';
import { TeachersView } from './ui/TeachersView';
import { QualificationOptionsSync, QuerySync } from './TeachersQuerySync';
import { useTeacherAccountActions } from './useTeacherAccountActions';
import { useTeacherProfileActions } from './useTeacherProfileActions';

export function TeachersController() {
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.academicManage);
  const [store] = useState(() => createTeachersStore());
  const queryClient = useQueryClient();
  const { handleSubmit, handleConfirmDelete, handleResetPassword } = useTeacherAccountActions(store);
  const { handleAssignQualification, handleRemoveQualification, handleSaveAvailabilities, ...availability } =
    useTeacherProfileActions(store);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: teachersKeys.all });
  }, [queryClient]);

  return (
    <TeachersContext.Provider value={store}>
      <QualificationOptionsSync store={store} />
      <QuerySync store={store} />
      <TeachersView
        access={{ canManage }}
        onRefresh={handleRefresh}
        onSubmit={handleSubmit}
        onConfirmDelete={handleConfirmDelete}
        onResetPassword={handleResetPassword}
        onAssignQualification={handleAssignQualification}
        onRemoveQualification={handleRemoveQualification}
        onSaveAvailabilities={handleSaveAvailabilities}
        {...availability}
      />
    </TeachersContext.Provider>
  );
}
