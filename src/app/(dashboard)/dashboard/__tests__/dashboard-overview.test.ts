import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { DashboardOverview } from '@/src/core/api';
import {
  collectionDatasets,
  monthName,
  nonEmptySegments,
  overdueSummary,
  percentText,
  todaySegments,
  weekBars,
} from '../utils/dashboard-overview.utils';
import { createDashboardStore } from '../store/dashboard.store';

describe('dashboard overview mapping', () => {
  it('maps the attendance week to bars with weekday names and tooltips', () => {
    const bars = weekBars([
      { date: '2026-11-04', dayOfWeek: 3, attended: 4, recorded: 8, rate: 50 },
      { date: '2026-11-05', dayOfWeek: 4, attended: 0, recorded: 0, rate: null },
    ]);
    assert.deepStrictEqual(
      bars.map((b) => [b.label, b.value]),
      [
        ['الأربعاء 4', 50],
        ['الخميس 5', 0],
      ],
    );
    assert.match(bars[0].tooltipBadge ?? '', /50% \(4 من 8\)/);
    assert.match(bars[1].tooltipBadge ?? '', /لا سجلات/);
  });

  it('keeps every status segment in a fixed order', () => {
    const segments = todaySegments({ present: 3, late: 1, absent: 2, excused: 0, notRecorded: 4, rate: 40 });
    assert.deepStrictEqual(
      segments.map((s) => s.value),
      [3, 1, 2, 0, 4],
    );
  });

  it('builds one collections dataset per currency (never mixed)', () => {
    const datasets = collectionDatasets([
      { month: '2026-10', currency: 'SYP', amount: 0 },
      { month: '2026-11', currency: 'SYP', amount: 1500000 },
      { month: '2026-11', currency: 'USD', amount: 25 },
    ]);
    assert.deepStrictEqual(Object.keys(datasets), ['الليرة السورية', 'الدولار']);
    assert.deepStrictEqual(
      datasets['الليرة السورية'].map((p) => p.value),
      [0, 1500000],
    );
    assert.strictEqual(datasets['الدولار'][0].label, monthName('2026-11'));
  });

  it('summarizes the overdue KPI from the first currency with overdue', () => {
    const summary = overdueSummary([
      { currency: 'SYP', collectedThisMonth: 0, remaining: 100, overdue: 0, overdueInstallments: 0 },
      { currency: 'USD', collectedThisMonth: 0, remaining: 30, overdue: 20, overdueInstallments: 2 },
    ] as DashboardOverview['finance']['currencies']);
    assert.match(summary.figure, /\$$/);
    assert.strictEqual(summary.installments, 2);
    assert.strictEqual(overdueSummary([]).figure, '0');
  });

  it('formats a missing percentage as a dash', () => {
    assert.strictEqual(percentText(null), '—');
    assert.strictEqual(percentText(66.7), '66.7%');
  });
});

describe('DashboardStore', () => {
  it('syncs the overview from the query', () => {
    const store = createDashboardStore();
    assert.strictEqual(store.getState().isLoading, true);
    store.getState().syncOverview(null, false);
    assert.strictEqual(store.getState().isLoading, false);
  });
});

describe('circle segments', () => {
  it('drops empty segments so no stray dot is drawn', () => {
    const segments = todaySegments({ present: 1, late: 0, absent: 0, excused: 0, notRecorded: 0, rate: 100 });
    assert.deepStrictEqual(
      nonEmptySegments(segments).map((s) => s.value),
      [1],
    );
  });
});
