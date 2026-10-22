'use client';

import {
  Alert,
  Badge,
  Card,
  Group,
  Radio,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconPhone, IconUser, IconUsers } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers/input';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { Family } from '@/src/core/api';

export interface Step1FamilyProps {
  families: Family[];
  isLoadingFamilies?: boolean;
}

export function Step1Family({ families, isLoadingFamilies }: Step1FamilyProps) {
  const familyMode = useStudentRegistrationMirror('familyMode');
  const setFamilyMode = useStudentRegistrationMirror('setFamilyMode');
  const selectedFamily = useStudentRegistrationMirror('selectedFamily');
  const setSelectedFamily = useStudentRegistrationMirror('setSelectedFamily');
  const familySearchQuery = useStudentRegistrationMirror('familySearchQuery');
  const setFamilySearchQuery = useStudentRegistrationMirror('setFamilySearchQuery');
  const newFamily = useStudentRegistrationMirror('newFamily');
  const setNewFamilyField = useStudentRegistrationMirror('setNewFamilyField');
  const stepErrors = useStudentRegistrationMirror('stepErrors');

  const error = stepErrors[0];

  const filteredFamilies = families.filter((f) => {
    if (!familySearchQuery.trim()) return true;
    const q = familySearchQuery.toLowerCase();
    return (
      f.familyName?.toLowerCase().includes(q) ||
      f.fatherName?.toLowerCase().includes(q) ||
      f.phone?.includes(q)
    );
  });

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center" wrap="wrap">
        <Stack gap={2}>
          <Text size="md" fw={700}>
            الخطوة الأولى: تحديد عائلة الطالب
          </Text>
          <Text size="xs" c="dimmed">
            يمكنك ربط الطالب بعائلة موجودة مسبقا في المعهد أو تسجيل عائلة جديدة
          </Text>
        </Stack>

        <SegmentedControl
          radius="md"
          size="xs"
          value={familyMode}
          onChange={(val) => setFamilyMode(val as 'search' | 'create')}
          data={[
            { label: 'البحث عن عائلة سابقة', value: 'search' },
            { label: 'تسجيل عائلة جديدة', value: 'create' },
          ]}
        />
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="md" variant="light">
          {error}
        </Alert>
      )}

      {familyMode === 'search' ? (
        <Stack gap="md">
          <AppInput
            type="search"
            placeholder="بحث بالكنية، اسم الأب، أو رقم الهاتف..."
            value={familySearchQuery}
            onChange={(e) =>
              setFamilySearchQuery(typeof e === 'string' ? e : e?.target?.value ?? '')
            }
          />

          {isLoadingFamilies ? (
            <Text size="xs" c="dimmed" ta="center" py="md">
              جاري تحميل سجلات العائلات...
            </Text>
          ) : filteredFamilies.length === 0 ? (
            <Card radius="lg" withBorder p="md" ta="center">
              <Text size="sm" c="dimmed">
                لا توجد عائلات مطابقة للبحث. يمكنك التبديل لخيار "تسجيل عائلة جديدة" أعلاه.
              </Text>
            </Card>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {filteredFamilies.map((fam) => {
                const isSelected = selectedFamily?.id === fam.id;
                return (
                  <Card
                    key={fam.id}
                    radius="lg"
                    withBorder
                    p="sm"
                    onClick={() => setSelectedFamily(fam)}
                    style={{
                      cursor: 'pointer',
                      borderColor: isSelected
                        ? 'var(--mantine-color-primary-6)'
                        : 'var(--mantine-color-gray-2)',
                      backgroundColor: isSelected
                        ? 'var(--mantine-color-primary-0)'
                        : 'var(--mantine-color-body)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <ThemeIcon
                          size={36}
                          radius="xl"
                          color={isSelected ? 'primary' : 'gray'}
                          variant="light"
                        >
                          <IconUsers size={18} />
                        </ThemeIcon>
                        <Stack gap={2}>
                          <Text size="sm" fw={700}>
                            عائلة {fam.familyName}
                          </Text>
                          <Group gap="xs">
                            {fam.fatherName && (
                              <Text size="xs" c="dimmed">
                                الأب: {fam.fatherName}
                              </Text>
                            )}
                            {fam.motherName && (
                              <Text size="xs" c="dimmed">
                                الأم: {fam.motherName}
                              </Text>
                            )}
                          </Group>
                          {fam.phone && (
                            <Group gap={4} dir="ltr">
                              <IconPhone size={12} color="var(--mantine-color-dimmed)" />
                              <Text size="xs" c="dimmed">
                                {fam.phone}
                              </Text>
                            </Group>
                          )}
                        </Stack>
                      </Group>

                      <Radio
                        checked={isSelected}
                        onChange={() => setSelectedFamily(fam)}
                        aria-label={`اختيار عائلة ${fam.familyName}`}
                      />
                    </Group>
                  </Card>
                );
              })}
            </SimpleGrid>
          )}
        </Stack>
      ) : (
        <Stack gap="lg">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <AppInput
              label="كنية العائلة"
              placeholder="مثال: العمر، الخالد..."
              value={newFamily.familyName}
              onChange={(e) =>
                setNewFamilyField('familyName', typeof e === 'string' ? e : e?.target?.value ?? '')
              }
              required
            />
            <AppInput
              type="tel"
              label="رقم هاتف التواصل"
              placeholder="09xxxxxxxx"
              value={newFamily.phone}
              onChange={(e) =>
                setNewFamilyField('phone', typeof e === 'string' ? e : e?.target?.value ?? '')
              }
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            <AppInput
              label="اسم الأب"
              placeholder="الاسم الأول للأب"
              value={newFamily.fatherName}
              onChange={(e) =>
                setNewFamilyField('fatherName', typeof e === 'string' ? e : e?.target?.value ?? '')
              }
            />
            <AppInput
              label="اسم الأم"
              placeholder="الاسم الأول للأم"
              value={newFamily.motherName}
              onChange={(e) =>
                setNewFamilyField('motherName', typeof e === 'string' ? e : e?.target?.value ?? '')
              }
            />
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  );
}
