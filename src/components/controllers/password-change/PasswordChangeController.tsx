'use client';

import { ReactNode, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AUTH_QUERY_KEY, useAuth } from '@/src/core/auth';
import { createPasswordChangeStore, PasswordChangeContext } from './store/password-change.store';
import { PasswordChangeView } from './ui/PasswordChangeView';

/** The forced first step: the user picks a password of their own, then the session continues. */
export function PasswordChangeController() {
  const queryClient = useQueryClient();
  const [store] = useState(() =>
    createPasswordChangeStore({ onSuccess: () => queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY }) }),
  );
  return (
    <PasswordChangeContext.Provider value={store}>
      <PasswordChangeView />
    </PasswordChangeContext.Provider>
  );
}

/**
 * Wraps the dashboard: while the signed-in user is still on the default
 * password only the password change is shown (the server refuses every other
 * request until it is done).
 */
export function PasswordChangeGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.mustChangePassword) return <PasswordChangeController />;
  return <>{children}</>;
}
