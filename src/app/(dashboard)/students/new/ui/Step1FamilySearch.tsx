'use client';

import { Group, Radio, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconCheck, IconPhone, IconUsers } from '@tabler/icons-react';
import { AppEmptyState, AppSurface, IconTile } from '@/src/components/controllers';
import { AppInput } from '@/src/components/controllers/input';
import { Family } from '@/src/core/api';
import { inputText } from '@/src/core/format';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';

/** Search and pick an existing family. */
export function Step1FamilySearch({
  families,
  isLoadingFamilies,
}: {
  families: Family[];
  isLoadingFamilies?: boolean;
}) {
  const selectedFamily = useStudentRegistrationMirror('selectedFamily');
  const setSelectedFamily = useStudentRegistrationMirror('setSelectedFamily');
  const familySearchQuery = useStudentRegistrationMirror('familySearchQuery');
  const setFamilySearchQuery = useStudentRegistrationMirror('setFamilySearchQuery');

  const filteredFamilies = families.filter((f) => {
    if (!familySearchQuery.trim()) return true;
    const q = familySearchQuery.toLowerCase();
    return f.familyName?.toLowerCase().includes(q) || f.fatherName?.toLowerCase().includes(q) || f.phone?.includes(q);
  });

  return (
    <Stack gap="md">
      <AppInput
        type="search"
        placeholder="بحث بالكنية، اسم الأب، أو رقم الهاتف..."
        value={familySearchQuery}
        onChange={(e) => setFamilySearchQuery(inputText(e))}
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
                  boxShadow: isSelected ? 'var(--app-card-shadow), 0 0 0 2px var(--app-brand-accent)' : undefined,
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
  );
}
