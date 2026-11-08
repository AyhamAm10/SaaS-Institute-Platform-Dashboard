'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { getApiErrorMessage, useInstituteProfileQuery, useUpdateInstituteProfileMutation } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createInstituteTabStore, InstituteTabContext, InstituteTabStore } from './store/institute-tab.store';
import { InstituteTabView } from './ui/InstituteTabView';

function QuerySync({ store }: { store: InstituteTabStore }) {
  const syncProfile = useStore(store, (s) => s.syncProfile);
  const { data: profile, isLoading } = useInstituteProfileQuery();

  useEffect(() => {
    syncProfile(profile ?? null, isLoading);
  }, [profile, isLoading, syncProfile]);

  return null;
}

export function InstituteTabController() {
  const [store] = useState(createInstituteTabStore);
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.settingsManage);
  const updateMutation = useUpdateInstituteProfileMutation();

  const handleSave = useCallback(async () => {
    const { form } = store.getState();
    store.getState().setGeneralError(null);
    store.getState().setGeneralSuccess(null);

    let hasError = false;
    if (!form.name.trim()) {
      store.getState().setFieldError('name', 'يرجى إدخال اسم المعهد');
      hasError = true;
    }
    if (!form.phone.trim()) {
      store.getState().setFieldError('phone', 'يرجى إدخال رقم هاتف المعهد');
      hasError = true;
    }
    if (!form.timezone) {
      store.getState().setFieldError('timezone', 'يرجى اختيار المنطقة الزمنية');
      hasError = true;
    }

    if (hasError) return;

    store.getState().setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        timezone: form.timezone,
      });
      store.getState().setGeneralSuccess('تم تحديث بيانات المعهد بنجاح');
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'حدث خطأ أثناء حفظ بيانات المعهد');
      store.getState().setGeneralError(msg);
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, updateMutation]);

  return (
    <InstituteTabContext.Provider value={store}>
      <QuerySync store={store} />
      <InstituteTabView onSave={handleSave} canManage={canManage} />
    </InstituteTabContext.Provider>
  );
}

