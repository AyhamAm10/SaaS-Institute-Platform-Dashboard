'use client';
import { ReactNode } from 'react';
import { formatLongDate } from '@/src/core/format';

import { Avatar, Divider, Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconBuildingCommunity, IconCalendar, IconEdit } from '@tabler/icons-react';
import { AppButton, AppDrawer, StatusBadge } from '@/src/components/controllers';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { InstituteContactBranding } from './InstituteContactBranding';
import { InstituteAdminCard } from './InstituteAdminCard';
import { DEFAULT_INSTITUTE_COLORS, institutesLabels } from '../static-data/institutes.data';

/**
 * InstituteDetailsDrawer
 *
 * Drawer displaying detailed profile of an educational institute.
 * Pure presentation layer adhering strictly to role.md.
 * ZERO useState hooks — reads selectedInstitute and actions from useInstitutesMirror.
 */
export interface InstituteDetailsDrawerProps {
  /** Feature flags section, composed by the view. */
  featuresSlot?: ReactNode;
}

export function InstituteDetailsDrawer({ featuresSlot }: InstituteDetailsDrawerProps) {
  const opened = useInstitutesMirror('detailsDrawerOpened');
  const closeDetailsDrawer = useInstitutesMirror('closeDetailsDrawer');
  const selectedInstitute = useInstitutesMirror('selectedInstitute');
  const openEditDrawer = useInstitutesMirror('openEditDrawer');

  if (!selectedInstitute) return null;

  const formattedCreatedDate = formatLongDate(selectedInstitute.createdAt);

  return (
    <AppDrawer opened={opened} onClose={closeDetailsDrawer} size="lg">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconBuildingCommunity size={22} />} color="teal" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>{selectedInstitute.name}</AppDrawer.Title>
          <AppDrawer.Description>
            {institutesLabels.detailsDrawerDescription}
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <Stack gap="xl">
          {/* Institute Branding Banner */}
          <Paper
            p="md"
            radius="xl"
            withBorder
            style={{
              background: `linear-gradient(135deg, ${selectedInstitute.primaryColor || DEFAULT_INSTITUTE_COLORS.primary}15 0%, ${selectedInstitute.secondaryColor || DEFAULT_INSTITUTE_COLORS.secondary}15 100%)`,
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
                <Text fw={500} size="lg">
                  {selectedInstitute.name}
                </Text>
                <Group gap="xs">
                  <StatusBadge tone="success" size="sm">
                    مؤسسة نشطة
                  </StatusBadge>
                  <Text size="xs" c="dimmed">
                    المعرف: #{selectedInstitute.id}
                  </Text>
                  <StatusBadge tone="brand" variant="outline" size="sm">
                    {institutesLabels.detailsCode}: {selectedInstitute.code}
                  </StatusBadge>
                </Group>
              </Stack>
            </Group>
          </Paper>

          <InstituteContactBranding />

          <Divider />

          <InstituteAdminCard />

          {featuresSlot && (
            <>
              <Divider />
              {featuresSlot}
            </>
          )}

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
          <AppButton variant="outline" radius="xl" onClick={closeDetailsDrawer}>
            إغلاق النافذة
          </AppButton>
          <AppButton
            radius="xl"
            leftSection={<IconEdit size={16} />}
            onClick={() => openEditDrawer(selectedInstitute)}
          >
            {institutesLabels.editButton}
          </AppButton>
        </Group>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
