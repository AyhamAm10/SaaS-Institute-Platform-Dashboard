'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { getApiErrorMessage, useResetTeacherPasswordMutation, useTeachersQuery } from '@/src/core/api';
import { PERMISSIONS, passwordError, useAuth } from '@/src/core/auth';
import { createTeachersTabStore, TeachersTabContext, TeachersTabStore } from './store/teachers-tab.store';
import { TeachersTabView } from './ui/TeachersTabView';

function QuerySync({ store }: { store: TeachersTabStore }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncData = useStore(store, (s) => s.syncData);

  const { data, isLoading } = useTeachersQuery({
    page,
    limit,
    search: search.trim() || undefined,
  });

  useEffect(() => {
    syncData({
      data: data?.data ?? [],
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
      isLoading,
    });
  }, [data, isLoading, syncData]);

  return null;
}

export function TeachersTabController() {
  const [store] = useState(createTeachersTabStore);
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.academicManage);
  const resetPasswordMutation = useResetTeacherPasswordMutation();

  const handleResetPassword = useCallback(async () => {
    const { selectedTeacher, newPassword } = store.getState();
    if (!selectedTeacher) return;

    const pErr = passwordError(newPassword);
    if (pErr) {
      store.getState().setPasswordError(pErr);
      return;
    }

    store.getState().setPasswordError(null);
    store.getState().setIsPasswordSubmitting(true);
    try {
      await resetPasswordMutation.mutateAsync({
        id: selectedTeacher.id,
        password: newPassword,
      });
      store.getState().closePasswordModal();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'تعذّر تغيير كلمة المرور للمعلم');
      store.getState().setPasswordError(msg);
    } finally {
      store.getState().setIsPasswordSubmitting(false);
    }
  }, [store, resetPasswordMutation]);

  return (
    <TeachersTabContext.Provider value={store}>
      <QuerySync store={store} />
      <TeachersTabView onResetPassword={handleResetPassword} canManage={canManage} />
    </TeachersTabContext.Provider>
  );
}

