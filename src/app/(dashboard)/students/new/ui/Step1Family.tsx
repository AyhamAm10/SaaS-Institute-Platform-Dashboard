'use client';

import { Alert, Group, Radio, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconPhone, IconSearch, IconUserPlus, IconUsers } from '@tabler/icons-react';
import { AppEmptyState, AppSurface, AppTabs, IconTile } from '@/src/components/controllers';
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
      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Stack gap={4}>
          <Text size="md" fw={500}>
            تحديد عائلة الطالب
          </Text>
          <Text size="xs" fw={300} c="var(--app-text-muted)">
            اربط الطالب بعائلة موجودة مسبقا أو سجل عائلة جديدة
          </Text>
        </Stack>

        <AppTabs
          value={familyMode}
          onChange={(val) => setFamilyMode(val as 'search' | 'create')}
          items={[
            { value: 'search', label: 'عائلة مسجلة', icon: <IconSearch size={15} stroke={1.7} />, count: families.length },
            { value: 'create', label: 'عائلة جديدة', icon: <IconUserPlus size={15} stroke={1.7} /> },
          ]}
        >
          <AppTabs.List />
        </AppTabs>
      </Group>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="danger" radius="lg" variant="light">
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
            <Text size="xs" c="var(--app-text-muted)" ta="center" py="md">
              جاري تحميل سجلات العائلات...
            </Text>
          ) : filteredFamilies.length === 0 ? (
            <AppEmptyState
              compact
              icon={<IconUsers size={22} stroke={1.5} />}
              title="لا توجد عائلات مطابقة"
              description='جرب كلمة بحث أخرى، أو انتقل إلى "عائلة جديدة" لتسجيلها.'
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              {filteredFamilies.map((fam) => {
                const isSelected = selectedFamily?.id === fam.id;
                return (
                  <AppSurface
                    key={fam.id}
                    level={isSelected ? 3 : 1}
                    radius="lg"
                    padding="md"
                    interactive
                    onClick={() => setSelectedFamily(fam)}
                    style={{
                      boxShadow: isSelected
                        ? 'var(--app-card-shadow), 0 0 0 2px var(--app-brand-accent)'
                        : undefined,
                    }}
                  >
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <Group gap="sm" wrap="nowrap">
                        <IconTile tone={isSelected ? 'brand' : 'neutral'} size={40}>
                          {isSelected ? <IconCheck size={18} stroke={2.2} /> : <IconUsers size={18} stroke={1.7} />}
                        </IconTile>
                        <Stack gap={3}>
                          <Text size="sm" fw={500}>
                            عائلة {fam.familyName}
                          </Text>
                          <Group gap="xs">
                            {fam.fatherName && (
                              <Text size="xs" c="var(--app-text-muted)">
                                الأب: {fam.fatherName}
                              </Text>
                            )}
                            {fam.motherName && (
                              <Text size="xs" c="var(--app-text-muted)">
                                الأم: {fam.motherName}
                              </Text>
                            )}
                          </Group>
                          {fam.phone && (
                            <Group gap={4} dir="ltr" c="var(--app-text-muted)">
                              <IconPhone size={12} />
                              <Text size="xs" c="inherit">
                                {fam.phone}
                              </Text>
                            </Group>
                          )}
                        </Stack>
                      </Group>

                      <Radio
                        color="brand"
                        checked={isSelected}
                        onChange={() => setSelectedFamily(fam)}
                        aria-label={`اختيار عائلة ${fam.familyName}`}
                      />
                    </Group>
                  </AppSurface>
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
