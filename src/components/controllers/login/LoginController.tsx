'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Center, Loader } from '@mantine/core';
import { LoginInitialProps } from './state/login.state';
import { createLoginStore, LoginContext } from './store/login.store';
import { LoginView } from './ui/LoginView';
import { useAuth, AUTH_QUERY_KEY } from '@/src/core/auth';

export interface LoginControllerProps extends LoginInitialProps {}

/**
 * LoginController
 *
 * Owns the authentication state, store, and responsive visual composition of the Login page.
 * Strictly adheres to the Controller Component Pattern (role.md).
 */
export function LoginController(props: LoginControllerProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  const [store] = useState(() =>
    createLoginStore({
      ...props,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
        router.replace('/');
      },
    }),
  );

  // If already authenticated as administrator, seamlessly navigate to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  // While initial authentication check or redirect is active, render loading indicator
  if (isLoading || (isAuthenticated && isAdmin)) {
    return (
      <Center h="100vh" bg="var(--mantine-color-body)">
        <Loader size="md" color="primary.6" />
      </Center>
    );
  }

  return (
    <LoginContext.Provider value={store}>
      <LoginView />
    </LoginContext.Provider>
  );
}
