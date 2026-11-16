'use client';

import { Alert, Box, Paper, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconLock } from '@tabler/icons-react';
import { AppButton } from '../../button';
import { AppInput } from '../../input';
import { passwordChangeLabels as labels } from '../init/password-change.init';
import { usePasswordChangeMirror } from '../store/password-change.store';
import { inputText } from '@/src/core/format';

/** Full-screen first step on a default password. ZERO useState hooks. */
export function PasswordChangeView() {
  const current = usePasswordChangeMirror('currentPassword');
  const next = usePasswordChangeMirror('newPassword');
  const confirm = usePasswordChangeMirror('confirmPassword');
  const error = usePasswordChangeMirror('errorMessage');
  const isSubmitting = usePasswordChangeMirror('isSubmitting');
  const setCurrent = usePasswordChangeMirror('setCurrentPassword');
  const setNext = usePasswordChangeMirror('setNewPassword');
  const setConfirm = usePasswordChangeMirror('setConfirmPassword');
  const submit = usePasswordChangeMirror('submit');

  return (
    <Box mih="100vh" bg="var(--app-bg)" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Paper
        component="form"
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          void submit();
        }}
        w="100%"
        maw={440}
        p="xl"
        radius="lg"
        withBorder
      >
        <Stack gap="md">
          <Stack gap={4} align="center">
            <IconLock size={28} />
            <Title order={3}>{labels.title}</Title>
            <Text size="sm" c="var(--app-text-muted)" ta="center">
              {labels.description}
            </Text>
          </Stack>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          <AppInput type="password" label={labels.current} value={current} onChange={(e: unknown) => setCurrent(inputText(e))} required />
          <AppInput type="password" label={labels.next} value={next} onChange={(e: unknown) => setNext(inputText(e))} required />
          <AppInput type="password" label={labels.confirm} value={confirm} onChange={(e: unknown) => setConfirm(inputText(e))} required />
          <AppButton type="submit" loading={isSubmitting} fullWidth>
            {labels.submit}
          </AppButton>
        </Stack>
      </Paper>
    </Box>
  );
}
