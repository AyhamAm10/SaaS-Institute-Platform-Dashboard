'use client';

import { Anchor, Box, Breadcrumbs, Stack, Text, Title } from '@mantine/core';
import {
  IconBriefcase,
  IconCalendarTime,
  IconCheck,
  IconUser,
} from '@tabler/icons-react';
import Link from 'next/link';
import { AppStepper } from '@/src/components/controllers/stepper';
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
        {/* Header Breadcrumbs & Title */}
        <Stack gap={2}>
          <Breadcrumbs separator="←" style={{ fontSize: '12px' }}>
            <Anchor component={Link} href="/teachers" c="dimmed">
              الكادر التدريسي
            </Anchor>
            <Text size="xs" c="primary" fw={600}>
              إضافة معلم جديد
            </Text>
          </Breadcrumbs>
          <Title order={2} fz={{ base: 17, sm: 20 }} fw={700}>
            إضافة معلم جديد وتحديد المؤهلات والدوام
          </Title>
          <Text size="xs" c="dimmed">
            معالج التسجيل الشامل لربط المعلم بالمواد الرسمية وجدول الدوام الأسبوعي لتوليد الجداول
            تلقائياً
          </Text>
        </Stack>

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
