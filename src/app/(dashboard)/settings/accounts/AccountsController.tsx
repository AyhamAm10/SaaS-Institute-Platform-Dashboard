'use client';

import { useState } from 'react';
import { useAuth } from '@/src/core/auth';
import { AccountsQuerySync } from './AccountsQuerySync';
import { AccountsContext, createAccountsStore } from './store/accounts.store';
import { useAccountsActions } from './useAccountsActions';
import { AccountsView } from './ui/AccountsView';

/**
 * AccountsController
 *
 * "إدارة الحسابات": one screen, a sub-tab per account type (staff, teachers,
 * families, students), each with reset-to-default-password and
 * activate / deactivate. Accounts are created automatically with the person
 * (the default password is 12345678); only staff and student accounts have a
 * create button because they are not created anywhere else. Owns its isolated
 * store (role.md §3).
 */
export function AccountsController() {
  const [store] = useState(createAccountsStore);
  const currentUserId = useAuth().user?.id ?? null;
  const actions = useAccountsActions(store, currentUserId);

  return (
    <AccountsContext.Provider value={store}>
      <AccountsQuerySync store={store} />
      <AccountsView {...actions} currentUserId={currentUserId} />
    </AccountsContext.Provider>
  );
}
