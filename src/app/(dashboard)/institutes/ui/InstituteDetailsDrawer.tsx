'use client';

import {
  Avatar,
  Badge,
  Button,
  Card,
  ColorSwatch,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from '@mantine/core';
import {
  IconBuildingCommunity,
  IconCalendar,
  IconMapPin,
  IconPhone,
  IconSchool,
  IconUser,
  IconUserCheck,
} from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';

/**
 * InstituteDetailsDrawer
 *
 * Drawer displaying detailed profile of an educational institute.
 * Pure presentation layer adhering strictly to role.md.
 * ZERO useState hooks — reads selectedInstitute and actions from useInstitutesMirror.
 */
export function InstituteDetailsDrawer() {
  const opened = useInstitutesMirror('detailsDrawerOpened');
  const closeDetailsDrawer = useInstitutesMirror('closeDetailsDrawer');
  const selectedInstitute = useInstitutesMirror('selectedInstitute');

  if (!selectedInstitute) return null;

  const adminUser = selectedInstitute.instituteAdmins?.[0]?.user;
  const formattedCreatedDate = selectedInstitute.createdAt
    ? new Date(selectedInstitute.createdAt).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <AppDrawer opened={opened} onClose={closeDetailsDrawer} size="lg">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconBuildingCommunity size={22} />} color="teal" />
        <AppDrawer.Title>{selectedInstitute.name}</AppDrawer.Title>
        <AppDrawer.Description>
          {institutesLabels.detailsDrawerDescription}
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <Stack gap="xl">
          {/* Institute Branding Banner */}
          <Paper
            p="md"
            radius="xl"
            withBorder
            style={{
              background: `linear-gradient(135deg, ${selectedInstitute.primaryColor || '#1a73e8'}15 0%, ${selectedInstitute.secondaryColor || '#34a853'}15 100%)`,
              borderColor: 'var(--mantine-color-gray-2)',
            }}
          >
            <Group gap="md">
              <Avatar
                src={selectedInstitute.logoUrl || null}
                alt={selectedInstitute.name}
                color="primary"
                radius="xl"
                size={54}
              >
                {selectedInstitute.name ? selectedInstitute.name.slice(0, 2) : 'مع'}
              </Avatar>
              <Stack gap={2}>
                <Text fw={800} size="lg">
                  {selectedInstitute.name}
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="teal" size="sm" radius="xl">
                    مؤسسة نشطة
                  </Badge>
                  <Text size="xs" c="dimmed">
                    المعرف: #{selectedInstitute.id}
                  </Text>
                </Group>
              </Stack>
            </Group>
          </Paper>

          {/* Contact & Location Information */}
          <Stack gap="sm">
            <Text fw={700} size="sm" c="dimmed">
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
                    <Text size="sm" fw={600} dir="ltr">
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
                    <Text size="sm" fw={600} lineClamp={1}>
                      {selectedInstitute.address || '—'}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            </SimpleGrid>
          </Stack>

          {/* Brand Palette */}
          <Stack gap="xs">
            <Text fw={700} size="sm" c="dimmed">
              الهوية البصرية والألوان:
            </Text>
            <Group gap="md">
              <Group gap="xs">
                <ColorSwatch color={selectedInstitute.primaryColor || '#1a73e8'} size={24} radius="md" />
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">
                    اللون الأساسي
                  </Text>
                  <Text size="xs" fw={700} dir="ltr">
                    {selectedInstitute.primaryColor || '#1a73e8'}
                  </Text>
                </Stack>
              </Group>

              <Divider orientation="vertical" />

              <Group gap="xs">
                <ColorSwatch color={selectedInstitute.secondaryColor || '#34a853'} size={24} radius="md" />
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">
                    اللون الثانوي
                  </Text>
                  <Text size="xs" fw={700} dir="ltr">
                    {selectedInstitute.secondaryColor || '#34a853'}
                  </Text>
                </Stack>
              </Group>
            </Group>
          </Stack>

          <Divider />

          {/* Responsible Administrator Card */}
          <Stack gap="xs">
            <Text fw={700} size="sm" c="dimmed">
              المدير المسؤول عن المعهد:
            </Text>

            {adminUser ? (
              <Card radius="lg" withBorder p="md" bg="var(--mantine-color-gray-0)">
                <Group justify="space-between" align="center">
                  <Group gap="md">
                    <Avatar color="teal" size="md" radius="xl">
                      <IconUserCheck size={20} />
                    </Avatar>
                    <Stack gap={2}>
                      <Text size="sm" fw={700}>
                        {adminUser.fullName}
                      </Text>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed" dir="ltr">
                          {adminUser.phone}
                        </Text>
                        <Badge size="xs" color="teal" variant="light" radius="xl">
                          مدير المعهد
                        </Badge>
                      </Group>
                    </Stack>
                  </Group>
                </Group>
              </Card>
            ) : (
              <Paper p="md" radius="lg" withBorder>
                <Text size="sm" c="dimmed">
                  {institutesLabels.noAdminAssigned}
                </Text>
              </Paper>
            )}
          </Stack>

          {/* Registration Date */}
          <Group gap="xs" mt="md">
            <ThemeIcon size="sm" radius="xl" color="gray" variant="light">
              <IconCalendar size={14} />
            </ThemeIcon>
            <Text size="xs" c="dimmed">
              تاريخ إضافة المعهد إلى النظام: {formattedCreatedDate}
            </Text>
          </Group>
        </Stack>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <Group justify="flex-end" w="100%">
          <Button variant="default" radius="xl" onClick={closeDetailsDrawer}>
            إغلاق النافذة
          </Button>
        </Group>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
