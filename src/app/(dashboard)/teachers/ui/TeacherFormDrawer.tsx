'use client';

import { Alert, Drawer, Group, Stack, Switch, Text } from '@mantine/core';
import { IconAlertCircle, IconDeviceFloppy, IconUser } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers';
import { useTeachersMirror } from '../store/useTeachersMirror';
import { AppButton } from '@/src/components/controllers/button';

interface TeacherFormDrawerProps {
  onSubmit: () => void;
}

export function TeacherFormDrawer({ onSubmit }: TeacherFormDrawerProps) {
  const drawerOpened = useTeachersMirror('drawerOpened');
  const drawerMode = useTeachersMirror('drawerMode');
  const form = useTeachersMirror('form');
  const formErrors = useTeachersMirror('formErrors');
  const generalError = useTeachersMirror('generalError');
  const isSubmitting = useTeachersMirror('isSubmitting');

  const closeDrawer = useTeachersMirror('closeDrawer');
  const setFormField = useTeachersMirror('setFormField');

  const isEdit = drawerMode === 'edit';

  return (
    <Drawer
      opened={drawerOpened}
      onClose={closeDrawer}
      position="right"
      size="md"
      title={
        <Group gap="xs">
          <IconUser size={20} />
          <Text fw={500} size="md">
            {isEdit ? 'تعديل بيانات المعلم' : 'إضافة معلم جديد'}
          </Text>
        </Group>
      }
      padding="lg"
      radius="xl"
    >
      <Stack gap="md">
        {generalError && (
          <Alert icon={<IconAlertCircle size={18} />} color="red" radius="xl" title="تعذر الحفظ">
            {generalError}
          </Alert>
        )}

        <AppInput
          label="الاسم الكامل"
          placeholder="مثال: أحمد عبد الله"
          value={form.fullName}
          onChange={(val: unknown) => setFormField('fullName', typeof val === 'string' ? val : '')}
          error={formErrors.fullName}
          required
        />

        <AppInput
          label="رقم الهاتف"
          placeholder="0912345678"
          type="tel"
          value={form.phone}
          onChange={(val: unknown) => setFormField('phone', typeof val === 'string' ? val : '')}
          error={formErrors.phone}
          required
        />

        {!isEdit && (
          <AppInput
            label="كلمة المرور"
            placeholder="8 محارف على الأقل"
            type="password"
            value={form.password || ''}
            onChange={(val: unknown) => setFormField('password', typeof val === 'string' ? val : '')}
            error={formErrors.password}
            required
          />
        )}

        <AppInput
          label="التخصص الأكاديمي"
          placeholder="مثال: لغة عربية، رياضيات، فيزياء..."
          value={form.specialization}
          onChange={(val: unknown) => setFormField('specialization', typeof val === 'string' ? val : '')}
        />

        <Switch
          label="حساب نشط"
          description="يمكن للمعلم تسجيل الدخول واستلام الحصص"
          checked={form.isActive}
          onChange={(event) => setFormField('isActive', event.currentTarget.checked)}
          mt="xs"
        />

        <Group justify="flex-end" mt="xl">
          <AppButton variant="outline" onClick={closeDrawer}>
            إلغاء
          </AppButton>
          <AppButton leftSection={<IconDeviceFloppy size={18} />} loading={isSubmitting} onClick={onSubmit}>
            {isEdit ? 'حفظ التعديلات' : 'إضافة المعلم'}
          </AppButton>
        </Group>
      </Stack>
    </Drawer>
  );
}
