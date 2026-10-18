import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createStudentFieldsStore } from '../store/student-fields.store';
import { StudentField } from '@/src/core/api';

describe('StudentFieldsStore — Custom Fields Configuration', () => {
  it('initializes with default empty drawer state', () => {
    const store = createStudentFieldsStore();
    const state = store.getState();

    assert.strictEqual(state.isDrawerOpen, false);
    assert.strictEqual(state.selectedField, null);
    assert.strictEqual(state.formName, '');
    assert.strictEqual(state.formType, 'TEXT');
    assert.strictEqual(state.formIsRequired, false);
  });

  it('populates drawer correctly when opening for edit', () => {
    const store = createStudentFieldsStore();
    const mockField: StudentField = {
      id: 5,
      instituteId: 1,
      name: 'blood_type',
      label: 'زمرة الدم',
      type: 'SELECT',
      options: ['A+', 'B+', 'AB+', 'O+'],
      isRequired: true,
      displayInReport: true,
      sortOrder: 10,
      isActive: true,
    };

    store.getState().openEditDrawer(mockField);
    const state = store.getState();

    assert.strictEqual(state.isDrawerOpen, true);
    assert.strictEqual(state.selectedField?.id, 5);
    assert.strictEqual(state.formName, 'blood_type');
    assert.strictEqual(state.formLabel, 'زمرة الدم');
    assert.strictEqual(state.formType, 'SELECT');
    assert.strictEqual(state.formIsRequired, true);
    assert.strictEqual(state.formSortOrder, 10);
    assert.strictEqual(state.formOptionsText, 'A+\nB+\nAB+\nO+');
  });

  it('clears form state when opening for creation', () => {
    const store = createStudentFieldsStore();
    store.getState().openCreateDrawer();
    const state = store.getState();

    assert.strictEqual(state.isDrawerOpen, true);
    assert.strictEqual(state.selectedField, null);
    assert.strictEqual(state.formName, '');
    assert.strictEqual(state.formLabel, '');
    assert.strictEqual(state.formType, 'TEXT');
    assert.strictEqual(state.formIsRequired, false);
  });

  it('filters fields correctly by search text', () => {
    const store = createStudentFieldsStore();
    store.getState().setSearch('طبي');
    assert.strictEqual(store.getState().search, 'طبي');
  });
});
