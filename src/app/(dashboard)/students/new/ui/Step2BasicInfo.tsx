'use client';

import { useMemo } from 'react';
import { Alert, Card, Divider, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { Branch, Section, StudentField } from '@/src/core/api';

export interface Step2BasicInfoProps {
  branches: Branch[];
  sections: Section[];
  fields?: StudentField[];
}

export function Step2BasicInfo({ branches, sections, fields = [] }: Step2BasicInfoProps) {
  const fullName = useStudentRegistrationMirror('fullName');
  const birthDate = useStudentRegistrationMirror('birthDate');
  const gender = useStudentRegistrationMirror('gender');
  const branchId = useStudentRegistrationMirror('branchId');
  const sectionId = useStudentRegistrationMirror('sectionId');
  const customFields = useStudentRegistrationMirror('customFields');
  const setStudentField = useStudentRegistrationMirror('setStudentField');
  const setCustomFieldValue = useStudentRegistrationMirror('setCustomFieldValue');
  const stepErrors = useStudentRegistrationMirror('stepErrors');

  const error = stepErrors[1];

  const branchesOptions = useMemo(
    () => branches.map((b) => ({ value: String(b.id), label: b.name })),
    [branches],
  );

  const availableSections = useMemo(() => {
    if (!branchId) return sections;
    return sections.filter((s) => s.branchId === branchId);
  }, [sections, branchId]);

  const sectionsOptions = useMemo(
    () =>
      availableSections.map((s) => ({
        value: String(s.id),
        label: `${s.name} ${s.grade ? `(${s.grade})` : ''}`,
      })),
    [availableSections],
  );

  return (
    <Stack gap="lg">
      <Stack gap={2}>
        <Text size="md" fw={700}>
          الخطوة الثانية: بيانات الطالب الأساسية والإضافية
        </Text>
        <Text size="xs" c="dimmed">
          أدخل اسم الطالب وتاريخ ميلاده، وحدد الفرع والشعبة، وأكمل أي حقول مخصصة مطلوبة
        </Text>
      </Stack>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      <Card radius="lg" withBorder p="md">
        <Stack gap="md">
          <Text size="sm" fw={600} c="primary">
            البيانات الأساسية والتسكين الأكاديمي
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
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

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <AppDatePicker
              label="تاريخ الميلاد"
              placeholder="اختر تاريخ ميلاد الطالب"
              value={birthDate}
              onChange={(val: string | null) => setStudentField('birthDate', val)}
              required
            />

            <AppSelect
              label="الفرع الجغرافي المسجل به"
              placeholder="اختر فرع المعهد"
              data={branchesOptions}
              value={branchId ? String(branchId) : null}
              onChange={(val: string | null) => {
                setStudentField('branchId', val ? Number(val) : null);
                setStudentField('sectionId', null);
              }}
              required
              searchable
              clearable
            />
          </SimpleGrid>

          <AppSelect
            label="الشعبة الصفية (اختياري - للإدراج المباشر)"
            placeholder={
              branchId
                ? 'اختر الشعبة الدراسية لتسكين الطالب'
                : 'يرجى اختيار الفرع أولاً لتحديد الشُعب المتاحة'
            }
            data={sectionsOptions}
            value={sectionId ? String(sectionId) : null}
            onChange={(val: string | null) => setStudentField('sectionId', val ? Number(val) : null)}
            disabled={!branchId}
            searchable
            clearable
          />

          {fields.length > 0 && (
            <>
              <Divider my="xs" label="الحقول والبيانات الإضافية الخاصة بالمعهد" labelPosition="center" />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
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
                        value={currentValue !== '' ? String(currentValue) : null}
                        onChange={(val: string | null) => setCustomFieldValue(field.name, val === 'true')}
                        required={field.isRequired}
                        clearable
                      />
                    );
                  }

                  return (
                    <AppInput
                      key={field.name}
                      type={field.type === 'NUMBER' ? 'number' : 'text'}
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
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
