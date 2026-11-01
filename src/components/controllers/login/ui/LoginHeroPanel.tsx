'use client';

import React from 'react';
import { Box, Group, Stack, Text, Title, rem } from '@mantine/core';
import { IconCalendarStats, IconSchool, IconUsers } from '@tabler/icons-react';
import { BrandMark } from '../../sidebar/ui/shared/SidebarBrand';

const HIGHLIGHTS = [
  { icon: IconUsers, label: 'الطلاب والعائلات' },
  { icon: IconSchool, label: 'الشعب والمواد' },
  { icon: IconCalendarStats, label: 'الجدول الأسبوعي' },
];

/**
 * LoginHeroPanel
 *
 * Institute brand panel: the logo on its native black, the institute name
 * and the main areas of the dashboard. Hidden on small screens.
 */
export function LoginHeroPanel() {
  return (
    <Box
      visibleFrom="md"
      style={{
        width: '100%',
        maxWidth: rem(440),
        padding: rem(40),
        borderRadius: 'var(--app-radius-xl)',
        background: 'linear-gradient(160deg, rgba(28, 28, 30, 0.92), rgba(10, 10, 11, 0.96))',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 40px 80px -24px rgba(20, 20, 22, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        color: '#FFFFFF',
      }}
    >
      <Stack gap="xl">
        <BrandMark size={96} />

        <Stack gap={8}>
          <Title order={2} fw={600} style={{ fontSize: rem(30), letterSpacing: '-0.01em', color: '#FFFFFF' }}>
            معهد جيل السلام
          </Title>
          <Text fw={300} style={{ fontSize: rem(14.5), lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.66)' }}>
            لوحة إدارة واحدة للطلاب والشعب والكادر والجدول الأسبوعي.
          </Text>
        </Stack>

        <Stack gap="sm">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <Group key={label} gap="sm" wrap="nowrap">
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: rem(34),
                  height: rem(34),
                  borderRadius: 'var(--app-radius-sm)',
                  backgroundColor: 'rgba(241, 103, 38, 0.14)',
                  color: 'var(--mantine-color-brand-4)',
                }}
              >
                <Icon size={18} stroke={1.6} />
              </Box>
              <Text fw={400} size="sm" style={{ color: 'rgba(255, 255, 255, 0.82)' }}>
                {label}
              </Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
