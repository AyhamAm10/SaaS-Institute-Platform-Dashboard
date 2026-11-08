'use client';

import {
  Alert,
  Collapse,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import { StatusBadge } from '@/src/components/controllers';
import { useTimetableMirror } from '../store/useTimetableMirror';

export function TimetableConflictBanner() {
  const conflicts = useTimetableMirror('conflicts');
  const opened = useTimetableMirror('conflictsOpened');
  const toggle = useTimetableMirror('toggleConflicts');

  if (!conflicts || conflicts.length === 0) {
    return (
      <Alert
        icon={<IconCheck size={18} />}
        color="teal"
        radius="xl"
        variant="light"
        title="الجدول متوافق بالكامل"
      >
        <Text size="xs">
          تم فحص كافة أبعاد القيود (تفرغ المعلمين، القاعات، الساعات، عدم التضارب): لا توجد أي تعارضات مسجلة.
        </Text>
      </Alert>
    );
  }

  const hardConflicts = conflicts.filter((c) => c.severity === 'HARD');
  const softConflicts = conflicts.filter((c) => c.severity === 'SOFT');

  const isHard = hardConflicts.length > 0;

  return (
    <Alert
      icon={isHard ? <IconAlertCircle size={20} /> : <IconAlertTriangle size={20} />}
      color={isHard ? 'red' : 'yellow'}
      radius="xl"
      variant="light"
      title={
        <Group justify="space-between" align="center" style={{ width: '100%' }}>
          <Group gap="xs">
            <Text fw={500} size="sm">
              {isHard
                ? `تم اكتشاف ${hardConflicts.length} تعارضات حرجة في الجدول`
                : `تنبيه: يوجد ${softConflicts.length} ملاحظات حول الحصص المطلوبة`}
            </Text>
            <StatusBadge tone={isHard ? 'danger' : 'warning'} variant="solid" size="xs">
              {conflicts.length} ملاحظة
            </StatusBadge>
          </Group>

          <UnstyledButton onClick={toggle}>
            <Group gap={4}>
              <Text size="xs" fw={500} c={isHard ? 'red.9' : 'yellow.9'}>
                {opened ? 'إخفاء التفاصيل' : 'عرض كافة التعارضات'}
              </Text>
              {opened ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
            </Group>
          </UnstyledButton>
        </Group>
      }
    >
      <Collapse expanded={opened}>
        <Stack gap="xs" mt="xs">
          {conflicts.map((c, idx) => (
            <Group
              key={idx}
              justify="space-between"
              align="center"
              p="xs"
              style={{
                backgroundColor: 'var(--app-sidebar-subtle)',
                borderRadius: '8px',
              }}
            >
              <Group gap="xs">
                <StatusBadge tone={c.severity === 'HARD' ? 'danger' : 'warning'} variant="solid" size="xs">
                  {c.severity === 'HARD' ? 'تعارض حرج' : 'ملاحظة'}
                </StatusBadge>
                <Text size="xs" fw={500}>
                  {c.message}
                </Text>
              </Group>
            </Group>
          ))}
        </Stack>
      </Collapse>
    </Alert>
  );
}
