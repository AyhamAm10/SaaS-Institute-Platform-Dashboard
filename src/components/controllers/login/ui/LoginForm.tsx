'use client';

import React from 'react';
import {
  Alert,
  Box,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowLeft,
} from '@tabler/icons-react';
import { useLoginMirror } from '../store/useLoginMirror';
import { AppInput } from '@/src/components/controllers/input';
import { AppButton } from '../../button';
import { AppSurface } from '../../surface';
import { BrandMark } from '../../sidebar/ui/shared/SidebarBrand';

export function LoginForm() {
  const phone = useLoginMirror('phone');
  const setPhone = useLoginMirror('setPhone');
  const password = useLoginMirror('password');
  const setPassword = useLoginMirror('setPassword');
  const instituteCode = useLoginMirror('instituteCode');
  const setInstituteCode = useLoginMirror('setInstituteCode');
  const errorMessage = useLoginMirror('errorMessage');
  const isSubmitting = useLoginMirror('isSubmitting');
  const submit = useLoginMirror('submit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <AppSurface
      level={3}
      radius="xl"
      padding={{ base: 'xl', sm: rem(40) }}
      style={{ width: '100%', maxWidth: rem(440) }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {/* Title */}
          <Box mb={rem(4)}>
            <Box hiddenFrom="md" mb="lg">
              <BrandMark size={56} />
            </Box>
            <Title order={1} fw={600} size={rem(28)} style={{ letterSpacing: '-0.01em' }}>
              أهلا بعودتك
            </Title>
            <Text size="sm" fw={300} c="var(--app-text-secondary)" mt={rem(6)}>
              أدخل بيانات حسابك للوصول إلى لوحة الإدارة
            </Text>
          </Box>

          {/* Error alert if any */}
          {errorMessage && (
            <Alert
              icon={<IconAlertCircle size={18} />}
              title="تنبيه"
              color="danger"
              radius="lg"
              variant="light"
            >
              {errorMessage}
            </Alert>
          )}

          {/* Form Fields using unified AppInput with rounded rectangle look */}
          <Stack gap="md">
            <AppInput
              type="tel"
              required
              label="رقم الجوال المسجل"
              placeholder="+9665xxxxxxxx"
              value={phone}
              onChange={(e) =>
                setPhone(
                  typeof e === 'string'
                    ? e
                    : (e as React.ChangeEvent<HTMLInputElement>).currentTarget.value,
                )
              }
              disabled={isSubmitting}
            />

            <AppInput
              type="password"
              required
              label="كلمة المرور"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(
                  typeof e === 'string'
                    ? e
                    : (e as React.ChangeEvent<HTMLInputElement>).currentTarget.value,
                )
              }
              disabled={isSubmitting}
            />

            <AppInput
              label="كود المعهد (اختياري)"
              description="مطلوب فقط إذا كان رقمك مسجلاً في أكثر من معهد"
              placeholder="INS0002"
              value={instituteCode}
              onChange={(e) =>
                setInstituteCode(
                  typeof e === 'string'
                    ? e
                    : (e as React.ChangeEvent<HTMLInputElement>).currentTarget.value,
                )
              }
              disabled={isSubmitting}
            />
          </Stack>

          {/* Submit: ink primary button */}
          <AppButton
            type="submit"
            size="md"
            loading={isSubmitting}
            rightSection={!isSubmitting ? <IconArrowLeft size={18} /> : undefined}
            fullWidth
            style={{ height: rem(50), fontSize: rem(14.5) }}
          >
            {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </AppButton>
        </Stack>
      </form>
    </AppSurface>
  );
}
