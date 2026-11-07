'use client';

import { Box, Stack } from '@mantine/core';
import { IconArrowRight, IconCheck, IconSchool, IconUsers } from '@tabler/icons-react';
import { AppStepper } from '@/src/components/controllers/stepper';
import { AppButton, AppPageHeader } from '@/src/components/controllers';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { Step1Family } from './Step1Family';
import { Step2BasicInfo } from './Step2BasicInfo';
import { Step4Review } from './Step4Review';
import { Family, Section, StudentField } from '@/src/core/api';
import type { StudentReferenceOptions } from '../../utils/student-references.utils';

export interface StudentRegistrationViewProps {
  sections: Section[];
  families: Family[];
  fields: StudentField[];
  referenceOptions: StudentReferenceOptions;
  isLoadingFamilies?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onStepClick: (step: number) => void;
}

export function StudentRegistrationView({
  sections,
  families,
  fields,
  referenceOptions,
  isLoadingFamilies,
  onPrev,
  onNext,
  onSubmit,
  onCancel,
  onStepClick,
}: StudentRegistrationViewProps) {
  const activeStep = useStudentRegistrationMirror('activeStep');
  const isSubmitting = useStudentRegistrationMirror('isSubmitting');

  return (
    <Box w="100%">
      <Stack gap="md">
        {/* Page title + a way back; the sidebar already shows where we are. */}
        <AppPageHeader
          title="تسجيل طالب جديد"
          description="ربط الطالب بعائلته وإدخال بياناته الأكاديمية والشخصية"
          actions={
            <AppButton href="/students" variant="outline" leftSection={<IconArrowRight size={16} stroke={1.7} />}>
              العودة للطلاب
            </AppButton>
          }
        />

        {/* Compound Stepper */}
        <AppStepper active={activeStep} onStepClick={onStepClick} allowStepSelect>
          <AppStepper.Step
            step={0}
            label="بيانات العائلة"
            description="اختيار أو تسجيل عائلة"
            icon={<IconUsers size={18} />}
          >
            <AppStepper.Step.Header />
            <AppStepper.Step.Content>
              <Step1Family families={families} isLoadingFamilies={isLoadingFamilies} />
            </AppStepper.Step.Content>
          </AppStepper.Step>

          <AppStepper.Step
            step={1}
            label="بيانات الطالب"
            description="البيانات الأساسية والحقول الإضافية"
            icon={<IconSchool size={18} />}
          >
            <AppStepper.Step.Header />
            <AppStepper.Step.Content>
              <Step2BasicInfo
                sections={sections}
                fields={fields}
                referenceOptions={referenceOptions}
              />
            </AppStepper.Step.Content>
          </AppStepper.Step>

          <AppStepper.Step
            step={2}
            label="مراجعة وتأكيد"
            description="الاعتماد النهائي للتسجيل"
            icon={<IconCheck size={18} />}
          >
            <AppStepper.Step.Header />
            <AppStepper.Step.Content>
              <Step4Review sections={sections} fields={fields} />
            </AppStepper.Step.Content>
          </AppStepper.Step>

          <AppStepper.Actions
            onPrev={onPrev}
            onNext={onNext}
            onSubmit={onSubmit}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            prevLabel="السابق"
            nextLabel="متابعة للخطوة التالية"
            submitLabel="اعتماد وحفظ تسجيل الطالب"
            cancelLabel="إلغاء والعودة"
          />
        </AppStepper>
      </Stack>
    </Box>
  );
}
