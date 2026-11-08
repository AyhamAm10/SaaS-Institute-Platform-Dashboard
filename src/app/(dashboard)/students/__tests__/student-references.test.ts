import { describe, it } from 'node:test';
import assert from 'node:assert';
import type { Student } from '@/src/core/api';
import {
  EMPTY_STUDENT_REFERENCES,
  schoolsOfCity,
  studentReferencesFrom,
  toReferencePayload,
} from '../utils/student-references.utils';
import { createStudentsStore } from '../store/students.store';

describe('student reference utils', () => {
  it('reads the links of a student, null when missing', () => {
    const refs = studentReferencesFrom({ id: 1, cityId: 2, statusId: 5 } as Student);
    assert.deepStrictEqual(refs, { ...EMPTY_STUDENT_REFERENCES, cityId: 2, statusId: 5 });
  });

  it('sends cleared links as null but never a null status', () => {
    assert.deepStrictEqual(toReferencePayload({ ...EMPTY_STUDENT_REFERENCES, busId: 7 }), {
      knowWayId: null,
      cityId: null,
      schoolId: null,
      busId: 7,
    });
    assert.strictEqual(toReferencePayload({ ...EMPTY_STUDENT_REFERENCES, statusId: 3 }).statusId, 3);
  });

  it('filters schools by city, keeping schools without a city', () => {
    const schools = [
      { value: '1', label: 'A', cityId: 1 },
      { value: '2', label: 'B', cityId: 2 },
      { value: '3', label: 'C', cityId: null },
    ];
    assert.deepStrictEqual(
      schoolsOfCity(schools, 1).map((s) => s.value),
      ['1', '3'],
    );
    assert.strictEqual(schoolsOfCity(schools, null).length, 3);
  });
});

describe('StudentsStore — references & filters', () => {
  it('loads the references of the student into the edit form', () => {
    const store = createStudentsStore();
    store.getState().openEditDrawer({
      id: 1,
      fullName: 'طالب',
      birthDate: '2010-01-01',
      gender: 'MALE',
      familyId: 1,
      busId: 4,
    } as Student);
    assert.strictEqual(store.getState().form.references.busId, 4);

    store.getState().setReference('busId', null);
    assert.strictEqual(store.getState().form.references.busId, null);
  });

  it('resets to the first page when a filter changes', () => {
    const store = createStudentsStore();
    store.getState().setPage(3);
    store.getState().setFilter('statusId', 2);
    assert.strictEqual(store.getState().page, 1);
    assert.strictEqual(store.getState().filters.statusId, 2);
  });

  it('resets school when city changes to a non-matching city', () => {
    const store = createStudentsStore();
    store.getState().syncReferenceOptions({
      statuses: [],
      knowWays: [],
      cities: [{ value: '1', label: 'دمشق' }, { value: '2', label: 'حلب' }],
      schools: [
        { value: '10', label: 'مدرسة دمشق', cityId: 1 },
        { value: '20', label: 'مدرسة حلب', cityId: 2 },
      ],
      buses: [],
    });
    store.getState().setFilter('cityId', 1);
    store.getState().setFilter('schoolId', 10);
    assert.strictEqual(store.getState().filters.schoolId, 10);

    // Change city to Aleppo (2) -> schoolId 10 should be cleared
    store.getState().setFilter('cityId', 2);
    assert.strictEqual(store.getState().filters.schoolId, null);
  });

  it('handles custom filters and clear filters', () => {
    const store = createStudentsStore();
    store.getState().setPage(4);
    store.getState().setCustomFilter('blood_type', 'O+');
    assert.strictEqual(store.getState().page, 1);
    assert.strictEqual(store.getState().filters.customFilters.blood_type, 'O+');

    store.getState().setCustomFilter('blood_type', null);
    assert.strictEqual(store.getState().filters.customFilters.blood_type, undefined);

    store.getState().setFilter('statusId', 5);
    store.getState().setCustomFilter('transport', true);
    store.getState().clearFilters();
    assert.strictEqual(store.getState().filters.statusId, null);
    assert.deepStrictEqual(store.getState().filters.customFilters, {});
  });
});
