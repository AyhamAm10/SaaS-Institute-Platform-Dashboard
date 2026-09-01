'use client';

import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconFileSpreadsheet,
  IconPrinter,
  IconTestPipe,
  IconUserPlus,
} from '@tabler/icons-react';
import Link from 'next/link';

export function WelcomeBanner() {
  return (
    <Paper p="lg" radius="lg" withBorder>
      <Group justify="space-between" align="center" wrap="wrap">
        {/* Right Side: Page Heading & Breadcrumb */}
        <Stack gap={2}>
          <Group gap="xs">
            <Title order={2} fw={800} style={{ letterSpacing: '-0.3px' }}>
              الطلاب المقيدون
            </Title>
            <Badge color="primary" variant="light" size="sm">
              العام الدراسي 2026-2027
            </Badge>
          </Group>
          <Text c="dimmed" size="xs" fw={500}>
            إدارة المعهد • قائمة الطلاب المسجلين والشعب الأكاديمية
          </Text>
        </Stack>

        {/* Left Side: Actions (Pill button + export buttons) */}
        <Group gap="sm">
          <Tooltip label="تصدير إلى Excel" withArrow>
            <ActionIcon variant="light" size="lg" radius="md" color="teal">
              <IconFileSpreadsheet size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="طباعة الكشف" withArrow>
            <ActionIcon variant="light" size="lg" radius="md" color="gray">
              <IconPrinter size={18} />
            </ActionIcon>
          </Tooltip>

          <Checkbox label="تحديد الكل" size="xs" fw={600} />

          <Button
            component={Link}
            href="/isolation-test"
            variant="light"
            color="teal"
            radius="xl"
            size="sm"
            leftSection={<IconTestPipe size={16} />}
          >
            عزل المتجر
          </Button>

          <Button
            radius="xl"
            size="sm"
            leftSection={<IconUserPlus size={17} stroke={2} />}
            style={{
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.25)',
              fontWeight: 700,
            }}
          >
            + إضافة طالب
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
