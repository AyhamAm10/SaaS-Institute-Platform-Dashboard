'use client';

import {
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconPlus,
  IconRefresh,
  IconSearch,
  IconUserCheck,
} from '@tabler/icons-react';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { useBranchesQuery, Teacher } from '@/src/core/api';
import { useTeachersMirror } from '../store/useTeachersMirror';
import { TeachersTable } from './TeachersTable';
import { TeacherFormDrawer } from './TeacherFormDrawer';
import { TeacherDetailsDrawer } from './TeacherDetailsDrawer';
import { TeacherDeleteModal } from './TeacherDeleteModal';

interface TeachersViewProps {
  onRefresh: () => void;
  onSubmit: () => void;
  onConfirmDelete: (teacher: Teacher) => Promise<void>;
  onAssignQualification: (branchId: number, subjectId: number) => Promise<void>;
  onRemoveQualification: (assignmentId: number) => Promise<void>;
  onSaveAvailabilities: () => Promise<void>;
  newAvailDay: string;
  setNewAvailDay: (v: string) => void;
  newAvailStart: string;
  setNewAvailStart: (v: string) => void;
  newAvailEnd: string;
  setNewAvailEnd: (v: string) => void;
  onAddAvailabilityWindow: () => void;
}

export function TeachersView({
  onRefresh,
  onSubmit,
  onConfirmDelete,
  onAssignQualification,
  onRemoveQualification,
  onSaveAvailabilities,
  newAvailDay,
  setNewAvailDay,
  newAvailStart,
  setNewAvailStart,
  newAvailEnd,
  setNewAvailEnd,
  onAddAvailabilityWindow,
}: TeachersViewProps) {
  const search = useTeachersMirror('search');
  const branchId = useTeachersMirror('branchId');
  const isFetching = useTeachersMirror('isFetching');
  const setSearch = useTeachersMirror('setSearch');
  const setBranchId = useTeachersMirror('setBranchId');
  const openCreateDrawer = useTeachersMirror('openCreateDrawer');

  const { data: branches } = useBranchesQuery();
  const branchOptions = [
    { value: '', label: 'كافة الفروع' },
    ...(branches || []).map((b: any) => ({
      value: String(b.id),
      label: b.name,
    })),
  ];

  return (
    <Stack gap="lg">
      {/* Header */}
      <Paper p="lg" radius="xl" withBorder>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="sm">
            <Paper
              p="xs"
              radius="xl"
              bg="var(--mantine-color-blue-0)"
              c="blue.7"
            >
              <IconUserCheck size={28} />
            </Paper>
            <Stack gap={2}>
              <Title order={2} fw={800}>
                الكادر التدريسي
              </Title>
              <Text c="dimmed" size="xs">
                إدارة المعلمين، تخصصاتهم، مؤهلات الفروع والمواد، وتحديد أوقات تفرغهم الأسبوعية
              </Text>
            </Stack>
          </Group>

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
              leftSection={<IconPlus size={18} />}
              radius="xl"
              onClick={openCreateDrawer}
            >
              إضافة معلم
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* Filters Toolbar */}
      <Paper p="md" radius="xl" withBorder>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <AppInput
            placeholder="البحث بالاسم أو رقم الهاتف..."
            value={search}
            onChange={setSearch}
            leftSection={<IconSearch size={16} />}
            clearable
          />
          <AppSelect
            placeholder="تصفية حسب الفرع"
            data={branchOptions}
            value={branchId ? String(branchId) : ''}
            onChange={(val: any) => setBranchId(val ? Number(val) : undefined)}
          />
        </SimpleGrid>
      </Paper>

      {/* Table */}
      <TeachersTable />

      {/* Drawers and Modals */}
      <TeacherFormDrawer onSubmit={onSubmit} />
      <TeacherDetailsDrawer
        onAssignQualification={onAssignQualification}
        onRemoveQualification={onRemoveQualification}
        onSaveAvailabilities={onSaveAvailabilities}
        newAvailDay={newAvailDay}
        setNewAvailDay={setNewAvailDay}
        newAvailStart={newAvailStart}
        setNewAvailStart={setNewAvailStart}
        newAvailEnd={newAvailEnd}
        setNewAvailEnd={setNewAvailEnd}
        onAddAvailabilityWindow={onAddAvailabilityWindow}
      />
      <TeacherDeleteModal onConfirmDelete={onConfirmDelete} />
    </Stack>
  );
}
