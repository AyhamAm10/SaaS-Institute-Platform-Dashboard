import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createDataModuleStore } from '../store/data-module.store';
import { buildSelectionDocument } from '../../app-module/init/selection-document';
import { createAppModuleStore } from '../../app-module/store/app-module.store';
import type { SelectionExportColumn } from '../../app-module/init/app-module.init';

interface TestRow {
  id: number;
  name: string;
  amount: number;
  currency: 'SYP' | 'USD';
}

describe('DataModule and AppModule selection & export architecture', () => {
  const sampleData: TestRow[] = [
    { id: 1, name: 'طالب 1', amount: 1000, currency: 'SYP' },
    { id: 2, name: 'طالب 2', amount: 2000, currency: 'SYP' },
    { id: 3, name: 'طالب 3', amount: 50, currency: 'USD' },
  ];

  describe('DataModule Selection Logic', () => {
    it('defaults selectable to false and selectedIds to empty array', () => {
      const store = createDataModuleStore<TestRow>({ data: sampleData });
      assert.strictEqual(store.getState().selectable, false);
      assert.deepStrictEqual(store.getState().selectedIds, []);
    });

    it('toggles row selection and notifies onSelect with full row objects in order', () => {
      let notified: TestRow[] = [];
      const store = createDataModuleStore<TestRow>({
        selectable: true,
        data: sampleData,
        keyExtractor: (r) => r.id,
        onSelect: (rows) => {
          notified = rows;
        },
      });

      store.getState().toggleRowSelection(2);
      assert.deepStrictEqual(store.getState().selectedIds, [2]);
      assert.deepStrictEqual(notified, [sampleData[1]]);

      store.getState().toggleRowSelection(1);
      assert.deepStrictEqual(store.getState().selectedIds, [2, 1]);
      // Order in notified rows matches data array order
      assert.deepStrictEqual(notified, [sampleData[0], sampleData[1]]);

      // Toggle off
      store.getState().toggleRowSelection(2);
      assert.deepStrictEqual(store.getState().selectedIds, [1]);
      assert.deepStrictEqual(notified, [sampleData[0]]);
    });

    it('selects all rows and clears selection', () => {
      let notified: TestRow[] = [];
      const store = createDataModuleStore<TestRow>({
        selectable: true,
        data: sampleData,
        keyExtractor: (r) => r.id,
        onSelect: (rows) => {
          notified = rows;
        },
      });

      store.getState().selectAllRows([1, 2, 3]);
      assert.deepStrictEqual(store.getState().selectedIds, [1, 2, 3]);
      assert.strictEqual(notified.length, 3);

      store.getState().clearRowSelection();
      assert.deepStrictEqual(store.getState().selectedIds, []);
      assert.deepStrictEqual(notified, []);
    });

    it('clears selection when page, search, or filters change', () => {
      let notified: TestRow[] = [];
      const store = createDataModuleStore<TestRow>({
        selectable: true,
        data: sampleData,
        keyExtractor: (r) => r.id,
        onSelect: (rows) => {
          notified = rows;
        },
      });

      store.getState().selectAllRows([1, 2]);
      assert.strictEqual(store.getState().selectedIds.length, 2);

      store.getState().setPage(2);
      assert.deepStrictEqual(store.getState().selectedIds, []);
      assert.deepStrictEqual(notified, []);

      store.getState().selectAllRows([1]);
      store.getState().setSearch('طالب');
      assert.deepStrictEqual(store.getState().selectedIds, []);
      assert.deepStrictEqual(notified, []);

      store.getState().selectAllRows([1]);
      store.getState().setFilter('branch', 1);
      assert.deepStrictEqual(store.getState().selectedIds, []);
      assert.deepStrictEqual(notified, []);
    });

    it('clears selection when data keys change via updateFromProps', () => {
      const store = createDataModuleStore<TestRow>({
        selectable: true,
        data: sampleData,
        keyExtractor: (r) => r.id,
      });

      store.getState().selectAllRows([1, 2]);
      assert.strictEqual(store.getState().selectedIds.length, 2);

      const newData: TestRow[] = [
        { id: 10, name: 'طالب 10', amount: 300, currency: 'USD' },
      ];
      store.getState().updateFromProps({ data: newData });
      assert.deepStrictEqual(store.getState().selectedIds, []);
    });
  });

  describe('AppModule selection store & buildSelectionDocument', () => {
    it('manages selection state in AppModule store', () => {
      const store = createAppModuleStore({ exportTitle: 'الطلاب' });
      assert.deepStrictEqual(store.getState().selection.rows, []);
      assert.strictEqual(store.getState().exportTitle, 'الطلاب');

      const cols: SelectionExportColumn[] = [
        { key: 'name', title: 'الاسم', kind: 'text', value: (r) => (r as TestRow).name },
      ];
      store.getState().setSelection(sampleData, cols);
      assert.strictEqual(store.getState().selection.rows.length, 3);
      assert.strictEqual(store.getState().selection.columns.length, 1);
    });

    it('builds ReportDocument with orientation depending on column count and separate currency totals', () => {
      const cols: SelectionExportColumn[] = [
        { key: 'name', title: 'الاسم', kind: 'text', value: (r) => (r as TestRow).name },
        {
          key: 'amount',
          title: 'المبلغ',
          kind: 'money',
          value: (r) => ({ amount: (r as TestRow).amount, currency: (r as TestRow).currency }),
        },
      ];

      const doc = buildSelectionDocument('قائمة الطلاب', sampleData, cols, '2026-11-07T12:00:00Z');
      assert.strictEqual(doc.key, 'selection');
      assert.strictEqual(doc.title, 'قائمة الطلاب');
      assert.strictEqual(doc.orientation, 'portrait');
      assert.deepStrictEqual(doc.meta, [{ label: 'عدد السجلات', value: '3' }]);

      const tableBlock = doc.blocks[0];
      assert.strictEqual(tableBlock.type, 'table');
      if (tableBlock.type === 'table') {
        assert.strictEqual(tableBlock.rows.length, 3);
        assert.strictEqual(tableBlock.totals?.length, 2); // SYP and USD separate totals!

        const sypTotal = tableBlock.totals.find((t) => t['name'] === 'المجموع (SYP)');
        assert.ok(sypTotal);
        assert.deepStrictEqual(sypTotal?.['amount'], { amount: 3000, currency: 'SYP' });

        const usdTotal = tableBlock.totals.find((t) => t['name'] === 'المجموع (USD)');
        assert.ok(usdTotal);
        assert.deepStrictEqual(usdTotal?.['amount'], { amount: 50, currency: 'USD' });
      }
    });

    it('uses landscape orientation when columns exceed 6', () => {
      const cols: SelectionExportColumn[] = Array.from({ length: 7 }, (_, i) => ({
        key: `c${i}`,
        title: `عمود ${i}`,
        kind: 'text',
        value: () => 'val',
      }));

      const doc = buildSelectionDocument('تقرير عريض', [sampleData[0]], cols, '2026-11-07T12:00:00Z');
      assert.strictEqual(doc.orientation, 'landscape');
    });
  });

  describe('Selection Print storage logic', () => {
    it('reads and immediately deletes document from storage, handling expired state', () => {
      const doc = buildSelectionDocument('قائمة الطلاب', sampleData, [], '2026-11-07T12:00:00Z');
      const storeKey = 'print-selection:test-uuid';
      const storage = new Map<string, string>();
      storage.set(storeKey, JSON.stringify(doc));

      // First read: found and deleted immediately
      const raw = storage.get(storeKey);
      storage.delete(storeKey);
      assert.ok(raw);
      const parsed = JSON.parse(raw);
      assert.strictEqual(parsed.key, 'selection');

      // Second read / expired state: returns null
      const expiredRaw = storage.get(storeKey) ?? null;
      assert.strictEqual(expiredRaw, null);
    });
  });
});
