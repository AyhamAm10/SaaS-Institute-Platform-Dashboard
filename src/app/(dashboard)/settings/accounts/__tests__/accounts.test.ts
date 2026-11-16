import test from 'node:test';
import assert from 'node:assert/strict';
import type { AccountItem } from '@/src/core/api';
import { isContextFreeQuery } from '@/src/core/context/context-cache';
import { createAccountsStore } from '../store/accounts.store';
import {
  EMPTY_STAFF_FORM,
  EMPTY_STUDENT_FORM,
  toCreateStaffPayload,
  toQueryParams,
  toStudentPayload,
  toUpdateStaffPayload,
  toggleModalFor,
  validateStaffForm,
  validateStudentForm,
} from '../utils/accounts.utils';

const account = (over: Partial<AccountItem> = {}): AccountItem => ({
  id: 7,
  fullName: 'موظف',
  phone: '0911',
  role: 'REGISTRAR',
  isActive: true,
  mustChangePassword: false,
  createdAt: '2026-01-01T00:00:00Z',
  linkedTo: null,
  ...over,
});

test('staff form: no password is asked, phone only on create', () => {
  assert.deepEqual(Object.keys(validateStaffForm(EMPTY_STAFF_FORM, true)).sort(), ['fullName', 'phone', 'role']);
  assert.deepEqual(Object.keys(validateStaffForm({ ...EMPTY_STAFF_FORM, fullName: 'م', role: 'REGISTRAR' }, false)), []);
  const payload = toCreateStaffPayload({ fullName: ' مدير ', phone: ' 0911 ', role: 'INSTITUTE_ADMIN' });
  assert.deepEqual(payload, { fullName: 'مدير', phone: '0911', role: 'INSTITUTE_ADMIN' });
  assert.equal('password' in payload, false);
});

test('staff update sends only changes and never the role of the signed-in user', () => {
  const member = account();
  assert.deepEqual(toUpdateStaffPayload({ fullName: 'جديد', phone: '', role: 'ACCOUNTANT' }, member, false), {
    fullName: 'جديد',
    role: 'ACCOUNTANT',
  });
  assert.deepEqual(toUpdateStaffPayload({ fullName: 'موظف', phone: '', role: 'ACCOUNTANT' }, member, true), {});
});

test('student account form needs a student and a phone, and sends numbers', () => {
  assert.deepEqual(Object.keys(validateStudentForm(EMPTY_STUDENT_FORM)).sort(), ['phone', 'studentId']);
  assert.deepEqual(toStudentPayload({ studentId: '5', phone: ' 0944 ' }), { studentId: 5, phone: '0944' });
});

test('list query drops an empty search and the "all" status', () => {
  assert.deepEqual(toQueryParams('families', 2, 10, '  ', null), {
    type: 'families',
    page: 2,
    limit: 10,
    search: undefined,
    status: undefined,
  });
  assert.equal(toQueryParams('staff', 1, 10, ' علي ', 'inactive').search, 'علي');
});

test('an inactive row asks to activate, an active one to deactivate', () => {
  assert.equal(toggleModalFor(account({ isActive: true })), 'deactivate');
  assert.equal(toggleModalFor(account({ isActive: false })), 'activate');
});

test('switching sub-tab starts a fresh list; the modal flow opens and closes', () => {
  const store = createAccountsStore();
  store.getState().setSearch('علي');
  store.getState().setPage(3);
  store.getState().setStatus('inactive');
  store.getState().setType('families');
  const s = store.getState();
  assert.equal(s.type, 'families');
  assert.equal(s.page, 1);
  assert.equal(s.search, '');
  assert.equal(s.status, null);

  store.getState().openModal('reset', account());
  assert.equal(store.getState().modal, 'reset');
  assert.equal(store.getState().target?.id, 7);
  store.getState().closeModal();
  assert.equal(store.getState().modal, null);
  assert.equal(store.getState().target, null);
});

test('accounts queries are institute-wide, not tied to the branch or year', () => {
  assert.equal(isContextFreeQuery(['accounts', 'list', {}]), true);
});
