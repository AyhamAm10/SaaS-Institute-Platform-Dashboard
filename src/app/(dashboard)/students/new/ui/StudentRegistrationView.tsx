'use client';

import { Box, Stack, Title, Text, Breadcrumbs, Anchor } from '@mantine/core';
import { IconCheck, IconSchool, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';
import { AppStepper } from '@/src/components/controllers/stepper';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { Step1Family } from './Step1Family';
import { Step2BasicInfo } from './Step2BasicInfo';
import { Step4Review } from './Step4Review';
import { Family, Section, StudentField } from '@/src/core/api';

export interface StudentRegistrationViewProps {
  sections: Section[];
  families: Family[];
  fields: StudentField[];
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
        {/* Header Breadcrumbs & Title */}
        <Stack gap={2}>
          <Breadcrumbs separator="←" style={{ fontSize: '12px' }}>
            <Anchor component={Link} href="/students" c="dimmed">
              الطلاب
            </Anchor>
            <Text size="xs" c="primary" fw={600}>
              تسجيل طالب جديد
            </Text>
          </Breadcrumbs>
          <Title order={2} fz={{ base: 17, sm: 20 }} fw={700}>
            تسجيل طالب جديد بالمعهد
          </Title>
          <Text size="xs" c="dimmed">
            معالج التسجيل الموحد لربط العائلة والبيانات الأكاديمية والشخصية
          </Text>
        </Stack>

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
              <Step2BasicInfo sections={sections} fields={fields} />
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
