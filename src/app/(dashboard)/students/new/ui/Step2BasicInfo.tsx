'use client';

import { useMemo } from 'react';
import { Alert, Divider, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { Section, StudentField } from '@/src/core/api';
import type { StudentReferenceOptions } from '../../utils/student-references.utils';
import { StudentReferenceFields } from '../../ui/StudentReferenceFields';
import { inputText } from '@/src/core/format';
import { Step2CustomFields } from './Step2CustomFields';

export interface Step2BasicInfoProps {
  sections: Section[];
  fields?: StudentField[];
  referenceOptions: StudentReferenceOptions;
}

export function Step2BasicInfo({ sections, fields = [], referenceOptions }: Step2BasicInfoProps) {
  const fullName = useStudentRegistrationMirror('fullName');
  const birthDate = useStudentRegistrationMirror('birthDate');
  const gender = useStudentRegistrationMirror('gender');
  const sectionId = useStudentRegistrationMirror('sectionId');
  const setStudentField = useStudentRegistrationMirror('setStudentField');
  const references = useStudentRegistrationMirror('references');
  const setReference = useStudentRegistrationMirror('setReference');
  const stepErrors = useStudentRegistrationMirror('stepErrors');

  const error = stepErrors[1];

  const sectionsOptions = useMemo(
    () =>
      sections.map((s) => ({
        value: String(s.id),
        label: `${s.name} ${s.grade ? `(${s.grade})` : ''}`,
      })),
    [sections],
  );

  return (
    <Stack gap="xl">
      <Stack gap={3}>
        <Text size="md" fw={500}>
          الخطوة الثانية: بيانات الطالب الأساسية والإضافية
        </Text>
        <Text size="xs" c="dimmed">
          أدخل اسم الطالب وتاريخ ميلاده، وحدد الشعبة الدراسية (تُسجل تلقائياً في الفرع النشط للمعهد)
        </Text>
      </Stack>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      {/* Unboxed open form fields with generous spacing */}
      <Stack gap="lg">
        <Text size="sm" fw={500} c="primary.8">
          البيانات الأساسية والتسكين الأكاديمي
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <AppInput
            label="اسم الطالب الكامل"
            placeholder="مثال: أحمد محمد العمر"
            value={fullName}
            onChange={(e) => setStudentField('fullName', inputText(e))}
            required
          />

          <AppSelect
            label="الجنس"
            data={[
              { value: 'MALE', label: 'ذكر' },
              { value: 'FEMALE', label: 'أنثى' },
            ]}
            value={gender}
            onChange={(val: string | null) => setStudentField('gender', val || 'MALE')}
            required
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <AppDatePicker
            label="تاريخ الميلاد"
            placeholder="اختر تاريخ ميلاد الطالب"
            value={birthDate}
            onChange={(val: string | null) => setStudentField('birthDate', val)}
            required
          />

          <AppSelect
            label="الشعبة الصفية (اختياري - للإدراج المباشر)"
            placeholder="اختر الشعبة الدراسية لتسكين الطالب..."
            data={sectionsOptions}
            value={sectionId ? String(sectionId) : null}
            onChange={(val: string | null) => setStudentField('sectionId', val ? Number(val) : null)}
            searchable
            clearable
          />
        </SimpleGrid>

        <Divider my="xs" label="الحالة والسكن والنقل" labelPosition="center" />
        <StudentReferenceFields values={references} options={referenceOptions} onChange={setReference} />
        <Step2CustomFields fields={fields} />
      </Stack>
    </Stack>
  );
}
