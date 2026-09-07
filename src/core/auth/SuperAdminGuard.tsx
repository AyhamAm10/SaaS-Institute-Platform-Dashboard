'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Center, Stack, Paper, Loader, Text } from '@mantine/core';
import { useAuth } from './useAuth';
import { UserRole } from '../api/types';

export interface SuperAdminGuardProps {
  children: ReactNode;
}

/**
 * SuperAdminGuard
 *
 * Dedicated protection layer for Super Admin routes.
 * Ensures that only users with the SUPER_ADMIN role can access this page/flow.
 * Normal INSTITUTE_ADMIN or non-super-admins are redirected back to the root dashboard.
 */
export function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  const isSuperAdmin =
    user?.role === UserRole.SUPER_ADMIN || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!isSuperAdmin) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, isSuperAdmin, router]);

  if (isLoading) {
    return (
      <Center h="50vh" bg="transparent">
        <Paper
          p="xl"
          radius="xl"
          withBorder
          style={{
            borderColor: 'var(--mantine-color-gray-2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Stack align="center" gap="md">
            <Loader size="md" color="primary.6" />
            <Text size="sm" fw={600} c="dimmed">
              جاري التحقق من صلاحيات المشرف العام...
            </Text>
          </Stack>
        </Paper>
      </Center>
    );
  }

  if (!isAuthenticated || !isSuperAdmin) {
    return (
      <Center h="50vh" bg="transparent">
        <Paper
          p="xl"
          radius="xl"
          withBorder
          style={{
            borderColor: 'var(--mantine-color-gray-2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Stack align="center" gap="xs">
            <Loader size="sm" color="red.6" />
            <Text size="sm" fw={600} c="red.6">
              غير مصرح بالدخول لهذه الصفحة — جاري التحويل...
            </Text>
          </Stack>
        </Paper>
      </Center>
    );
  }

  return <>{children}</>;
}
