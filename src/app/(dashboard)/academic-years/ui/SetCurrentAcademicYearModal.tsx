'use client';

import { Alert, Box, Card, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import {
  IconAlertCircle,
  IconCalendarCheck,
  IconCalendarTime,
  IconCheck,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useState } from 'react';
import { AppModal } from '@/src/components/controllers';
import { AcademicYear } from '@/src/core/api';
import { AcademicYearStatusBadge } from './AcademicYearStatusBadge';

export interface SetCurrentAcademicYearModalProps {
  opened: boolean;
  onClose: () => void;
  targetYear: AcademicYear | null;
  currentActiveYear?: AcademicYear | null;
  onConfirm: (year: AcademicYear) => Promise<void>;
  isLoading?: boolean;
}

/**
 * SetCurrentAcademicYearModal
 *
 * Employs the project AppModal system for a high-priority administrative confirmation action.
 * Modals are ideal for focused decisions that should not distract with long side drawers.
 */
export function SetCurrentAcademicYearModal({
  opened,
  onClose,
  targetYear,
  currentActiveYear,
  onConfirm,
  isLoading = false,
}: SetCurrentAcademicYearModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!targetYear) return;
    setError(null);
    try {
      await onConfirm(targetYear);
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء تعيين السنة الدراسية كنشطة';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      variant="info"
      size="md"
    >
      <AppModal.Header>
        <AppModal.Icon icon={<IconCalendarCheck size={20} />} />
        <AppModal.Title>تعيين السنة الحالية النشطة</AppModal.Title>
        <AppModal.Description>
          تغيير السنة الدراسية الحالية المعتمدة لكافة عمليات المعهد
        </AppModal.Description>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="md">
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              radius="md"
            >
              {error}
            </Alert>
          )}

          <Alert
            icon={<IconInfoCircle size={18} />}
            color="blue"
            variant="light"
            radius="md"
            title="تنبيه إداري"
          >
            تغيير السنة الدراسية الحالية سيجعل السنة المحددة هي الإطار الزمني الافتراضي لجميع
            عمليات التسجيل، الجداول الدراسية، والرسوم الجديدة.
          </Alert>

          {/* Current Active Year comparison */}
          <Box
            p="sm"
            style={{
              border: '1px solid var(--mantine-color-gray-2)',
              borderRadius: 'var(--mantine-radius-md)',
              backgroundColor: 'var(--mantine-color-gray-0)',
            }}
          >
            <Group justify="space-between" align="center">
              <Group gap="xs">
                <IconCalendarTime size={16} color="var(--mantine-color-gray-6)" />
                <Text size="xs" c="dimmed">السنة النشطة حالياً:</Text>
              </Group>
              {currentActiveYear ? (
                <Group gap="xs">
                  <Text size="xs" fw={600}>{currentActiveYear.name}</Text>
                  <AcademicYearStatusBadge isCurrent={true} />
                </Group>
              ) : (
                <Text size="xs" c="dimmed">لا توجد سنة نشطة</Text>
              )}
            </Group>
          </Box>

          {/* Target New Active Year Card */}
          {targetYear && (
            <Box
              p="sm"
              style={{
                border: '1px solid var(--mantine-color-teal-2)',
                borderRadius: 'var(--mantine-radius-md)',
                backgroundColor: 'var(--mantine-color-teal-0)',
              }}
            >
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <IconCalendarCheck size={16} color="var(--mantine-color-teal-7)" />
                  <Text size="xs" c="teal.9" fw={600}>السنة المراد اعتمادها:</Text>
                </Group>
                <Text size="sm" fw={700} c="teal.8">{targetYear.name}</Text>
              </Group>
              <Text size="xs" c="dimmed" mt={4}>
                فترة الدوام: {targetYear.startDate?.split('T')[0] ?? '—'} إلى {targetYear.endDate?.split('T')[0] ?? '—'}
              </Text>
            </Box>
          )}
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel disabled={isLoading} />
          <AppModal.Confirm
            color="teal"
            loading={isLoading}
            onClick={handleConfirm}
            leftSection={<IconCheck size={16} />}
          >
            تأكيد التعيين كنشطة
          </AppModal.Confirm>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
