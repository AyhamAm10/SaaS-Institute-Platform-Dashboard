import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createDataModuleStore } from '../store/data-module.store';

describe('DataModuleController — Architecture & State Isolation', () => {
  describe('Store Isolation & Initialization', () => {
    it('initializes store with provided props', () => {
      const store = createDataModuleStore({
        title: 'السنوات الدراسية',
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
      });

      const state = store.getState();
      assert.strictEqual(state.title, 'السنوات الدراسية');
      assert.strictEqual(state.total, 25);
      assert.strictEqual(state.page, 2);
      assert.strictEqual(state.limit, 10);
      assert.strictEqual(state.totalPages, 3);
    });

    it('guarantees complete state isolation between multiple controller instances (role.md Section 3)', () => {
      const storeA = createDataModuleStore({ title: 'Module A', page: 1 });
      const storeB = createDataModuleStore({ title: 'Module B', page: 5 });

      storeA.getState().setSearch('بحث أ');
      storeA.getState().setPage(3);

      assert.strictEqual(storeA.getState().page, 3);
      assert.strictEqual(storeA.getState().search, 'بحث أ');

      // Store B must remain completely unaffected
      assert.strictEqual(storeB.getState().page, 5);
      assert.strictEqual(storeB.getState().search, '');
    });
  });

  describe('Pagination & Search Domain Logic', () => {
    it('triggers external callbacks and updates state on page change', () => {
      let callbackPage = 0;
      const store = createDataModuleStore({
        onPageChange: (p) => {
          callbackPage = p;
        },
      });

      store.getState().setPage(4);
      assert.strictEqual(store.getState().page, 4);
      assert.strictEqual(callbackPage, 4);
    });

    it('resets page to 1 when search or limit changes', () => {
      const store = createDataModuleStore({ page: 3, limit: 10 });

      store.getState().setLimit(25);
      assert.strictEqual(store.getState().limit, 25);
      assert.strictEqual(store.getState().page, 1);

      store.getState().setPage(4);
      store.getState().setSearch('test');
      assert.strictEqual(store.getState().search, 'test');
      assert.strictEqual(store.getState().page, 1);
    });

    it('clears all filters and resets search on resetFilters', () => {
      let filterPayload: Record<string, unknown> = {};
      const store = createDataModuleStore({
        onFilterChange: (f) => {
          filterPayload = f;
        },
      });

      store.getState().setFilter('grade', 'Grade 1');
      store.getState().setSearch('شعبة');
      assert.strictEqual(store.getState().filters['grade'], 'Grade 1');
      assert.strictEqual(store.getState().search, 'شعبة');

      store.getState().resetFilters();
      assert.deepStrictEqual(store.getState().filters, {});
      assert.strictEqual(store.getState().search, '');
      assert.deepStrictEqual(filterPayload, {});
    });
  });

  describe('Sorting & Selection', () => {
    it('cycles sort direction: asc -> desc -> null', () => {
      const store = createDataModuleStore();

      store.getState().setSort('name');
      assert.strictEqual(store.getState().sort.column, 'name');
      assert.strictEqual(store.getState().sort.direction, 'asc');

      store.getState().setSort('name');
      assert.strictEqual(store.getState().sort.column, 'name');
      assert.strictEqual(store.getState().sort.direction, 'desc');

      store.getState().setSort('name');
      assert.strictEqual(store.getState().sort.column, null);
      assert.strictEqual(store.getState().sort.direction, null);
    });

    it('toggles row selection correctly', () => {
      const store = createDataModuleStore();

      store.getState().toggleRowSelection(101);
      assert.deepStrictEqual(store.getState().selectedIds, [101]);

      store.getState().toggleRowSelection(102);
      assert.deepStrictEqual(store.getState().selectedIds, [101, 102]);

      store.getState().toggleRowSelection(101);
      assert.deepStrictEqual(store.getState().selectedIds, [102]);

      store.getState().clearRowSelection();
      assert.deepStrictEqual(store.getState().selectedIds, []);
    });
  });
});
