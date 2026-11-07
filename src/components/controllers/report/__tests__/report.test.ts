import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  columnPercents,
  formatReportCell,
  inferKind,
  isLtrKind,
  pageCss,
} from '../init/report.format';
import { resolveReportConfig, resolveTone, withAlpha } from '../init/report.init';
import { reportLink } from '../init/report-link';
import type { ReportDocument } from '@/src/core/api';

const doc = (verification?: ReportDocument['verification']): ReportDocument => ({
  key: 'student-statement',
  title: 'كشف',
  orientation: 'portrait',
  meta: [],
  blocks: [],
  generatedAt: '2026-11-07T10:00:00.000Z',
  generatedBy: null,
  verification,
});

describe('report cell formatting', () => {
  it('formats each kind', () => {
    assert.match(formatReportCell({ amount: 1500000, currency: 'SYP' }, 'money'), /1,500,000 ل\.س/);
    assert.match(formatReportCell({ amount: 12.5, currency: 'USD' }, 'money'), /12\.50 \$/);
    assert.strictEqual(formatReportCell(87.5, 'percent'), '87.5%');
    assert.strictEqual(formatReportCell('2026-11-07', 'date'), '2026/11/07');
    assert.strictEqual(formatReportCell({ text: 'متأخر', tone: 'danger' }, 'badge'), 'متأخر');
    assert.strictEqual(formatReportCell(null, 'text'), '—');
    assert.strictEqual(formatReportCell('x', 'blank'), '');
  });

  it('infers kinds of free values and knows left-to-right ones', () => {
    assert.strictEqual(inferKind({ amount: 1, currency: 'SYP' }), 'money');
    assert.strictEqual(inferKind({ text: 'a', tone: 'info' }), 'badge');
    assert.strictEqual(inferKind(3), 'number');
    assert.strictEqual(inferKind('2026-01-02'), 'date');
    assert.strictEqual(inferKind('سارة'), 'text');
    assert.ok(isLtrKind('phone') && isLtrKind('money') && !isLtrKind('text'));
  });

  it('column widths become percentages', () => {
    assert.deepStrictEqual(columnPercents([2, undefined, 1]), [50, 25, 25]);
  });

  it('page css turns the sheet for landscape documents', () => {
    assert.match(pageCss('landscape'), /size: A4 landscape/);
    assert.match(pageCss('portrait'), /counter\(pages\)/);
  });
});

describe('report config', () => {
  it('brand and tones', () => {
    assert.strictEqual(withAlpha('#ff0000', 0.5), 'rgba(255, 0, 0, 0.5)');
    assert.strictEqual(withAlpha('red', 0.5), 'red');
    assert.strictEqual(resolveTone('brand', '#123456').text, '#123456');
    assert.notStrictEqual(resolveTone('danger', '#123456').text, '#123456');
  });

  it('verification link only for signed documents', () => {
    const signed = resolveReportConfig({ document: doc({ number: 'ST-1', token: 'abc.def' }), institute: null, verifyOrigin: 'https://x.test' });
    assert.strictEqual(signed.verifyUrl, 'https://x.test/verify/abc.def');
    assert.strictEqual(resolveReportConfig({ document: doc(), institute: null }).verifyUrl, null);
    assert.strictEqual(resolveReportConfig({ document: doc(), institute: { name: 'م', primaryColor: '#00aa00' } }).brand, '#00aa00');
  });

  it('report links carry the parameters', () => {
    assert.strictEqual(reportLink('exam-results', { examId: 5 }), '/reports/exam-results?examId=5');
  });
});
