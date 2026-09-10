'use client';

import {
  Alert,
  Button,
  Drawer,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBuildingCommunity,
  IconDeviceFloppy,
} from '@tabler/icons-react';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { useBranchesQuery } from '@/src/core/api';
import { useRoomsMirror } from '../store/useRoomsMirror';

const ROOM_TYPES = [
  { value: 'CLASSROOM', label: 'صف دراسي' },
  { value: 'LAB', label: 'مختبر علمي / حاسوب' },
  { value: 'HALL', label: 'مدرج / قاعة محاضرات' },
  { value: 'ACTIVITY', label: 'قاعة أنشطة وورش عمل' },
];

interface RoomFormDrawerProps {
  onSubmit: () => void;
}

export function RoomFormDrawer({ onSubmit }: RoomFormDrawerProps) {
  const drawerOpened = useRoomsMirror('drawerOpened');
  const drawerMode = useRoomsMirror('drawerMode');
  const form = useRoomsMirror('form');
  const formErrors = useRoomsMirror('formErrors');
  const generalError = useRoomsMirror('generalError');
  const isSubmitting = useRoomsMirror('isSubmitting');

  const closeDrawer = useRoomsMirror('closeDrawer');
  const setFormField = useRoomsMirror('setFormField');

  const { data: branches } = useBranchesQuery();
  const branchOptions = [
    { value: '', label: 'كافة الفروع (قاعة مشتركة)' },
    ...(branches || []).map((b: any) => ({
      value: String(b.id),
      label: b.name,
    })),
  ];

  const isEdit = drawerMode === 'edit';

  return (
    <Drawer
      opened={drawerOpened}
      onClose={closeDrawer}
      position="right"
      size="md"
      title={
        <Group gap="xs">
          <IconBuildingCommunity size={20} />
          <Text fw={700} size="md">
            {isEdit ? 'تعديل بيانات القاعة' : 'إضافة قاعة جديدة'}
          </Text>
        </Group>
      }
      padding="lg"
      radius="md"
    >
      <Stack gap="md">
        {generalError && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            color="red"
            radius="xl"
            title="تعذر الحفظ"
          >
            {generalError}
          </Alert>
        )}

        <AppInput
          label="اسم القاعة"
          placeholder="مثال: قاعة الخوارزمي، مخبر الفيزياء 1"
          value={form.name}
          onChange={(val) => setFormField('name', val)}
          error={formErrors.name}
          required
        />

        <AppSelect
          label="نوع القاعة"
          placeholder="اختر نوع القاعة"
          data={ROOM_TYPES}
          value={form.type}
          onChange={(val: any) => setFormField('type', val || 'CLASSROOM')}
          required
        />

        <AppInput
          label="السعة الاستيعابية (عدد المقاعد)"
          placeholder="30"
          type="number"
          value={String(form.capacity)}
          onChange={(val: any) => setFormField('capacity', Number(val) || 1)}
          error={formErrors.capacity}
          required
        />

        <AppSelect
          label="الفرع التابع له"
          placeholder="اختر الفرع"
          data={branchOptions}
          value={form.branchId ? String(form.branchId) : ''}
          onChange={(val: any) =>
            setFormField('branchId', val ? Number(val) : null)
          }
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="light" color="gray" radius="xl" onClick={closeDrawer}>
            إلغاء
          </Button>
          <Button
            leftSection={<IconDeviceFloppy size={18} />}
            radius="xl"
            loading={isSubmitting}
            onClick={onSubmit}
          >
            {isEdit ? 'حفظ التعديلات' : 'إضافة القاعة'}
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}
