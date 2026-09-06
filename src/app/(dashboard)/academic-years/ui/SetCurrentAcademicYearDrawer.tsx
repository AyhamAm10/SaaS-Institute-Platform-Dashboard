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
import { AppDrawer } from '@/src/components/controllers';
import { AcademicYear } from '@/src/core/api';
import { AcademicYearStatusBadge } from './AcademicYearStatusBadge';

export interface SetCurrentAcademicYearDrawerProps {
  opened: boolean;
  onClose: () => void;
  targetYear: AcademicYear | null;
  currentActiveYear?: AcademicYear | null;
  onConfirm: (year: AcademicYear) => Promise<void>;
  isLoading?: boolean;
}

export function SetCurrentAcademicYearDrawer({
  opened,
  onClose,
  targetYear,
  currentActiveYear,
  onConfirm,
  isLoading = false,
}: SetCurrentAcademicYearDrawerProps) {
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
    <AppDrawer
      opened={opened}
      onClose={onClose}
      size="md"
    >
      <AppDrawer.Header>
        <AppDrawer.Icon
          icon={<IconCalendarCheck size={20} />}
          color="teal"
        />
        <AppDrawer.Title>تعيين السنة الحالية النشطة</AppDrawer.Title>
        <AppDrawer.Description>
          تغيير السنة الدراسية الحالية المعتمدة لكافة عمليات المعهد
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <Stack gap="lg">
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

          {/* Current Active Year Card */}
          <AppDrawer.Section
            title="السنة الحالية الحالية"
            description="السنة النشطة حالياً في النظام"
          >
            {currentActiveYear ? (
              <AppDrawer.Details>
                <AppDrawer.Detail
                  label="اسم السنة"
                  value={currentActiveYear.name}
                  icon={<IconCalendarTime size={16} />}
                />
                <AppDrawer.Detail
                  label="الحالة"
                  value={<AcademicYearStatusBadge isCurrent={true} />}
                />
                <AppDrawer.Detail
                  label="فترة الدوام"
                  value={`${currentActiveYear.startDate?.split('T')[0] ?? '—'} إلى ${
                    currentActiveYear.endDate?.split('T')[0] ?? '—'
                  }`}
                />
              </AppDrawer.Details>
            ) : (
              <Text size="sm" c="dimmed">
                لا توجد سنة دراسية معينة كنشطة حالياً.
              </Text>
            )}
          </AppDrawer.Section>

          {/* Target New Active Year Card */}
          <AppDrawer.Section
            title="السنة الجديدة المراد تفعيلها"
            description="ستصبح هذه السنة هي السنة الدراسية النشطة"
          >
            {targetYear && (
              <AppDrawer.Details>
                <AppDrawer.Detail
                  label="اسم السنة الجديدة"
                  value={
                    <Text fw={700} c="teal" size="sm">
                      {targetYear.name}
                    </Text>
                  }
                  icon={<IconCalendarCheck size={16} />}
                  iconColor="teal"
                />
                <AppDrawer.Detail
                  label="تاريخ البداية"
                  value={targetYear.startDate?.split('T')[0] ?? '—'}
                />
                <AppDrawer.Detail
                  label="تاريخ النهاية"
                  value={targetYear.endDate?.split('T')[0] ?? '—'}
                />
              </AppDrawer.Details>
            )}
          </AppDrawer.Section>
        </Stack>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel disabled={isLoading} />
          <AppDrawer.Submit
            color="teal"
            loading={isLoading}
            onClick={handleConfirm}
            leftSection={<IconCheck size={16} />}
          >
            تأكيد التعيين كنشطة
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
