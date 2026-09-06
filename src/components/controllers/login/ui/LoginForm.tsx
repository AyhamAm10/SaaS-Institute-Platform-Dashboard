'use client';

import React from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
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

export function LoginForm() {
  const phone = useLoginMirror('phone');
  const setPhone = useLoginMirror('setPhone');
  const password = useLoginMirror('password');
  const setPassword = useLoginMirror('setPassword');
  const errorMessage = useLoginMirror('errorMessage');
  const isSubmitting = useLoginMirror('isSubmitting');
  const submit = useLoginMirror('submit');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <Paper
      p={{ base: 'xl', sm: rem(40) }}
      radius={28}
      withBorder
      style={{
        width: '100%',
        maxWidth: rem(450),
        borderColor: 'rgba(0, 0, 0, 0.06)',
        boxShadow: '0 20px 50px rgba(11, 27, 46, 0.06), 0 1px 3px rgba(0, 0, 0, 0.02)',
        backgroundColor: '#ffffff',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {/* Title */}
          <Box ta="center" mb={rem(4)}>
            <Title
              order={1}
              fw={800}
              size={rem(28)}
              style={{ color: '#0a1128', letterSpacing: '-0.5px' }}
            >
              تسجيل الدخول
            </Title>
            <Text size="sm" c="dimmed" mt={rem(4)} fw={500}>
              أدخل بيانات حسابك للوصول إلى لوحة الإدارة
            </Text>
          </Box>

          {/* Error alert if any */}
          {errorMessage && (
            <Alert
              icon={<IconAlertCircle size={18} />}
              title="تنبيه"
              color="red"
              radius="md"
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
          </Stack>

          {/* Submit Button (Deep Navy matching the mockup) */}
          <Button
            type="submit"
            size="md"
            loading={isSubmitting}
            rightSection={!isSubmitting ? <IconArrowLeft size={18} /> : undefined}
            fullWidth
            style={{
              height: rem(48),
              borderRadius: rem(14),
              backgroundColor: '#0a1128',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: rem(14.5),
              boxShadow: '0 4px 14px rgba(10, 17, 40, 0.25)',
              transition: 'all 150ms ease',
            }}
          >
            {isSubmitting ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
