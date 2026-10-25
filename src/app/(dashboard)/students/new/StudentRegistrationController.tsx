'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useSectionsQuery,
  useFamiliesSearchQuery,
  useStudentFieldsQuery,
  useCreateStudentMutation,
  CreateStudentPayload,
} from '@/src/core/api';
import { useOperationalContext } from '@/src/core/context';
import {
  createStudentRegistrationStore,
  StudentRegistrationContext,
} from './store/student-registration.store';
import { StudentRegistrationView } from './ui/StudentRegistrationView';

export function StudentRegistrationController() {
  const router = useRouter();
  const [store] = useState(() => createStudentRegistrationStore());
  const { activeBranchId } = useOperationalContext();

  useEffect(() => {
    if (activeBranchId) {
      store.getState().setStudentField('branchId', activeBranchId);
    }
  }, [store, activeBranchId]);

  const { data: sectionsData } = useSectionsQuery({
    limit: 100,
    branchId: activeBranchId || undefined,
  });
  const { data: families = [], isLoading: isLoadingFamilies } = useFamiliesSearchQuery();
  const { data: fields = [] } = useStudentFieldsQuery(false);

  const createStudentMutation = useCreateStudentMutation();

  const handlePrev = useCallback(() => {
    const current = store.getState().activeStep;
    if (current > 0) {
      store.getState().setActiveStep(current - 1);
    }
  }, [store]);

  const handleNext = useCallback(() => {
    const isValid = store.getState().validateCurrentStep(fields);
    if (isValid) {
      const current = store.getState().activeStep;
      if (current < 2) {
        store.getState().setActiveStep(current + 1);
      }
    }
  }, [store, fields]);

  const handleStepClick = useCallback(
    (targetStep: number) => {
      const current = store.getState().activeStep;
      if (targetStep < current) {
        store.getState().setActiveStep(targetStep);
      } else if (targetStep > current) {
        const isValid = store.getState().validateCurrentStep(fields);
        if (isValid) {
          store.getState().setActiveStep(targetStep);
        }
      }
    },
    [store, fields],
  );

  const handleCancel = useCallback(() => {
    router.push('/students');
  }, [router]);

  const handleSubmit = useCallback(async () => {
    const isValid = store.getState().validateCurrentStep(fields);
    if (!isValid) return;

    const state = store.getState();
    state.setSubmitting(true);

    try {
      const payload: CreateStudentPayload = {
        fullName: state.fullName.trim(),
        birthDate: state.birthDate,
        gender: state.gender,
        branchId: activeBranchId || undefined,
        sectionId: state.sectionId || undefined,
        customFields: state.customFields,
      };

      if (state.familyMode === 'search' && state.selectedFamily) {
        payload.familyId = state.selectedFamily.id;
      } else if (state.familyMode === 'create' && state.newFamily.familyName.trim()) {
        payload.newFamily = {
          familyName: state.newFamily.familyName.trim(),
          fatherName: state.newFamily.fatherName.trim() || undefined,
          motherName: state.newFamily.motherName.trim() || undefined,
          phone: state.newFamily.phone.trim() || undefined,
        };
      }

      await createStudentMutation.mutateAsync(payload);
      router.push('/students');
    } catch {
      state.setStepError(2, 'حدث خطأ أثناء حفظ بيانات الطالب. يرجى المحاولة مرة أخرى.');
    } finally {
      state.setSubmitting(false);
    }
  }, [store, activeBranchId, fields, createStudentMutation, router]);

  return (
    <StudentRegistrationContext.Provider value={store}>
      <StudentRegistrationView
        sections={sectionsData?.data || []}
        families={families}
        fields={fields}
        isLoadingFamilies={isLoadingFamilies}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onStepClick={handleStepClick}
      />
    </StudentRegistrationContext.Provider>
  );
}
