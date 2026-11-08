'use client';

import { Box, Group, Stack, Text } from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';
import { AppIconButton, StatusBadge } from '@/src/components/controllers';
import { AppInput } from '@/src/components/controllers/input';
import { inputText } from '@/src/core/format';
import { useStudentFieldsMirror } from '../store/useStudentFieldsMirror';

/** Options of a select field: type, add (button / Enter), remove. ZERO useState. */
export function StudentFieldOptionsEditor() {
  const options = useStudentFieldsMirror('formOptions');
  const draft = useStudentFieldsMirror('optionDraft');
  const setDraft = useStudentFieldsMirror('setOptionDraft');
  const commit = useStudentFieldsMirror('commitOptionDraft');
  const removeOption = useStudentFieldsMirror('removeOption');

  return (
    <Stack gap="xs">
      <Text size="xs" fw={500}>
        خيارات القائمة المنسدلة
      </Text>
      <Group gap="xs" align="flex-start" wrap="nowrap">
        <Box style={{ flex: 1 }}>
          <AppInput
            placeholder="أدخل خياراً (مثال: A+) واضغط إضافة..."
            value={draft}
            onChange={(e: unknown) => setDraft(inputText(e))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                commit();
              }
            }}
          />
        </Box>
        <AppIconButton variant="primary" label="إضافة خيار" onClick={commit}>
          <IconPlus size={18} />
        </AppIconButton>
      </Group>

      {options.length > 0 ? (
        <Group gap="xs" wrap="wrap" mt={4}>
          {options.map((opt, idx) => (
            <Group key={opt} gap={2} wrap="nowrap">
              <StatusBadge tone="brand" size="sm">
                {opt}
              </StatusBadge>
              <AppIconButton size="xs" variant="danger" label={`حذف الخيار ${opt}`} onClick={() => removeOption(idx)}>
                <IconX size={12} />
              </AppIconButton>
            </Group>
          ))}
        </Group>
      ) : (
        <Text size="xs" c="var(--app-text-muted)">
          لم تتم إضافة أي خيارات بعد. اكتب الخيار أعلاه واضغط على زر (+) أو مفتاح Enter.
        </Text>
      )}
    </Stack>
  );
}
