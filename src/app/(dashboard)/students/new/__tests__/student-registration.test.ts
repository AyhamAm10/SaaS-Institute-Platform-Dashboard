import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createStudentRegistrationStore } from '../store/student-registration.store';
import { StudentField } from '@/src/core/api';

describe('StudentRegistrationStore — Wizard Domain Logic & Validation', () => {
  it('initializes with step 0, search mode, and clean form', () => {
    const store = createStudentRegistrationStore();
    const state = store.getState();

    assert.strictEqual(state.activeStep, 0);
    assert.strictEqual(state.familyMode, 'search');
    assert.strictEqual(state.selectedFamily, null);
    assert.strictEqual(state.fullName, '');
    assert.strictEqual(state.gender, 'MALE');
    assert.deepStrictEqual(state.customFields, {});
    assert.deepStrictEqual(state.stepErrors, {});
  });

  describe('Step 0 (Family) Validation', () => {
    it('fails validation in search mode if no family is selected', () => {
      const store = createStudentRegistrationStore();
      const isValid = store.getState().validateCurrentStep([]);

      assert.strictEqual(isValid, false);
      assert.strictEqual(
        store.getState().stepErrors[0],
        'يرجى اختيار عائلة الطالب من القائمة أو التبديل لإنشاء عائلة جديدة',
      );
    });

    it('passes validation in search mode when family is selected', () => {
      const store = createStudentRegistrationStore();
      store.getState().setSelectedFamily({
        id: 10,
        instituteId: 1,
        familyName: 'آل الشامي',
      });

      const isValid = store.getState().validateCurrentStep([]);
      assert.strictEqual(isValid, true);
      assert.strictEqual(store.getState().stepErrors[0], null);
    });

    it('validates required family name in create mode', () => {
      const store = createStudentRegistrationStore();
      store.getState().setFamilyMode('create');

      // Empty name
      let isValid = store.getState().validateCurrentStep([]);
      assert.strictEqual(isValid, false);
      assert.strictEqual(store.getState().stepErrors[0], 'يرجى إدخال كنية العائلة');

      // Filled name
      store.getState().setNewFamilyField('familyName', 'عائلة الأحمد');
      store.getState().setNewFamilyField('phone', '0988776655');
      isValid = store.getState().validateCurrentStep([]);
      assert.strictEqual(isValid, true);
      assert.strictEqual(store.getState().stepErrors[0], null);
    });
  });

  describe('Step 1 (Basic Info & Custom Fields) Validation', () => {
    const mockFields: StudentField[] = [
      {
        id: 1,
        instituteId: 1,
        name: 'blood_type',
        label: 'زمرة الدم',
        type: 'SELECT',
        options: ['A+', 'B+', 'O+'],
        isRequired: true,
        displayInReport: true,
        sortOrder: 1,
        isActive: true,
      },
      {
        id: 2,
        instituteId: 1,
        name: 'health_notes',
        label: 'ملاحظات صحية',
        type: 'TEXT',
        isRequired: false,
        displayInReport: false,
        sortOrder: 2,
        isActive: true,
      },
    ];

    it('fails when full name, birthDate, or branchId is missing', () => {
      const store = createStudentRegistrationStore();
      store.getState().setActiveStep(1);

      let isValid = store.getState().validateCurrentStep([]);
      assert.strictEqual(isValid, false);
      assert.strictEqual(store.getState().stepErrors[1], 'يرجى إدخال اسم الطالب الكامل');

      store.getState().setStudentField('fullName', 'أحمد العلي');
      isValid = store.getState().validateCurrentStep([]);
      assert.strictEqual(isValid, false);
      assert.strictEqual(store.getState().stepErrors[1], 'يرجى اختيار تاريخ ميلاد الطالب');

      store.getState().setStudentField('birthDate', '2010-05-15');
      isValid = store.getState().validateCurrentStep([]);
      assert.strictEqual(isValid, false);
      assert.strictEqual(store.getState().stepErrors[1], 'يرجى اختيار الفرع الجغرافي المسجل به الطالب');

      store.getState().setStudentField('branchId', 1);
      isValid = store.getState().validateCurrentStep([]);
      assert.strictEqual(isValid, true);
      assert.strictEqual(store.getState().stepErrors[1], null);
    });

    it('enforces required dynamic custom fields directly within Step 1', () => {
      const store = createStudentRegistrationStore();
      store.getState().setActiveStep(1);
      store.getState().setStudentField('fullName', 'سارة الحسن');
      store.getState().setStudentField('birthDate', '2012-04-01');
      store.getState().setStudentField('branchId', 1);

      // Without required blood_type
      let isValid = store.getState().validateCurrentStep(mockFields);
      assert.strictEqual(isValid, false);
      assert.strictEqual(
        store.getState().stepErrors[1],
        'الحقل "زمرة الدم" مطلوب ويجب إدخال قيمته',
      );

      // With blood_type set
      store.getState().setCustomFieldValue('blood_type', 'O+');
      isValid = store.getState().validateCurrentStep(mockFields);
      assert.strictEqual(isValid, true);
      assert.strictEqual(store.getState().stepErrors[1], null);
    });
  });

  describe('Step 2 (Review) Validation', () => {
    it('passes review validation', () => {
      const store = createStudentRegistrationStore();
      store.getState().setActiveStep(2);

      const isValid = store.getState().validateCurrentStep([]);
      assert.strictEqual(isValid, true);
    });
  });

  describe('Store Isolation & State Reset', () => {
    it('resets form completely back to clean initial state', () => {
      const store = createStudentRegistrationStore();
      store.getState().setActiveStep(2);
      store.getState().setStudentField('fullName', 'طارق الزين');
      store.getState().setCustomFieldValue('notes', 'ممتاز');

      store.getState().reset();
      const state = store.getState();

      assert.strictEqual(state.activeStep, 0);
      assert.strictEqual(state.fullName, '');
      assert.deepStrictEqual(state.customFields, {});
    });

    it('isolates state across independent wizard instances', () => {
      const wizardA = createStudentRegistrationStore();
      const wizardB = createStudentRegistrationStore();

      wizardA.getState().setStudentField('fullName', 'طالب أول');
      wizardA.getState().setActiveStep(1);

      assert.strictEqual(wizardA.getState().fullName, 'طالب أول');
      assert.strictEqual(wizardA.getState().activeStep, 1);

      assert.strictEqual(wizardB.getState().fullName, '');
      assert.strictEqual(wizardB.getState().activeStep, 0);
    });
  });
});
