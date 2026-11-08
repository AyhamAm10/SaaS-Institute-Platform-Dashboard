'use client';

import { useCallback } from 'react';
import {
  getApiErrorMessage,
  useCreateGuardianAccountMutation,
  useCreateStudentAccountMutation,
  useDeactivateMobileAccountMutation,
  useResetMobilePasswordMutation,
} from '@/src/core/api';
import { passwordError } from '@/src/core/auth';
import { MobileAccountsStore } from './store/mobile-accounts.store';

export function useMobileAccountsActions(store: MobileAccountsStore) {
  const createGuardianMutation = useCreateGuardianAccountMutation();
  const createStudentMutation = useCreateStudentAccountMutation();
  const resetPasswordMutation = useResetMobilePasswordMutation();
  const deactivateMutation = useDeactivateMobileAccountMutation();

  const handleDrawerSubmit = useCallback(async () => {
    const { drawerType: type, guardianForm, studentForm } = store.getState();
    store.getState().setDrawerError(null);

    if (type === 'FAMILY') {
      if (!guardianForm.familyId) return store.getState().setDrawerError('يرجى اختيار العائلة');
      if (!guardianForm.fullName.trim()) return store.getState().setDrawerError('يرجى إدخال اسم ولي الأمر');
      if (!guardianForm.phone.trim()) return store.getState().setDrawerError('يرجى إدخال رقم الهاتف');
      const pErr = passwordError(guardianForm.password);
      if (pErr) return store.getState().setDrawerError(pErr);

      store.getState().setIsSubmittingDrawer(true);
      try {
        await createGuardianMutation.mutateAsync({
          familyId: guardianForm.familyId,
          fullName: guardianForm.fullName.trim(),
          phone: guardianForm.phone.trim(),
          relationship: guardianForm.relationship,
          password: guardianForm.password,
        });
        store.getState().closeDrawer();
      } catch (err: unknown) {
        store.getState().setDrawerError(getApiErrorMessage(err, 'تعذّر إنشاء حساب ولي الأمر'));
      } finally {
        store.getState().setIsSubmittingDrawer(false);
      }
    } else {
      if (!studentForm.studentId) return store.getState().setDrawerError('يرجى اختيار الطالب');
      if (!studentForm.phone.trim()) return store.getState().setDrawerError('يرجى إدخال رقم الهاتف');
      const pErr = passwordError(studentForm.password);
      if (pErr) return store.getState().setDrawerError(pErr);

      store.getState().setIsSubmittingDrawer(true);
      try {
        await createStudentMutation.mutateAsync({
          studentId: studentForm.studentId,
          phone: studentForm.phone.trim(),
          password: studentForm.password,
        });
        store.getState().closeDrawer();
      } catch (err: unknown) {
        store.getState().setDrawerError(getApiErrorMessage(err, 'تعذّر إنشاء حساب الطالب'));
      } finally {
        store.getState().setIsSubmittingDrawer(false);
      }
    }
  }, [store, createGuardianMutation, createStudentMutation]);

  const handleResetPassword = useCallback(async () => {
    const { selectedAccount, newPassword } = store.getState();
    if (!selectedAccount) return;
    const pErr = passwordError(newPassword);
    if (pErr) return store.getState().setPasswordError(pErr);

    store.getState().setPasswordError(null);
    store.getState().setIsPasswordSubmitting(true);
    try {
      await resetPasswordMutation.mutateAsync({ userId: selectedAccount.id, password: newPassword });
      store.getState().closePasswordModal();
    } catch (err: unknown) {
      store.getState().setPasswordError(getApiErrorMessage(err, 'تعذّر تغيير كلمة المرور'));
    } finally {
      store.getState().setIsPasswordSubmitting(false);
    }
  }, [store, resetPasswordMutation]);

  const handleDeactivate = useCallback(async () => {
    const { deactivateTarget } = store.getState();
    if (!deactivateTarget) return;

    store.getState().setDeactivateError(null);
    store.getState().setIsDeactivating(true);
    try {
      await deactivateMutation.mutateAsync(deactivateTarget.id);
      store.getState().closeDeactivateModal();
    } catch (err: unknown) {
      store.getState().setDeactivateError(getApiErrorMessage(err, 'تعذّر تعطيل الحساب'));
    } finally {
      store.getState().setIsDeactivating(false);
    }
  }, [store, deactivateMutation]);

  return { handleDrawerSubmit, handleResetPassword, handleDeactivate };
}

