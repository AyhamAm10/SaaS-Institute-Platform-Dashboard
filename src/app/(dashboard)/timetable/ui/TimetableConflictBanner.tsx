'use client';

import {
  Alert,
  Badge,
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
import { useState } from 'react';
import { useTimetableMirror } from '../store/useTimetableMirror';

export function TimetableConflictBanner() {
  const conflicts = useTimetableMirror('conflicts');
  const [opened, setOpened] = useState(false);

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
            <Text fw={700} size="sm">
              {isHard
                ? `تم اكتشاف ${hardConflicts.length} تعارضات حرجة في الجدول`
                : `تنبيه: يوجد ${softConflicts.length} ملاحظات حول الحصص المطلوبة`}
            </Text>
            <Badge color={isHard ? 'red' : 'yellow'} variant="filled" size="xs">
              {conflicts.length} ملاحظة
            </Badge>
          </Group>

          <UnstyledButton onClick={() => setOpened((o) => !o)}>
            <Group gap={4}>
              <Text size="xs" fw={600} c={isHard ? 'red.9' : 'yellow.9'}>
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
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '8px',
              }}
            >
              <Group gap="xs">
                <Badge
                  color={c.severity === 'HARD' ? 'red' : 'yellow'}
                  size="xs"
                  variant="filled"
                >
                  {c.severity === 'HARD' ? 'تعارض حرج' : 'ملاحظة'}
                </Badge>
                <Text size="xs" fw={600}>
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
