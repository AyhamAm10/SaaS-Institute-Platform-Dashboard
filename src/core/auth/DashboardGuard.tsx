'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Center, Stack, Paper, Loader, Text, rem } from '@mantine/core';
import { useAuth } from './useAuth';

export interface DashboardGuardProps {
  children: ReactNode;
}

/**
 * Permanent protection layer at the dashboard layout level.
 *
 * Checks if the user is authenticated and has administrative privileges.
 * Redirects to /login if unauthenticated or unauthorized.
 */
export function DashboardGuard({ children }: DashboardGuardProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (!isAdmin) {
      // User is authenticated but is not an admin (e.g. TEACHER, STUDENT)
      logout().finally(() => {
        router.replace('/login?error=unauthorized_role');
      });
    }
  }, [isLoading, isAuthenticated, isAdmin, router, logout]);

  // Loading state matching Curved Organic theme
  if (isLoading) {
    return (
      <Center h="100vh" bg="var(--mantine-color-body)">
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
              جاري التحقق من صلاحيات الدخول...
            </Text>
          </Stack>
        </Paper>
      </Center>
    );
  }

  // If not authenticated or not an admin, keep showing loader while redirect finishes
  if (!isAuthenticated || !isAdmin) {
    return (
      <Center h="100vh" bg="var(--mantine-color-body)">
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
              غير مصرح بالدخول — جاري التحويل...
            </Text>
          </Stack>
        </Paper>
      </Center>
    );
  }

  return <>{children}</>;
}
