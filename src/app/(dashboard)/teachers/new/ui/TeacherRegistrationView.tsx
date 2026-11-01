'use client';

import { Box, Stack } from '@mantine/core';
import {
  IconBriefcase,
  IconCalendarTime,
  IconCheck,
  IconUser,
  IconArrowRight,
} from '@tabler/icons-react';
import { AppStepper } from '@/src/components/controllers/stepper';
import { AppButton, AppPageHeader } from '@/src/components/controllers';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Qualifications } from './Step2Qualifications';
import { Step3Availability } from './Step3Availability';
import { Step4Review } from './Step4Review';
import { AcademicBranch, Subject } from '@/src/core/api';

export interface TeacherRegistrationViewProps {
  academicBranches: AcademicBranch[];
  subjects: Subject[];
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  onStepClick: (step: number) => void;
}

export function TeacherRegistrationView({
  academicBranches,
  subjects,
  onPrev,
  onNext,
  onSubmit,
  onCancel,
  onStepClick,
}: TeacherRegistrationViewProps) {
  const activeStep = useTeacherRegistrationMirror('activeStep');
  const isSubmitting = useTeacherRegistrationMirror('isSubmitting');

  return (
    <Box w="100%">
      <Stack gap="md">
        {/* Page title + a way back; the sidebar already shows where we are. */}
        <AppPageHeader
          title="إضافة معلم جديد"
          description="المؤهلات والمواد المعتمدة وأوقات الدوام الأسبوعي"
          actions={
            <AppButton href="C:/Program Files/Git/teachers" variant="outline" leftSection={<IconArrowRight size={16} stroke={1.7} />}>
              العودة للكادر
            </AppButton>
          }
        />

        {/* Compound Stepper */}
        <AppStepper active={activeStep} onStepClick={onStepClick} allowStepSelect>
          <AppStepper.Step
            step={0}
            label="البيانات الأساسية"
            description="حساب المعلم ومعلومات الاتصال"
            icon={<IconUser size={18} />}
          >
            <AppStepper.Step.Header />
            <AppStepper.Step.Content>
              <Step1BasicInfo />
            </AppStepper.Step.Content>
          </AppStepper.Step>

          <AppStepper.Step
            step={1}
            label="المواد والمؤهلات"
            description="ربط المواد والفروع الدراسية"
            icon={<IconBriefcase size={18} />}
          >
            <AppStepper.Step.Header />
            <AppStepper.Step.Content>
              <Step2Qualifications
                academicBranches={academicBranches}
                subjects={subjects}
              />
            </AppStepper.Step.Content>
          </AppStepper.Step>

          <AppStepper.Step
            step={2}
            label="أوقات الدوام"
            description="تحديد فترات التفرغ الأسبوعي"
            icon={<IconCalendarTime size={18} />}
          >
            <AppStepper.Step.Header />
            <AppStepper.Step.Content>
              <Step3Availability />
            </AppStepper.Step.Content>
          </AppStepper.Step>

          <AppStepper.Step
            step={3}
            label="مراجعة وتأكيد"
            description="الاعتماد النهائي للبيانات"
            icon={<IconCheck size={18} />}
          >
            <AppStepper.Step.Header />
            <AppStepper.Step.Content>
              <Step4Review />
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
            submitLabel="حفظ واعتماد المعلم"
            cancelLabel="إلغاء والعودة"
          />
        </AppStepper>
      </Stack>
    </Box>
  );
}
