import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createSupervisionStore } from '../store/supervision.store';
import { dayBadge, daysBetween } from '../utils/supervision.utils';

describe('supervision page logic', () => {
  it('counts whole calendar days, across month and year ends', () => {
    assert.strictEqual(daysBetween('2026-11-20', '2026-11-20'), 0);
    assert.strictEqual(daysBetween('2026-11-30', '2026-12-01'), 1);
    assert.strictEqual(daysBetween('2026-12-31', '2027-01-02'), 2);
    assert.strictEqual(daysBetween('2026-11-25', '2026-11-20'), -5);
  });

  it('marks only today and tomorrow, relative to the institute day', () => {
    assert.deepStrictEqual(dayBadge('2026-11-24', '2026-11-24'), { label: 'اليوم', tone: 'danger' });
    assert.deepStrictEqual(dayBadge('2026-11-25', '2026-11-24'), { label: 'غداً', tone: 'warning' });
    assert.strictEqual(dayBadge('2026-11-26', '2026-11-24'), null);
    assert.strictEqual(dayBadge('2026-11-25', ''), null); // before the server answers
  });

  it('keeps what the server sent: its today and the list', () => {
    const store = createSupervisionStore();
    assert.strictEqual(store.getState().isLoading, true);
    store.getState().syncQueryData({ today: '2026-11-20', data: [], isLoading: false });
    assert.deepStrictEqual([store.getState().today, store.getState().isLoading], ['2026-11-20', false]);
  });
});
