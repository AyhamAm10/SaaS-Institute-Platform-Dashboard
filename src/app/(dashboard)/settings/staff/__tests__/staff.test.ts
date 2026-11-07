import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { StaffMember } from '@/src/core/api';
import {
  EMPTY_STAFF_FORM,
  passwordError,
  staffFormFrom,
  toCreateStaffPayload,
  toUpdateStaffPayload,
  validateStaffForm,
} from '../utils/staff.utils';
import { createStaffStore } from '../store/staff.store';

const member: StaffMember = {
  id: 7,
  fullName: 'سارة',
  phone: '0991000000',
  role: 'REGISTRAR',
  createdAt: '2026-10-01T00:00:00.000Z',
};

describe('staff form', () => {
  it('create needs name, role, phone and an 8+ password', () => {
    const errors = validateStaffForm(EMPTY_STAFF_FORM, true);
    assert.deepStrictEqual(Object.keys(errors).sort(), ['fullName', 'password', 'phone', 'role']);
    const short = validateStaffForm({ fullName: 'a', phone: '1', role: 'ACCOUNTANT', password: '1234567' }, true);
    assert.deepStrictEqual(Object.keys(short), ['password']);
  });

  it('edit ignores phone and password', () => {
    assert.deepStrictEqual(validateStaffForm(staffFormFrom(member), false), {});
  });

  it('passwordError', () => {
    assert.ok(passwordError(''));
    assert.ok(passwordError('short'));
    assert.strictEqual(passwordError('12345678'), null);
  });

  it('create payload is trimmed', () => {
    const payload = toCreateStaffPayload({ fullName: ' علي ', phone: ' 0999 ', role: 'ACCOUNTANT', password: 'secret123' });
    assert.deepStrictEqual(payload, { fullName: 'علي', phone: '0999', role: 'ACCOUNTANT', password: 'secret123' });
  });

  it('update payload holds only the changes, never the own role', () => {
    const form = { ...staffFormFrom(member), fullName: 'سارة م', role: 'ACCOUNTANT' as const };
    assert.deepStrictEqual(toUpdateStaffPayload(form, member, false), { fullName: 'سارة م', role: 'ACCOUNTANT' });
    assert.deepStrictEqual(toUpdateStaffPayload(form, member, true), { fullName: 'سارة م' });
    assert.deepStrictEqual(toUpdateStaffPayload(staffFormFrom(member), member, false), {});
  });
});

describe('staff store', () => {
  it('drawer opens with the member and clears field errors with ""', () => {
    const store = createStaffStore();
    store.getState().openEdit(member);
    assert.strictEqual(store.getState().form.phone, member.phone);
    store.getState().setFormErrors({ fullName: 'x' });
    store.getState().setField('fullName', 'y');
    assert.strictEqual(store.getState().formErrors.fullName, '');
  });

  it('modal resets its password and error on open / close', () => {
    const store = createStaffStore();
    store.getState().openModal('password', member);
    store.getState().setNewPassword('abc');
    store.getState().setModalError('err');
    store.getState().openModal('deactivate', member);
    assert.strictEqual(store.getState().newPassword, '');
    assert.strictEqual(store.getState().modalError, null);
    store.getState().closeModal();
    assert.strictEqual(store.getState().modal, null);
    assert.strictEqual(store.getState().target, null);
  });

  it('role filter resets the page', () => {
    const store = createStaffStore();
    store.getState().setPage(3);
    store.getState().setRoleFilter('ACCOUNTANT');
    assert.strictEqual(store.getState().page, 1);
  });
});
