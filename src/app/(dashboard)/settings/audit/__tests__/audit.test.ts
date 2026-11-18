import { describe, it } from 'node:test';
import assert from 'node:assert';
import { entityHref, formatWhen } from '../utils/audit.utils';
import { AUDIT_ENTITY_LABELS } from '../static-data/audit.data';

describe('audit viewer helpers', () => {
  it('links records that have a page and leaves the others plain', () => {
    assert.equal(entityHref('student', 4), '/students/4');
    assert.equal(entityHref('payment', 9), '/payments/9');
    assert.equal(entityHref('studentSubscription', 2), '/contracts/2');
    assert.equal(entityHref('dailyAttendance', 1), null);
  });

  it('shows the time in the institute zone', () => {
    // 21:30Z is 00:30 the next day in Damascus (UTC+3)
    assert.match(formatWhen('2026-11-09T21:30:00.000Z', 'Asia/Damascus'), /00:30/);
    assert.equal(formatWhen('not a date'), '');
  });

  it('names every audited model in Arabic', () => {
    for (const model of ['student', 'family', 'payment', 'studentNote', 'dailyAttendance', 'examResult']) {
      assert.ok(AUDIT_ENTITY_LABELS[model]);
    }
  });
});
