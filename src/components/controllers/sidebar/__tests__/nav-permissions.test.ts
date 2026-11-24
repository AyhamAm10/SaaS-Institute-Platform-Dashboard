import { describe, it } from 'node:test';
import assert from 'node:assert';
import { defaultNavigationConfig } from '../init/navigation';
import { filterNavigation, requiredPermissionFor } from '../utils/nav.utils';
import { canUseDashboard, hasPermission, needsOperationalContext, type Permission } from '@/src/core/auth/permissions';
import type { UserProfile } from '@/src/core/api/types';

/** Permissions the server gives each role (ROLE_PERMISSIONS, role.md §8.6). */
const REGISTRAR: Permission[] = [
  'dashboard.view',
  'students.view',
  'students.manage',
  'attendance.view',
  'attendance.manage',
  'fees.view',
  'exams.view',
  'academic.view',
  'settings.view',
];
const DATA_ENTRY: Permission[] = [
  'dashboard.view',
  'students.view',
  'students.manage',
  'attendance.view',
  'attendance.manage',
  'exams.view',
  'academic.view',
  'settings.view',
  'marks.enter',
];
const ACCOUNTANT: Permission[] = ['dashboard.view', 'students.view', 'fees.view', 'fees.manage', 'academic.view', 'settings.view'];
const TEACHER: Permission[] = ['attendance.view', 'attendance.manage', 'exams.view', 'academic.view', 'marks.enter'];

const canFrom = (perms: Permission[]) => (p: Permission) => perms.includes(p);
const hrefs = (perms: Permission[]) =>
  filterNavigation(defaultNavigationConfig, canFrom(perms)).flatMap((i) => [
    ...(i.href ? [i.href] : []),
    ...(i.subItems ?? []).map((s) => s.href),
  ]);

describe('filterNavigation', () => {
  it('registrar: students and attendance, no finance management or settings pages', () => {
    const links = hrefs(REGISTRAR);
    assert.ok(links.includes('/students'));
    assert.ok(links.includes('/attendance'));
    assert.ok(links.includes('/payments'));
    assert.ok(!links.includes('/settings/staff'));
    assert.ok(!links.includes('/branches'));
  });

  it('data entry: students, attendance and exams, but no payments or accounts', () => {
    const links = hrefs(DATA_ENTRY);
    assert.ok(links.includes('/students'));
    assert.ok(links.includes('/attendance'));
    assert.ok(links.includes('/exams'));
    assert.ok(!links.includes('/payments'));
    assert.ok(!links.includes('/overdue-installments'));
    assert.ok(!hasPermission({ permissions: DATA_ENTRY } as UserProfile, 'records.delete'));
  });

  it('teacher: no dashboard home, no students, no finance', () => {
    const links = hrefs(TEACHER);
    assert.ok(!links.includes('/'));
    assert.ok(!links.includes('/students'));
    assert.ok(!links.includes('/payments'));
    assert.ok(links.includes('/exams'));
  });

  it('supervisor: only "my supervisions" (no reports, no exams, no students)', () => {
    const links = hrefs(['supervision.view']);
    assert.deepStrictEqual(links, ['/supervision']);
  });

  it('"my supervisions" is not offered to staff, who choose the supervisors', () => {
    for (const perms of [REGISTRAR, DATA_ENTRY, ACCOUNTANT, TEACHER]) assert.ok(!hrefs(perms).includes('/supervision'));
  });

  it('the reports center is offered to every role that can read anything (it is unrestricted for them)', () => {
    for (const perms of [REGISTRAR, DATA_ENTRY, ACCOUNTANT, TEACHER]) assert.ok(hrefs(perms).includes('/reports'));
  });

  it('drops a group with no visible sub-items', () => {
    const items = filterNavigation(defaultNavigationConfig, canFrom(TEACHER));
    for (const item of items) {
      if (item.subItems) assert.ok(item.subItems.length > 0, item.key);
    }
    // Settings sub-pages all need settings.view
    assert.ok(!items.some((i) => i.subItems?.some((s) => s.href === '/settings')));
  });

  it('admin with every permission sees the settings page', () => {
    assert.ok(hrefs([...REGISTRAR, ...ACCOUNTANT, 'staff.view', 'settings.manage', 'academic.manage']).includes('/settings'));
  });
});

describe('requiredPermissionFor', () => {
  it('maps a page and its sub-routes to the sidebar entry permission', () => {
    assert.strictEqual(requiredPermissionFor('/students', defaultNavigationConfig), 'students.view');
    assert.strictEqual(requiredPermissionFor('/students/12', defaultNavigationConfig), 'students.view');
    assert.strictEqual(requiredPermissionFor('/settings', defaultNavigationConfig), 'settings.view');
  });

  it('override: registering a student needs students.manage', () => {
    assert.strictEqual(requiredPermissionFor('/students/new', defaultNavigationConfig), 'students.manage');
    assert.strictEqual(requiredPermissionFor('/teachers/new', defaultNavigationConfig), 'academic.manage');
  });

  it('home page and unknown routes are unrestricted', () => {
    assert.strictEqual(requiredPermissionFor('/', defaultNavigationConfig), null);
    assert.strictEqual(requiredPermissionFor('/profile', defaultNavigationConfig), null);
  });
});

describe('permissions helpers', () => {
  const user = (role: string, permissions?: string[]) => ({ role, permissions }) as unknown as UserProfile;

  it('canUseDashboard: staff, teachers, supervisors, guardians and students may sign in; nobody else', () => {
    for (const role of ['REGISTRAR', 'TEACHER', 'SUPERVISOR', 'FAMILY', 'STUDENT']) assert.ok(canUseDashboard(user(role)), role);
    assert.ok(!canUseDashboard(user('SOMETHING_ELSE')));
    assert.ok(!canUseDashboard(null));
  });

  it('a guardian and a student see only the follow-up portal in the menu (it is their home page)', () => {
    for (const role of ['FAMILY', 'STUDENT']) {
      assert.deepStrictEqual(hrefs(['portal.view']), ['/'], role);
    }
    for (const perms of [REGISTRAR, DATA_ENTRY, ACCOUNTANT, TEACHER, ['supervision.view' as Permission]]) {
      assert.ok(!filterNavigation(defaultNavigationConfig, canFrom(perms)).some((i) => i.key === 'portal'));
    }
  });

  it('only guardians, students and the platform admin skip the branch / year pickers', () => {
    for (const role of ['FAMILY', 'STUDENT', 'SUPERVISOR', 'SUPER_ADMIN']) assert.strictEqual(needsOperationalContext(role), false, role);
    for (const role of ['INSTITUTE_ADMIN', 'REGISTRAR', 'DATA_ENTRY', 'ACCOUNTANT', 'TEACHER']) assert.strictEqual(needsOperationalContext(role), true, role);
    assert.strictEqual(needsOperationalContext(undefined), true); // before the user is known
  });

  it('hasPermission reads the server list (missing list = nothing)', () => {
    assert.ok(hasPermission(user('ACCOUNTANT', ACCOUNTANT), 'fees.manage'));
    assert.ok(!hasPermission(user('ACCOUNTANT', ACCOUNTANT), 'students.manage'));
    assert.ok(!hasPermission(user('ACCOUNTANT'), 'fees.view'));
  });
});
