import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { QueryClient } from '@tanstack/react-query';
import { useOperationalContextStore } from '../operational-context';
import { CONTEXT_FREE_QUERY_PREFIXES, clearContextQueries, isContextFreeQuery } from '../context-cache';

/** Minimal localStorage for node tests. */
function installStorage(): Map<string, string> {
  const data = new Map<string, string>();
  const storage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
  Object.assign(globalThis, { window: globalThis, localStorage: storage });
  return data;
}

describe('operational context store', () => {
  let data: Map<string, string>;
  beforeEach(() => {
    data = installStorage();
    useOperationalContextStore.getState().resetContext();
  });

  it('remembers the context per institute + user', () => {
    const store = useOperationalContextStore.getState();
    store.bindIdentity(3, 6);
    store.setActiveBranchId(2);
    store.setActiveAcademicYearId(9);
    assert.strictEqual(data.get('saas_ctx:3:6:branch'), '2');
    assert.strictEqual(data.get('saas_ctx:3:6:year'), '9');

    // Another account in the same browser does not inherit it
    useOperationalContextStore.getState().bindIdentity(5, 1);
    assert.strictEqual(useOperationalContextStore.getState().activeBranchId, null);
    assert.strictEqual(useOperationalContextStore.getState().activeAcademicYearId, null);

    // Coming back restores it, unresolved until validated again
    useOperationalContextStore.getState().bindIdentity(3, 6);
    const back = useOperationalContextStore.getState();
    assert.deepStrictEqual([back.activeBranchId, back.activeAcademicYearId, back.resolved], [2, 9, false]);
  });

  it('drops the legacy browser-wide keys', () => {
    data.set('saas_active_branch_id', '77');
    useOperationalContextStore.getState().bindIdentity(3, 6);
    assert.strictEqual(data.has('saas_active_branch_id'), false);
    assert.strictEqual(useOperationalContextStore.getState().activeBranchId, null);
  });

  it('reset forgets the account and the resolution', () => {
    const store = useOperationalContextStore.getState();
    store.bindIdentity(3, 6);
    store.markResolved();
    store.resetContext();
    const after = useOperationalContextStore.getState();
    assert.deepStrictEqual([after.identity, after.resolved], [null, false]);
  });
});

describe('context cache', () => {
  it('knows the context-free queries', () => {
    assert.ok(isContextFreeQuery(['branches', 'list']));
    assert.ok(isContextFreeQuery(['reports', 'catalog']));
    assert.ok(!isContextFreeQuery(['reports', 'document', 'daily-cashbox']));
    assert.ok(!isContextFreeQuery(['students', 'list', {}]));
    assert.ok(CONTEXT_FREE_QUERY_PREFIXES.every((p) => p.length > 0));
  });

  it('resets context-dependent queries and keeps the context-free ones', async () => {
    const client = new QueryClient();
    client.setQueryData(['students', 'list'], [1]);
    client.setQueryData(['branches', 'list'], [2]);
    await clearContextQueries(client);
    assert.strictEqual(client.getQueryData(['students', 'list']), undefined);
    assert.deepStrictEqual(client.getQueryData(['branches', 'list']), [2]);
  });
});
