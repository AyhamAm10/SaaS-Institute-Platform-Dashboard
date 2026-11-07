import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { LookupFieldConfig } from '../lookup/lookup.config';
import {
  emptyLookupForm,
  lookupFormFrom,
  toLookupPayload,
  validateLookupForm,
} from '../lookup/utils/lookup-form.utils';

const fields: LookupFieldConfig[] = [
  { name: 'name', label: 'الاسم', type: 'text', required: true },
  { name: 'cityId', label: 'المدينة', type: 'select', options: 'cities', defaultValue: null },
  { name: 'capacity', label: 'المقاعد', type: 'number', defaultValue: null },
  { name: 'isActive', label: 'مفعّل', type: 'switch', defaultValue: true },
  { name: 'plateNumber', label: 'اللوحة', type: 'text' },
];

describe('lookup form utils', () => {
  it('builds an empty form from field defaults', () => {
    assert.deepStrictEqual(emptyLookupForm(fields), {
      name: '',
      cityId: null,
      capacity: null,
      isActive: true,
      plateNumber: '',
    });
  });

  it('loads an existing item, falling back to defaults for missing values', () => {
    const form = lookupFormFrom(fields, { id: 1, name: 'باص', cityId: 4 } as never);
    assert.strictEqual(form.name, 'باص');
    assert.strictEqual(form.cityId, 4);
    assert.strictEqual(form.plateNumber, '');
    assert.strictEqual(form.isActive, true);
  });

  it('flags required fields that are blank', () => {
    const errors = validateLookupForm(fields, { ...emptyLookupForm(fields), name: '   ' });
    assert.deepStrictEqual(Object.keys(errors), ['name']);
  });

  it('builds a trimmed payload with nulls for empty optional values', () => {
    const payload = toLookupPayload(
      fields,
      { name: ' دمشق ', cityId: '3', capacity: '', isActive: false, plateNumber: '  ' },
      true,
    );
    assert.deepStrictEqual(payload, {
      name: 'دمشق',
      cityId: 3,
      capacity: null,
      isActive: false,
      plateNumber: null,
    });
  });

  it('omits create-only fields on update', () => {
    const withBranch: LookupFieldConfig[] = [
      ...fields,
      { name: 'branchId', label: 'الفرع', type: 'number', createOnly: true },
    ];
    const form = { ...emptyLookupForm(withBranch), name: 'x', branchId: 2 };
    assert.strictEqual(toLookupPayload(withBranch, form, true).branchId, 2);
    assert.strictEqual('branchId' in toLookupPayload(withBranch, form, false), false);
  });
});
