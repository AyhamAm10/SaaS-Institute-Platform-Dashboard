import test from 'node:test';
import assert from 'node:assert/strict';
import { createTeachersStore } from '../store/teachers.store';
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

test('TeachersStore: the edit drawer loads the teacher and the form carries no password', () => {
  const store = createTeachersStore();
  store.getState().openEditDrawer(mockTeacher);

  const { form, drawerMode, drawerOpened } = store.getState();
  assert.equal(drawerOpened, true);
  assert.equal(drawerMode, 'edit');
  assert.equal(form.fullName, 'أستاذ أحمد');
  assert.equal(form.phone, '0912345678');
  assert.equal('password' in form, false);
});
