import test from 'node:test';
import assert from 'node:assert/strict';
import { createTeachersStore } from '../store/teachers.store';
import { passwordError, STAFF_PASSWORD_MIN } from '@/src/core/auth';
import { Teacher } from '@/src/core/api';

const mockTeacher: Teacher = {
  id: 42,
  userId: 42,
  specialization: 'Math',
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  user: {
    id: 42,
    fullName: 'أستاذ أحمد',
    phone: '0912345678',
    role: 'TEACHER',
  },
  assignments: [],
  teacherBranches: [],
};

test('TeachersStore: password modal state flow', () => {
  const store = createTeachersStore();

  assert.equal(store.getState().passwordModalOpened, false);
  assert.equal(store.getState().passwordTarget, null);
  assert.equal(store.getState().newPassword, '');
  assert.equal(store.getState().passwordModalError, null);

  // Open modal
  store.getState().openPasswordModal(mockTeacher);
  assert.equal(store.getState().passwordModalOpened, true);
  assert.equal(store.getState().passwordTarget?.id, 42);
  assert.equal(store.getState().newPassword, '');

  // Type new password
  store.getState().setNewPassword('Short1');
  assert.equal(store.getState().newPassword, 'Short1');

  // Error validation using passwordError
  const err = passwordError(store.getState().newPassword);
  assert.equal(err, `كلمة المرور ${STAFF_PASSWORD_MIN} محارف على الأقل`);
  store.getState().setPasswordModalError(err);
  assert.equal(store.getState().passwordModalError, err);

  // Valid password
  store.getState().setNewPassword('NewTeacherPass123!');
  assert.equal(passwordError(store.getState().newPassword), null);

  // Close modal resets target and fields
  store.getState().closePasswordModal();
  assert.equal(store.getState().passwordModalOpened, false);
  assert.equal(store.getState().passwordTarget, null);
  assert.equal(store.getState().newPassword, '');
  assert.equal(store.getState().passwordModalError, null);
});

