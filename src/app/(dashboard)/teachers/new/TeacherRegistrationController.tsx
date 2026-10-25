'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreateTeacherPayload,
  useAcademicBranchesQuery,
  useCreateTeacherMutation,
  useSubjectsQuery,
} from '@/src/core/api';
import { useOperationalContext } from '@/src/core/context';
import {
  createTeacherRegistrationStore,
  TeacherRegistrationContext,
} from './store/teacher-registration.store';
import { TeacherRegistrationView } from './ui/TeacherRegistrationView';

export function TeacherRegistrationController() {
  const router = useRouter();
  const [store] = useState(() => createTeacherRegistrationStore());
  const { activeBranchId } = useOperationalContext();

  const { data: academicBranchesData } = useAcademicBranchesQuery();
  const { data: subjectsData } = useSubjectsQuery({ limit: 100 });

  const createTeacherMutation = useCreateTeacherMutation();

  const handlePrev = useCallback(() => {
    const current = store.getState().activeStep;
    if (current > 0) {
      store.getState().setActiveStep(current - 1);
    }
  }, [store]);

  const handleNext = useCallback(() => {
    const isValid = store.getState().validateCurrentStep();
    if (isValid) {
      const current = store.getState().activeStep;
      if (current < 3) {
        store.getState().setActiveStep(current + 1);
      }
    }
  }, [store]);

  const handleStepClick = useCallback(
    (targetStep: number) => {
      const current = store.getState().activeStep;
      if (targetStep < current) {
        store.getState().setActiveStep(targetStep);
      } else if (targetStep > current) {
        const isValid = store.getState().validateCurrentStep();
        if (isValid) {
          store.getState().setActiveStep(targetStep);
        }
      }
    },
    [store],
  );

  const handleCancel = useCallback(() => {
    router.push('/teachers');
  }, [router]);

  const handleSubmit = useCallback(async () => {
    const isValid = store.getState().validateCurrentStep();
    if (!isValid) return;

    const state = store.getState();
    state.setSubmitting(true);

    try {
      const payload: CreateTeacherPayload = {
        fullName: state.fullName.trim(),
        phone: state.phone.trim(),
        password: state.password.trim(),
        specialization: state.specialization.trim() || undefined,
        branchIds: activeBranchId ? [activeBranchId] : [],
        isActive: state.isActive,
        qualifications: state.qualifications.map((q) => ({
          academicBranchId: q.academicBranchId,
          subjectId: q.subjectId,
        })),
        availabilities: state.availabilities.map((a) => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
        })),
      };

      await createTeacherMutation.mutateAsync(payload);
      router.push('/teachers');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'حدث خطأ أثناء حفظ بيانات المعلم. يرجى المحاولة مرة أخرى.';
      state.setStepError(3, Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      state.setSubmitting(false);
    }
  }, [store, activeBranchId, createTeacherMutation, router]);

  return (
    <TeacherRegistrationContext.Provider value={store}>
      <TeacherRegistrationView
        academicBranches={academicBranchesData?.data || []}
        subjects={subjectsData?.data || []}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onStepClick={handleStepClick}
      />
    </TeacherRegistrationContext.Provider>
  );
}
