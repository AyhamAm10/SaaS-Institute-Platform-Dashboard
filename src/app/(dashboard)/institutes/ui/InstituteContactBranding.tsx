'use client';

import { Card, ColorSwatch, Divider, Group, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconMapPin, IconPhone } from '@tabler/icons-react';
import { DEFAULT_INSTITUTE_COLORS } from '../static-data/institutes.data';
import { useInstitutesMirror } from '../store/useInstitutesMirror';

/**
 * InstituteContactBranding
 *
 * Contact, location and brand palette of the selected institute.
 * Pure presentation — reads selectedInstitute from useInstitutesMirror.
 */
export function InstituteContactBranding() {
  const selectedInstitute = useInstitutesMirror('selectedInstitute');
  if (!selectedInstitute) return null;

  return (
    <>
      {/* Contact & Location Information */}
      <Stack gap="sm">
        <Text fw={500} size="sm" c="dimmed">
          معلومات الاتصال والموقع:
        </Text>
  
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
          <Card radius="lg" withBorder p="sm">
            <Group gap="xs">
              <ThemeIcon size="md" radius="xl" color="blue" variant="light">
                <IconPhone size={16} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  رقم الهاتف
                </Text>
                <Text size="sm" fw={500} dir="ltr">
                  {selectedInstitute.phone || '—'}
                </Text>
              </Stack>
            </Group>
          </Card>
  
          <Card radius="lg" withBorder p="sm">
            <Group gap="xs">
              <ThemeIcon size="md" radius="xl" color="orange" variant="light">
                <IconMapPin size={16} />
              </ThemeIcon>
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  العنوان
                </Text>
                <Text size="sm" fw={500} lineClamp={1}>
                  {selectedInstitute.address || '—'}
                </Text>
              </Stack>
            </Group>
          </Card>
        </SimpleGrid>
      </Stack>
  
      {/* Brand Palette */}
      <Stack gap="xs">
        <Text fw={500} size="sm" c="dimmed">
          الهوية البصرية والألوان:
        </Text>
        <Group gap="md">
          <Group gap="xs">
            <ColorSwatch color={selectedInstitute.primaryColor || DEFAULT_INSTITUTE_COLORS.primary} size={24} radius="md" />
            <Stack gap={0}>
              <Text size="xs" c="dimmed">
                اللون الأساسي
              </Text>
              <Text size="xs" fw={500} dir="ltr">
                {selectedInstitute.primaryColor || DEFAULT_INSTITUTE_COLORS.primary}
              </Text>
            </Stack>
          </Group>
  
          <Divider orientation="vertical" />
  
          <Group gap="xs">
            <ColorSwatch color={selectedInstitute.secondaryColor || DEFAULT_INSTITUTE_COLORS.secondary} size={24} radius="md" />
            <Stack gap={0}>
              <Text size="xs" c="dimmed">
                اللون الثانوي
              </Text>
              <Text size="xs" fw={500} dir="ltr">
                {selectedInstitute.secondaryColor || DEFAULT_INSTITUTE_COLORS.secondary}
              </Text>
            </Stack>
          </Group>
        </Group>
      </Stack>
    </>
  );
}
