'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth.api';
import { LoginCredentials, UserProfile, UserRole } from '../api/types';
import { canUseDashboard, hasPermission, Permission } from './permissions';
import { useOperationalContextStore } from '../context/operational-context';

export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

/**
 * Check whether a user has administrative privileges.
 */
export function isUserAdmin(user: UserProfile | null | undefined): boolean {
  if (!user || !user.role) return false;
  return (
    user.role === UserRole.SUPER_ADMIN ||
    user.role === UserRole.INSTITUTE_ADMIN ||
    user.role === 'SUPER_ADMIN' ||
    user.role === 'INSTITUTE_ADMIN'
  );
}

/**
 * Hook to retrieve the current authenticated user profile.
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authApi.getMe(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

/**
 * Comprehensive authentication hook for components.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      router.replace('/');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      useOperationalContextStore.getState().resetContext();
      router.replace('/login');
    },
    onError: () => {
      // Even if backend fails, clear client state
      queryClient.clear();
      useOperationalContextStore.getState().resetContext();
      router.replace('/login');
    },
  });

  const adminStatus = isUserAdmin(user);
  const can = (permission: Permission) => hasPermission(user, permission);

  return {
    user: user ?? null,
    isLoading,
    isError,
    error,
    isAuthenticated: Boolean(user),
    isAdmin: adminStatus,
    /** Staff and teachers: may use the admin dashboard (pages filtered by `can`). */
    canUseDashboard: canUseDashboard(user),
    can,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    refetchUser: refetch,
  };
}
