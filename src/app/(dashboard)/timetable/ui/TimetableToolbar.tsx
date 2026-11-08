'use client';

import { Group, Paper, SimpleGrid } from '@mantine/core';
import { IconRefresh, IconWand } from '@tabler/icons-react';
import { AppSelect } from '@/src/components/controllers';
import { useTimetableMirror } from '../store/useTimetableMirror';
import { AppButton } from '@/src/components/controllers/button';

interface TimetableToolbarProps {
  onRefresh: () => void;
  canManage?: boolean;
}

export function TimetableToolbar({ onRefresh, canManage = true }: TimetableToolbarProps) {
  const academicYearId = useTimetableMirror('academicYearId');
  const sectionId = useTimetableMirror('sectionId');
  const isFetching = useTimetableMirror('isFetching');
  const setSectionId = useTimetableMirror('setSectionId');
  const openGenerateModal = useTimetableMirror('openGenerateModal');

  // Sections of the header year (the year is never chosen on this page)
  const sections = useTimetableMirror('sections');

  const sectionOptions = sections.map((s) => ({
    value: String(s.id),
    label: `${s.name} - ${s.academicBranch?.name || s.grade}`,
  }));

  return (
    <Paper p="md" radius="xl" withBorder>
      <Group justify="space-between" align="center" wrap="wrap">
        <SimpleGrid cols={1} spacing="md" style={{ flex: 1, maxWidth: 320 }}>
          <AppSelect
            placeholder="اختر الشعبة الدراسية"
            data={sectionOptions}
            value={sectionId ? String(sectionId) : null}
            onChange={(val: string | null) => setSectionId(val ? Number(val) : null)}
            disabled={!academicYearId}
          />
        </SimpleGrid>

        <Group gap="sm">
          <AppButton variant="outline" leftSection={<IconRefresh size={18} />} onClick={onRefresh} loading={isFetching}>
            تحديث
          </AppButton>
          {canManage && (
            <AppButton leftSection={<IconWand size={18} />} onClick={openGenerateModal} disabled={!academicYearId}>
              توليد الجدول آليا
            </AppButton>
          )}
        </Group>
      </Group>
    </Paper>
  );
}
