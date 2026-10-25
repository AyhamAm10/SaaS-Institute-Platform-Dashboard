'use client';

import {
  Alert,
  Divider,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers';
import { useTeacherRegistrationMirror } from '../store/useTeacherRegistrationMirror';

export function Step1BasicInfo() {
  const fullName = useTeacherRegistrationMirror('fullName');
  const phone = useTeacherRegistrationMirror('phone');
  const password = useTeacherRegistrationMirror('password');
  const specialization = useTeacherRegistrationMirror('specialization');
  const isActive = useTeacherRegistrationMirror('isActive');

  const setBasicField = useTeacherRegistrationMirror('setBasicField');
  const stepErrors = useTeacherRegistrationMirror('stepErrors');

  const error = stepErrors[0];

  return (
    <Stack gap="xl">
      <Stack gap={3}>
        <Text size="md" fw={700}>
          الخطوة الأولى: البيانات الأساسية وحساب المعلم
        </Text>
        <Text size="xs" c="dimmed">
          أدخل بيانات الهوية الشخصية ومعلومات الدخول للنظام (يتم التعيين تلقائياً للفرع المحدد في
          أعلى المنصة)
        </Text>
      </Stack>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      <Stack gap="lg">
        <Text size="sm" fw={700} c="primary.8">
          معلومات الحساب والتواصل
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <AppInput
            label="الاسم الكامل للمعلم"
            placeholder="مثال: أ. أحمد عبد الله"
            value={fullName}
            onChange={(val) =>
              setBasicField('fullName', typeof val === 'string' ? val : val?.target?.value ?? '')
            }
            required
          />

          <AppInput
            label="رقم الهاتف (اسم المستخدم)"
            placeholder="0912345678"
            type="tel"
            value={phone}
            onChange={(val) =>
              setBasicField('phone', typeof val === 'string' ? val : val?.target?.value ?? '')
            }
            required
          />

          <AppInput
            label="كلمة المرور"
            placeholder="أدخل كلمة مرور قوية (6 خانات على الأقل)"
            type="password"
            value={password}
            onChange={(val) =>
              setBasicField('password', typeof val === 'string' ? val : val?.target?.value ?? '')
            }
            required
          />

          <AppInput
            label="المسمى الأكاديمي / النبذة العامة"
            placeholder="مثال: ماجستير فيزياء، دكتوراه في الرياضيات..."
            value={specialization}
            onChange={(val) =>
              setBasicField(
                'specialization',
                typeof val === 'string' ? val : val?.target?.value ?? '',
              )
            }
          />
        </SimpleGrid>

        <Divider my="sm" />

        <Text size="sm" fw={700} c="primary.8">
          حالة الحساب
        </Text>

        <Stack justify="center" pt="xs">
          <Switch
            label="تفعيل حساب المعلم فور الإنشاء"
            description="يسمح للمعلم بتسجيل الدخول إلى حسابه واستلام الجدول والحصص"
            checked={isActive}
            onChange={(e) => setBasicField('isActive', e.currentTarget.checked)}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
