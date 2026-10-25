'use client';

import { useMemo } from 'react';
import { Alert, Divider, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { Branch, Section, StudentField } from '@/src/core/api';

export interface Step2BasicInfoProps {
  sections: Section[];
  fields?: StudentField[];
}

export function Step2BasicInfo({ sections, fields = [] }: Step2BasicInfoProps) {
  const fullName = useStudentRegistrationMirror('fullName');
  const birthDate = useStudentRegistrationMirror('birthDate');
  const gender = useStudentRegistrationMirror('gender');
  const sectionId = useStudentRegistrationMirror('sectionId');
  const customFields = useStudentRegistrationMirror('customFields');
  const setStudentField = useStudentRegistrationMirror('setStudentField');
  const setCustomFieldValue = useStudentRegistrationMirror('setCustomFieldValue');
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
        <Text size="md" fw={700}>
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
        <Text size="sm" fw={700} c="primary.8">
          البيانات الأساسية والتسكين الأكاديمي
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <AppInput
            label="اسم الطالب الكامل"
            placeholder="مثال: أحمد محمد العمر"
            value={fullName}
            onChange={(e) =>
              setStudentField('fullName', typeof e === 'string' ? e : e?.target?.value ?? '')
            }
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
            onChange={(val: string | null) =>
              setStudentField('sectionId', val ? Number(val) : null)
            }
            searchable
            clearable
          />
        </SimpleGrid>

        {fields.length > 0 && (
          <Stack gap="lg" mt="xs">
            <Divider my="md" label="الحقول والبيانات الإضافية الخاصة بالمعهد" labelPosition="center" />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {fields.map((field) => {
                const currentValue = customFields[field.name] ?? '';

                if (field.type === 'SELECT') {
                  const selectOptions = (field.options || []).map((opt) => ({
                    value: opt,
                    label: opt,
                  }));
                  return (
                    <AppSelect
                      key={field.name}
                      label={field.label}
                      placeholder={`اختر ${field.label}`}
                      data={selectOptions}
                      value={currentValue ? String(currentValue) : null}
                      onChange={(val: string | null) => setCustomFieldValue(field.name, val)}
                      required={field.isRequired}
                      clearable
                    />
                  );
                }

                if (field.type === 'DATE') {
                  return (
                    <AppDatePicker
                      key={field.name}
                      label={field.label}
                      placeholder={`اختر ${field.label}`}
                      value={currentValue}
                      onChange={(val: string | null) => setCustomFieldValue(field.name, val)}
                      required={field.isRequired}
                    />
                  );
                }

                if (field.type === 'BOOLEAN') {
                  return (
                    <AppSelect
                      key={field.name}
                      label={field.label}
                      data={[
                        { value: 'true', label: 'نعم' },
                        { value: 'false', label: 'لا' },
                      ]}
                      value={currentValue === true ? 'true' : currentValue === false ? 'false' : null}
                      onChange={(val: string | null) =>
                        setCustomFieldValue(field.name, val === 'true' ? true : val === 'false' ? false : null)
                      }
                      placeholder={`اختر ${field.label}`}
                      required={field.isRequired}
                      clearable
                    />
                  );
                }

                if (field.type === 'NUMBER') {
                  return (
                    <AppInput
                      key={field.name}
                      type="number"
                      label={field.label}
                      placeholder={`أدخل ${field.label}`}
                      value={currentValue}
                      onChange={(e) =>
                        setCustomFieldValue(
                          field.name,
                          typeof e === 'string' ? (e === '' ? null : Number(e)) : e?.target?.value === '' ? null : Number(e?.target?.value),
                        )
                      }
                      required={field.isRequired}
                    />
                  );
                }

                return (
                  <AppInput
                    key={field.name}
                    label={field.label}
                    placeholder={`أدخل ${field.label}`}
                    value={currentValue}
                    onChange={(e) =>
                      setCustomFieldValue(
                        field.name,
                        typeof e === 'string' ? e : e?.target?.value ?? '',
                      )
                    }
                    required={field.isRequired}
                  />
                );
              })}
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
