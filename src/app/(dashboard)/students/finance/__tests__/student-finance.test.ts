import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { Contract } from '@/src/core/api';
import {
  convertAmount,
  formatMoney,
  hasValidPrecision,
  inputText,
  previewAllocation,
} from '@/src/core/format';
import {
  contractRemaining,
  editFormFrom,
  EMPTY_CONTRACT_FORM,
  paymentPreview,
  toContractPayload,
  toPaymentPayload,
} from '../utils/student-finance.utils';
import { toPaymentsQuery } from '../../../payments/utils/payments.utils';
import { EMPTY_PAYMENT_FILTERS } from '../../../payments/store/payments.store';

const contract = (over: Partial<Contract> = {}): Contract =>
  ({
    id: 1,
    currency: 'SYP',
    discountAmount: '0',
    discountReason: null,
    installments: [
      { id: 1, installmentNumber: 1, amount: '100000', paidAmount: '100000', dueDate: '2026-09-01T00:00:00.000Z', status: 'PAID' },
      { id: 2, installmentNumber: 2, amount: '100000', paidAmount: '20000', dueDate: '2026-10-01T00:00:00.000Z', status: 'PARTIAL' },
      { id: 3, installmentNumber: 3, amount: '100000', paidAmount: '0', dueDate: '2026-11-01T00:00:00.000Z', status: 'PENDING' },
    ],
    ...over,
  }) as Contract;

describe('money format helpers', () => {
  it('formats SYP without fractions and USD with two decimals', () => {
    assert.match(formatMoney(1500000, 'SYP'), /^1,500,000 ل\.س$/);
    assert.match(formatMoney('12.5', 'USD'), /^12\.50 \$$/);
  });

  it('checks the currency precision and converts with the SYP-per-USD rate', () => {
    assert.strictEqual(hasValidPrecision(10.5, 'SYP'), false);
    assert.strictEqual(hasValidPrecision(10.55, 'USD'), true);
    assert.strictEqual(convertAmount(10, 'USD', 'SYP', 13000), 130000);
    assert.strictEqual(convertAmount(100000, 'SYP', 'USD', 13000), 7.69);
    assert.strictEqual(convertAmount(10, 'USD', 'SYP', null), null);
  });

  it('previews the FIFO allocation and refuses an overpayment', () => {
    const insts = [
      { id: 2, installmentNumber: 2, dueDate: '2026-10-01', amount: 100, paid: 20 },
      { id: 3, installmentNumber: 3, dueDate: '2026-11-01', amount: 100, paid: 0 },
    ];
    assert.deepStrictEqual(previewAllocation(insts, 130, 'SYP'), [
      { installmentNumber: 2, amount: 80 },
      { installmentNumber: 3, amount: 50 },
    ]);
    assert.strictEqual(previewAllocation(insts, 181, 'SYP'), null);
  });

  it('reads text or numbers from inputs', () => {
    assert.strictEqual(inputText(12), '12');
    assert.strictEqual(inputText({ target: { value: 'x' } }), 'x');
  });
});

describe('student finance utils', () => {
  it('sends empty contract fields as undefined (section fee defaults)', () => {
    const payload = toContractPayload({ ...EMPTY_CONTRACT_FORM, discountAmount: '5000', numberOfInstallments: '4' });
    assert.deepStrictEqual(payload, {
      grossAmount: undefined,
      currency: undefined,
      discountAmount: 5000,
      discountReason: undefined,
      firstPaymentAmount: undefined,
      numberOfInstallments: 4,
      startDate: undefined,
    });
  });

  it('prefills the edit form with the number of unpaid installments', () => {
    assert.strictEqual(editFormFrom(contract()).numberOfInstallments, '1');
  });

  it('computes the remaining balance and the payment preview', () => {
    assert.strictEqual(contractRemaining(contract()), 180000);
    const form = { amount: '10', currency: 'USD' as const, exchangeRate: '13000', paymentMethod: 'CASH' as const, note: '' };
    const preview = paymentPreview(form, contract());
    assert.strictEqual(preview?.applied, 130000);
    assert.deepStrictEqual(preview?.allocation, [
      { installmentNumber: 2, amount: 80000 },
      { installmentNumber: 3, amount: 50000 },
    ]);
    assert.strictEqual(toPaymentPayload(form, contract()).exchangeRate, 13000);
    assert.strictEqual(
      toPaymentPayload({ ...form, currency: 'SYP' }, contract()).exchangeRate,
      undefined,
    );
  });

  it('builds the payments query, ignoring an invalid receipt number', () => {
    const q = toPaymentsQuery(2, 20, ' أحمد ', { ...EMPTY_PAYMENT_FILTERS, receiptNumber: 'abc', currency: 'USD' });
    assert.strictEqual(q.search, 'أحمد');
    assert.strictEqual(q.receiptNumber, undefined);
    assert.strictEqual(q.currency, 'USD');
    assert.strictEqual(toPaymentsQuery(1, 20, '', { ...EMPTY_PAYMENT_FILTERS, receiptNumber: '12' }).receiptNumber, 12);
  });
});
