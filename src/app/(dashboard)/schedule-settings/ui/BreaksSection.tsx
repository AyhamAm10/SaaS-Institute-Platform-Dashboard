'use client';

import { Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCoffee, IconPlus, IconTrash } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers';
import { StatusBadge } from '@/src/components/controllers/badge';
import { AppButton, AppIconButton } from '@/src/components/controllers/button';
import { inputText } from '@/src/core/format';
import { useScheduleSettingsMirror } from '../store/useScheduleSettingsMirror';

export interface BreaksSectionProps {
  newBreakName: string;
  setNewBreakName: (v: string) => void;
  newBreakStart: string;
  setNewBreakStart: (v: string) => void;
  newBreakEnd: string;
  setNewBreakEnd: (v: string) => void;
  onAddBreak: () => void;
}

/** Break periods: the add bar and the current list. */
export function BreaksSection({
  newBreakName,
  setNewBreakName,
  newBreakStart,
  setNewBreakStart,
  newBreakEnd,
  setNewBreakEnd,
  onAddBreak,
}: BreaksSectionProps) {
  const form = useScheduleSettingsMirror('form');
  const removeBreak = useScheduleSettingsMirror('removeBreak');

  return (
    <Paper p="lg" radius="xl" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <ThemeIcon size="md" radius="xl" variant="light" color="secondary">
              <IconCoffee size={18} />
            </ThemeIcon>
            <Text fw={500} size="md">
              فترات الاستراحة والفسحة
            </Text>
          </Group>
          <StatusBadge tone="brand">{form.breaks.length} استراحات</StatusBadge>
        </Group>

        {/* Add Break Bar */}
        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="xs">
          <AppInput
            placeholder="اسم الاستراحة (مثال: الفسحة الأولى)"
            value={newBreakName}
            onChange={(val) => setNewBreakName(inputText(val))}
          />
          <AppInput
            placeholder="البداية (09:30)"
            value={newBreakStart}
            onChange={(val) => setNewBreakStart(inputText(val))}
          />
          <AppInput
            placeholder="النهاية (10:00)"
            value={newBreakEnd}
            onChange={(val) => setNewBreakEnd(inputText(val))}
          />
          <AppButton
            variant="outline"
            leftSection={<IconPlus size={16} />}
            onClick={onAddBreak}
            disabled={!newBreakName.trim() || !newBreakStart || !newBreakEnd}
          >
            إضافة استراحة
          </AppButton>
        </SimpleGrid>

        {/* Existing Breaks List */}
        {form.breaks.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="xs">
            لا توجد استراحات مضافة حاليا
          </Text>
        ) : (
          <Stack gap="xs">
            {form.breaks.map((b, idx) => (
              <Paper key={idx} p="xs" radius="lg" withBorder bg="var(--app-subtle)">
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="xl" color="secondary" variant="light">
                      <IconCoffee size={14} />
                    </ThemeIcon>
                    <Text size="sm" fw={500}>
                      {b.name}
                    </Text>
                    <StatusBadge tone="neutral" variant="outline" size="sm">
                      {b.startTime} - {b.endTime}
                    </StatusBadge>
                  </Group>

                  <AppIconButton variant="danger" label="حذف الاستراحة" onClick={() => removeBreak(idx)}>
                    <IconTrash size={16} />
                  </AppIconButton>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
