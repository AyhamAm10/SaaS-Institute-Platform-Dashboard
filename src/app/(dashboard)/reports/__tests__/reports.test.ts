import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { ReportDefinition } from '@/src/core/api';
import {
  filterCatalog,
  formFromSearch,
  groupCatalog,
  missingRequired,
  reportHref,
  reportPrintHref,
  toReportParams,
} from '../utils/reports.utils';
import { createReportWorkspaceStore } from '../[key]/store/report-workspace.store';

const def = (key: string, category: ReportDefinition['category'], params: ReportDefinition['params'] = []): ReportDefinition => ({
  key,
  category,
  title: `تقرير ${key}`,
  description: 'وصف',
  permission: 'fees.view',
  params,
});

const statement = def('student-statement', 'student', [{ kind: 'student', required: true }]);
const register = def('payments-register', 'finance', [
  { kind: 'from', required: false },
  { kind: 'to', required: false },
  { kind: 'currency', required: false },
]);

describe('reports catalog utils', () => {
  it('filters by text and category, groups in display order', () => {
    const catalog = [register, statement];
    assert.deepStrictEqual(filterCatalog(catalog, 'student', 'all').map((r) => r.key), ['student-statement']);
    assert.deepStrictEqual(filterCatalog(catalog, '', 'finance').map((r) => r.key), ['payments-register']);
    assert.deepStrictEqual(groupCatalog(catalog).map((g) => g.category), ['student', 'finance']);
  });
});

describe('report parameters', () => {
  it('form → params keeps only the report parameters, typed', () => {
    const params = toReportParams(register, { from: '2026-11-01', currency: 'USD', student: '5', to: '' });
    assert.deepStrictEqual(params, { from: '2026-11-01', currency: 'USD' });
    assert.deepStrictEqual(toReportParams(statement, { student: '7' }), { studentId: 7 });
    assert.deepStrictEqual(toReportParams(statement, { student: '0' }), {});
  });

  it('URL ↔ form round trip and links', () => {
    const form = formFromSearch(new URLSearchParams('studentId=7&from=2026-11-01&foo=1'));
    assert.deepStrictEqual(form, { student: '7', from: '2026-11-01' });
    assert.strictEqual(reportHref('student-statement', { studentId: 7 }), '/reports/student-statement?studentId=7');
    assert.strictEqual(reportHref('teacher-load'), '/reports/teacher-load');
    assert.strictEqual(reportPrintHref('daily-cashbox', {}), '/reports/daily-cashbox/print?autoprint=1');
    assert.strictEqual(
      reportPrintHref('section-roster', { sectionId: 3 }),
      '/reports/section-roster/print?sectionId=3&autoprint=1',
    );
  });

  it('missing required parameters', () => {
    assert.deepStrictEqual(missingRequired(statement, {}), ['student']);
    assert.deepStrictEqual(missingRequired(statement, { student: '4' }), []);
  });
});

describe('ReportWorkspaceStore', () => {
  it('refuses to submit without the required parameters, then submits typed params', () => {
    const store = createReportWorkspaceStore('student-statement', {});
    store.getState().syncDefinition(statement, false);
    store.getState().submit();
    assert.deepStrictEqual(store.getState().missing, ['student']);
    assert.strictEqual(store.getState().submitted, null);
    store.getState().setField('student', '9');
    assert.deepStrictEqual(store.getState().missing, []);
    store.getState().submit();
    assert.deepStrictEqual(store.getState().submitted, { studentId: 9 });
  });

  it('builds at once when opened with every parameter in the URL', () => {
    const store = createReportWorkspaceStore('student-statement', { student: '4' });
    store.getState().syncDefinition(statement, false);
    assert.deepStrictEqual(store.getState().submitted, { studentId: 4 });
  });

  it('a report without prefill waits for the user; a new section clears the exam', () => {
    const store = createReportWorkspaceStore('payments-register', {});
    store.getState().syncDefinition(register, false);
    assert.strictEqual(store.getState().submitted, null);
    store.getState().setField('exam', '3');
    store.getState().setField('section', '2');
    assert.strictEqual(store.getState().form.exam, null);
  });
});
