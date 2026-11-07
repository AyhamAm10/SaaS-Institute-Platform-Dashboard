'use client';

import { Card, Divider, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconUser, IconUsers } from '@tabler/icons-react';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { Section, StudentField } from '@/src/core/api';

export interface Step4ReviewProps {
  sections: Section[];
  fields: StudentField[];
}

export function Step4Review({ sections, fields }: Step4ReviewProps) {
  const fullName = useStudentRegistrationMirror('fullName');
  const birthDate = useStudentRegistrationMirror('birthDate');
  const gender = useStudentRegistrationMirror('gender');
  const sectionId = useStudentRegistrationMirror('sectionId');
  const familyMode = useStudentRegistrationMirror('familyMode');
  const selectedFamily = useStudentRegistrationMirror('selectedFamily');
  const newFamily = useStudentRegistrationMirror('newFamily');
  const customFields = useStudentRegistrationMirror('customFields');

  const section = sections.find((s) => s.id === sectionId);

  const familyDisplay =
    familyMode === 'search' && selectedFamily
      ? {
          name: selectedFamily.familyName,
          father: selectedFamily.fatherName || '—',
          mother: selectedFamily.motherName || '—',
          phone: selectedFamily.phone || '—',
        }
      : {
          name: newFamily.familyName,
          father: newFamily.fatherName || '—',
          mother: newFamily.motherName || '—',
          phone: newFamily.phone || '—',
        };

  return (
    <Stack gap="lg">
      <Stack gap={2}>
        <Text size="md" fw={500}>
          الخطوة الثالثة: مراجعة وتأكيد بيانات التسجيل
        </Text>
        <Text size="xs" c="dimmed">
          يرجى مراجعة البيانات المدخلة بعناية قبل اعتماد تسجيل الطالب في النظام
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {/* Student Details Card */}
        <Card radius="lg" withBorder p="md">
          <Stack gap="sm">
            <Group gap="xs">
              <ThemeIcon size="md" radius="xl" color="primary" variant="light">
                <IconUser size={16} />
              </ThemeIcon>
              <Text size="sm" fw={500}>
                بيانات الطالب الأكاديمية
              </Text>
            </Group>

            <Divider />

            <SimpleGrid cols={2} spacing="xs">
              <Text size="xs" c="dimmed">الاسم الكامل:</Text>
              <Text size="xs" fw={500}>{fullName || '—'}</Text>

              <Text size="xs" c="dimmed">الجنس:</Text>
              <Text size="xs" fw={500}>{gender === 'MALE' ? 'ذكر' : 'أنثى'}</Text>

              <Text size="xs" c="dimmed">تاريخ الميلاد:</Text>
              <Text size="xs" fw={500}>{birthDate || '—'}</Text>

              <Text size="xs" c="dimmed">الشعبة الصفية:</Text>
              <Text size="xs" fw={500}>{section ? `${section.name} (${section.grade || ''})` : 'بدون تسكين مباشر'}</Text>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Family Details Card */}
        <Card radius="lg" withBorder p="md">
          <Stack gap="sm">
            <Group gap="xs">
              <ThemeIcon size="md" radius="xl" color="teal" variant="light">
                <IconUsers size={16} />
              </ThemeIcon>
              <Text size="sm" fw={500}>
                بيانات العائلة والاتصال
              </Text>
            </Group>

            <Divider />

            <SimpleGrid cols={2} spacing="xs">
              <Text size="xs" c="dimmed">كنية العائلة:</Text>
              <Text size="xs" fw={500}>{familyDisplay.name || '—'}</Text>

              <Text size="xs" c="dimmed">اسم الأب:</Text>
              <Text size="xs" fw={500}>{familyDisplay.father}</Text>

              <Text size="xs" c="dimmed">اسم الأم:</Text>
              <Text size="xs" fw={500}>{familyDisplay.mother}</Text>

              <Text size="xs" c="dimmed">هاتف التواصل:</Text>
              <Text size="xs" fw={500} dir="ltr" ta="right">{familyDisplay.phone}</Text>
            </SimpleGrid>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Custom Fields Summary Card */}
      {fields.length > 0 && (
        <Card radius="lg" withBorder p="md">
          <Stack gap="sm">
            <Text size="sm" fw={500}>
              البيانات الإضافية المخصصة
            </Text>
            <Divider />
            <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
              {fields.map((f) => {
                const val = customFields[f.name];
                return (
                  <Stack key={f.name} gap={2}>
                    <Text size="xs" c="dimmed">{f.label}:</Text>
                    <Text size="xs" fw={500}>
                      {val !== undefined && val !== null && val !== ''
                        ? typeof val === 'boolean'
                          ? val ? 'نعم' : 'لا'
                          : String(val)
                        : '—'}
                    </Text>
                  </Stack>
                );
              })}
            </SimpleGrid>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
