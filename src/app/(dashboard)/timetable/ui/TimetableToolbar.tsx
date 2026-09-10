'use client';

import {
  Button,
  Group,
  Paper,
  SimpleGrid,
} from '@mantine/core';
import {
  IconRefresh,
  IconWand,
} from '@tabler/icons-react';
import { AppSelect } from '@/src/components/controllers';
import { useAcademicYearsQuery, useSectionsQuery } from '@/src/core/api';
import { useTimetableMirror } from '../store/useTimetableMirror';

interface TimetableToolbarProps {
  onRefresh: () => void;
}

export function TimetableToolbar({ onRefresh }: TimetableToolbarProps) {
  const academicYearId = useTimetableMirror('academicYearId');
  const sectionId = useTimetableMirror('sectionId');
  const isFetching = useTimetableMirror('isFetching');
  const setAcademicYearId = useTimetableMirror('setAcademicYearId');
  const setSectionId = useTimetableMirror('setSectionId');
  const openGenerateModal = useTimetableMirror('openGenerateModal');

  const { data: years } = useAcademicYearsQuery();
  const { data: sectionsData } = useSectionsQuery({
    academicYearId: academicYearId ?? undefined,
    limit: 100,
  });

  const yearOptions = (years?.data || []).map((y: any) => ({
    value: String(y.id),
    label: `${y.name} ${y.isCurrent ? '(الحالية)' : ''}`,
  }));

  const sectionOptions = (sectionsData?.data || []).map((s: any) => ({
    value: String(s.id),
    label: `${s.name} - ${s.academicBranch?.name || s.grade}`,
  }));

  return (
    <Paper p="md" radius="xl" withBorder>
      <Group justify="space-between" align="center" wrap="wrap">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" style={{ flex: 1, maxWidth: 600 }}>
          <AppSelect
            placeholder="اختر السنة الدراسية"
            data={yearOptions}
            value={academicYearId ? String(academicYearId) : null}
            onChange={(val: any) => {
              setAcademicYearId(val ? Number(val) : null);
              setSectionId(null);
            }}
          />
          <AppSelect
            placeholder="اختر الشُعبة الدراسية"
            data={sectionOptions}
            value={sectionId ? String(sectionId) : null}
            onChange={(val: any) => setSectionId(val ? Number(val) : null)}
            disabled={!academicYearId}
          />
        </SimpleGrid>

        <Group gap="sm">
          <Button
            leftSection={<IconRefresh size={18} />}
            variant="light"
            color="gray"
            radius="xl"
            onClick={onRefresh}
            loading={isFetching}
          >
            تحديث
          </Button>
          <Button
            leftSection={<IconWand size={18} />}
            radius="xl"
            color="indigo"
            onClick={openGenerateModal}
            disabled={!academicYearId}
          >
            توليد الجدول آلياً
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
