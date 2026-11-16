import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { Closure } from '@/src/core/api';
import {
  closureDays,
  closureFormFrom,
  closureStatus,
  closureTarget,
  EMPTY_CLOSURE_FORM,
  toClosurePayload,
  toggleId,
  validateClosureForm,
} from '../utils/closures.utils';
import { createClosuresStore } from '../store/closures.store';

const institute: Closure = {
  id: 1,
  scope: 'INSTITUTE',
  branchId: null,
  branchName: null,
  fromDate: '2026-11-10',
  toDate: '2026-11-12',
  reason: 'عطلة رسمية',
  sections: [],
};
const sections: Closure = {
  ...institute,
  id: 2,
  scope: 'SECTION',
  sections: [
    { id: 7, name: 'تاسع أ' },
    { id: 8, name: 'تاسع ب' },
  ],
};
const filled = { ...EMPTY_CLOSURE_FORM, reason: 'عيد', fromDate: '2026-11-10', toDate: '2026-11-12' };

describe('closure form', () => {
  it('needs a reason, both dates and a sensible range', () => {
    assert.deepStrictEqual(Object.keys(validateClosureForm(EMPTY_CLOSURE_FORM)).sort(), ['fromDate', 'reason', 'toDate']);
    assert.deepStrictEqual(validateClosureForm(filled), {});
    assert.ok(validateClosureForm({ ...filled, toDate: '2026-11-09' }).toDate);
  });

  it('asks for the branch or the sections the scope needs', () => {
    assert.ok(validateClosureForm({ ...filled, scope: 'BRANCH' }).branchId);
    assert.ok(validateClosureForm({ ...filled, scope: 'SECTION' }).sectionIds);
    assert.deepStrictEqual(validateClosureForm({ ...filled, scope: 'BRANCH', branchId: '4' }), {});
    assert.deepStrictEqual(validateClosureForm({ ...filled, scope: 'SECTION', sectionIds: [7] }), {});
  });

  it('sends only what the scope uses', () => {
    assert.deepStrictEqual(toClosurePayload({ ...filled, branchId: '4', sectionIds: [7] }), {
      scope: 'INSTITUTE',
      fromDate: '2026-11-10',
      toDate: '2026-11-12',
      reason: 'عيد',
    });
    assert.strictEqual(toClosurePayload({ ...filled, scope: 'BRANCH', branchId: '4' }).branchId, 4);
    assert.deepStrictEqual(toClosurePayload({ ...filled, scope: 'SECTION', sectionIds: [7, 8] }).sectionIds, [7, 8]);
  });

  it('rebuilds the form of an existing closure', () => {
    assert.deepStrictEqual(closureFormFrom(sections).sectionIds, [7, 8]);
    assert.strictEqual(closureFormFrom(institute).branchId, null);
  });

  it('toggles one section id without duplicates', () => {
    assert.deepStrictEqual(toggleId([7], 8), [7, 8]);
    assert.deepStrictEqual(toggleId([7, 8], 7), [8]);
  });
});

describe('closure display helpers', () => {
  it('tells ongoing, upcoming and past apart from today', () => {
    assert.strictEqual(closureStatus(institute, '2026-11-11'), 'ongoing');
    assert.strictEqual(closureStatus(institute, '2026-11-10'), 'ongoing');
    assert.strictEqual(closureStatus(institute, '2026-11-12'), 'ongoing');
    assert.strictEqual(closureStatus(institute, '2026-11-13'), 'past');
    assert.strictEqual(closureStatus(institute, '2026-11-09'), 'upcoming');
  });

  it('counts the days inclusively and names the target', () => {
    assert.strictEqual(closureDays(institute), 3);
    assert.strictEqual(closureDays({ fromDate: '2026-11-10', toDate: '2026-11-10' }), 1);
    assert.strictEqual(closureTarget(institute), 'كل المعهد');
    assert.strictEqual(closureTarget(sections), 'تاسع أ، تاسع ب');
    assert.strictEqual(closureTarget({ ...institute, scope: 'BRANCH', branchName: 'فرع المزة' }), 'فرع المزة');
  });
});

describe('closures store', () => {
  it('opens the drawer empty for a new closure and filled for an edit', () => {
    const store = createClosuresStore();
    store.getState().openCreate();
    assert.strictEqual(store.getState().drawerOpened, true);
    assert.deepStrictEqual(store.getState().form, EMPTY_CLOSURE_FORM);
    store.getState().openEdit(sections);
    assert.strictEqual(store.getState().editing?.id, 2);
    assert.deepStrictEqual(store.getState().form.sectionIds, [7, 8]);
  });

  it('keeps two instances isolated and clears a field error on edit', () => {
    const a = createClosuresStore();
    const b = createClosuresStore();
    a.getState().openDelete(institute);
    assert.strictEqual(b.getState().deleteTarget, null);
    a.getState().setFormErrors({ reason: 'x' });
    a.getState().setField('reason', 'عيد');
    assert.strictEqual(a.getState().formErrors.reason, '');
  });
});
