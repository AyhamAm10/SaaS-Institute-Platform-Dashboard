'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import {
  useScheduleConfigQuery,
  useUpdateScheduleConfigMutation,
} from '@/src/core/api';
import {
  createScheduleSettingsStore,
  ScheduleSettingsContext,
} from './store/schedule-settings.store';
import { ScheduleSettingsView } from './ui/ScheduleSettingsView';

function QuerySync({
  store,
}: {
  store: ReturnType<typeof createScheduleSettingsStore>;
}) {
  const syncConfigData = useStore(store, (s) => s.syncConfigData);
  const { data: config, isLoading } = useScheduleConfigQuery();

  useEffect(() => {
    if (config) {
      syncConfigData({
        workingDays: config.workingDays || [0, 1, 2, 3, 4],
        dayStartTime: config.dayStartTime || '08:00',
        dayEndTime: config.dayEndTime || '14:00',
        periodDurationMinutes: config.periodDurationMinutes || 45,
        breaks: config.breaks || [],
        slots: config.slots || [],
        isLoading,
      });
    }
  }, [config, isLoading, syncConfigData]);

  return null;
}

export function ScheduleSettingsController() {
  const [store] = useState(() => createScheduleSettingsStore());
  const updateMutation = useUpdateScheduleConfigMutation();

  // Local controller states for the "add break" mini-inputs
  const [newBreakName, setNewBreakName] = useState('');
  const [newBreakStart, setNewBreakStart] = useState('');
  const [newBreakEnd, setNewBreakEnd] = useState('');

  const handleAddBreak = useCallback(() => {
    if (!newBreakName.trim() || !newBreakStart.trim() || !newBreakEnd.trim()) {
      return;
    }
    store.getState().addBreak({
      name: newBreakName.trim(),
      startTime: newBreakStart.trim(),
      endTime: newBreakEnd.trim(),
    });
    setNewBreakName('');
    setNewBreakStart('');
    setNewBreakEnd('');
  }, [store, newBreakName, newBreakStart, newBreakEnd]);

  const handleSave = useCallback(async () => {
    const { form } = store.getState();
    store.getState().setGeneralError(null);
    store.getState().setGeneralSuccess(null);

    // Basic client-side validation
    if (form.workingDays.length === 0) {
      store.getState().setFieldError('workingDays', 'يرجى تحديد يوم عمل واحد على الأقل');
      return;
    }

    if (!form.dayStartTime || !form.dayEndTime) {
      store.getState().setGeneralError('يرجى تحديد وقت بداية ونهاية الدوام اليومي');
      return;
    }

    store.getState().setIsSubmitting(true);
    try {
      const updated = await updateMutation.mutateAsync({
        workingDays: form.workingDays,
        dayStartTime: form.dayStartTime,
        dayEndTime: form.dayEndTime,
        periodDurationMinutes: Number(form.periodDurationMinutes),
        breaks: form.breaks,
      });

      store.getState().syncConfigData({
        workingDays: updated.workingDays,
        dayStartTime: updated.dayStartTime,
        dayEndTime: updated.dayEndTime,
        periodDurationMinutes: updated.periodDurationMinutes,
        breaks: updated.breaks,
        slots: updated.slots,
        isLoading: false,
      });

      store.getState().setGeneralSuccess('تم تحديث إعدادات الجدول والدوام واحتساب الحصص بنجاح');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء حفظ إعدادات الجدول';
      store.getState().setGeneralError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, updateMutation]);

  return (
    <ScheduleSettingsContext.Provider value={store}>
      <QuerySync store={store} />
      <ScheduleSettingsView
        onSave={handleSave}
        newBreakName={newBreakName}
        setNewBreakName={setNewBreakName}
        newBreakStart={newBreakStart}
        setNewBreakStart={setNewBreakStart}
        newBreakEnd={newBreakEnd}
        setNewBreakEnd={setNewBreakEnd}
        onAddBreak={handleAddBreak}
      />
    </ScheduleSettingsContext.Provider>
  );
}
