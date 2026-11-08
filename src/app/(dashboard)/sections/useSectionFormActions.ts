'use client';

import { useCallback } from 'react';
import {
  getApiErrorMessage as getErrorMessage,
  useCreateSectionMutation,
  useOperationalContext,
  useUpdateSectionFeeMutation,
  useUpdateSectionMutation,
} from '@/src/core/api';
import { SectionsStore } from './store/sections.store';

/** Section create / edit and fee mutations. Controller-level hook (role.md §3). */
export function useSectionFormActions(store: SectionsStore) {
  const { activeBranchId, activeAcademicYearId } = useOperationalContext();
  const createMutation = useCreateSectionMutation();
  const updateMutation = useUpdateSectionMutation();
  const updateFeeMutation = useUpdateSectionFeeMutation();

  // ── Form Submit Handler (Section Create / Edit) ──
  const handleFormSubmit = useCallback(async () => {
    const { sectionForm, selectedSection } = store.getState();
    store.getState().setSectionFormError(null);

    const name = sectionForm.name.trim();
    if (!name) {
      store.getState().setSectionFormError('يرجى إدخال اسم الشعبة');
      return;
    }
    if (!sectionForm.academicBranchId) {
      store.getState().setSectionFormError('يرجى اختيار الفرع الأكاديمي');
      return;
    }
    // A new section always belongs to the header year
    const targetYearId = activeAcademicYearId;
    if (!selectedSection && !targetYearId) {
      store.getState().setSectionFormError('يرجى اختيار السنة الدراسية');
      return;
    }
    const numFee = Number(sectionForm.feeAmount);
    if (isNaN(numFee) || numFee < 0) {
      store.getState().setSectionFormError('يرجى إدخال مبلغ رسوم صحيح (أكبر من أو يساوي 0)');
      return;
    }

    store.getState().setFormSubmitting(true);
    try {
      if (selectedSection) {
        await updateMutation.mutateAsync({
          id: selectedSection.id,
          payload: {
            name,
            academicBranchId: Number(sectionForm.academicBranchId),
            feeAmount: numFee,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name,
          academicBranchId: Number(sectionForm.academicBranchId),
          academicYearId: targetYearId ? Number(targetYearId) : undefined,
          branchId: activeBranchId ?? undefined,
          feeAmount: numFee,
        });
      }
      store.getState().closeFormModal();
      store.getState().resetSectionForm();
    } catch (err: unknown) {
      store.getState().setSectionFormError(getErrorMessage(err, 'حدث خطأ أثناء حفظ الشعبة'));
    } finally {
      store.getState().setFormSubmitting(false);
    }
  }, [store, createMutation, updateMutation, activeAcademicYearId, activeBranchId]);

  // ── Fee Submit Handler ──
  const handleFeeSubmit = useCallback(async () => {
    const { feeSection, feeFormAmount, feeFormCurrency } = store.getState();
    if (!feeSection) return;
    store.getState().setFeeError(null);

    const numFee = Number(feeFormAmount);
    if (isNaN(numFee) || numFee < 0) {
      store.getState().setFeeError('يرجى إدخال مبلغ رسوم صالح (أكبر من أو يساوي 0)');
      return;
    }

    store.getState().setFeeSubmitting(true);
    try {
      await updateFeeMutation.mutateAsync({
        id: feeSection.id,
        payload: { feeAmount: numFee, feeCurrency: feeFormCurrency },
      });
      store.getState().closeFeeModal();
    } catch (err: unknown) {
      store.getState().setFeeError(getErrorMessage(err, 'حدث خطأ أثناء تعديل الرسوم'));
    } finally {
      store.getState().setFeeSubmitting(false);
    }
  }, [store, updateFeeMutation]);

  return { handleFormSubmit, handleFeeSubmit };
}
