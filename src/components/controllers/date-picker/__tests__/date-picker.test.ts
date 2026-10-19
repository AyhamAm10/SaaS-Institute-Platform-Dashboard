import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  parseDateValue,
  formatDateToISO,
  resolveDatePickerConfig,
} from '../init/date-picker.init';
import { createDatePickerStore } from '../store/date-picker.store';

describe('DatePickerController (AppDatePicker) — Architecture & Domain Logic', () => {
  describe('Date Parsing & Formatting (init)', () => {
    it('parses valid ISO string dates to Date objects accurately', () => {
      const date = parseDateValue('2026-10-19');
      assert.ok(date instanceof Date);
      assert.strictEqual(date.getFullYear(), 2026);
      assert.strictEqual(date.getMonth(), 9); // October is 9 (0-indexed)
      assert.strictEqual(date.getDate(), 19);
    });

    it('returns null safely for invalid or empty date inputs', () => {
      assert.strictEqual(parseDateValue(null), null);
      assert.strictEqual(parseDateValue(undefined), null);
      assert.strictEqual(parseDateValue('invalid-date'), null);
      assert.strictEqual(parseDateValue(''), null);
    });

    it('formats Date objects to standard ISO YYYY-MM-DD string', () => {
      const date = new Date(2026, 9, 19);
      assert.strictEqual(formatDateToISO(date), '2026-10-19');
    });

    it('formats null/invalid dates to null without throwing', () => {
      assert.strictEqual(formatDateToISO(null), null);
      assert.strictEqual(formatDateToISO(undefined), null);
      assert.strictEqual(formatDateToISO(new Date('invalid')), null);
    });

    it('resolves default configuration matching compact classic standards', () => {
      const config = resolveDatePickerConfig({});
      assert.strictEqual(config.size, 'sm');
      assert.strictEqual(config.radius, 'md');
      assert.strictEqual(config.clearable, true);
      assert.strictEqual(config.locale, 'ar');
      assert.strictEqual(config.valueFormat, 'YYYY-MM-DD');
      assert.strictEqual(config.placeholder, 'اختر التاريخ...');
    });
  });

  describe('Per-Instance Zustand Store Isolation (store)', () => {
    it('guarantees complete state isolation between multiple picker instances (role.md Section 3)', () => {
      const storeA = createDatePickerStore({ value: '2026-01-01' });
      const storeB = createDatePickerStore({ value: '2026-12-31' });

      assert.strictEqual(formatDateToISO(storeA.getState().value), '2026-01-01');
      assert.strictEqual(formatDateToISO(storeB.getState().value), '2026-12-31');

      // Modifying Store A must never mutate Store B
      storeA.getState().setValue(new Date(2025, 5, 15));
      assert.strictEqual(formatDateToISO(storeA.getState().value), '2025-06-15');
      assert.strictEqual(formatDateToISO(storeB.getState().value), '2026-12-31');
    });

    it('automatically emits ISO YYYY-MM-DD string to external onChange handler', () => {
      let emittedValue: string | null = null;
      const store = createDatePickerStore({
        onChange: (val) => {
          emittedValue = val;
        },
      });

      store.getState().setValue(new Date(2026, 9, 19));
      assert.strictEqual(emittedValue, '2026-10-19');

      store.getState().setValue(null);
      assert.strictEqual(emittedValue, null);
    });

    it('manages focus state and handles prop synchronization', () => {
      const store = createDatePickerStore({ value: '2026-10-19' });
      assert.strictEqual(store.getState().isFocused, false);

      store.getState().setFocused(true);
      assert.strictEqual(store.getState().isFocused, true);

      store.getState().updateProps({ value: '2027-05-20', error: 'تاريخ غير صالح' });
      assert.strictEqual(formatDateToISO(store.getState().value), '2027-05-20');
      assert.strictEqual(store.getState().error, 'تاريخ غير صالح');
    });
  });
});
