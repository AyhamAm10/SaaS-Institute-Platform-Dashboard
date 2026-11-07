import { describe, it } from 'node:test';
import assert from 'node:assert';
import { defaultNavigationConfig } from '../init/navigation';
import { filterNavigation, requiredPermissionFor } from '../utils/nav.utils';
import { canUseDashboard, hasPermission, type Permission } from '@/src/core/auth/permissions';
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

  it('teacher: no dashboard home, no students, no finance', () => {
    const links = hrefs(TEACHER);
    assert.ok(!links.includes('/'));
    assert.ok(!links.includes('/students'));
    assert.ok(!links.includes('/payments'));
    assert.ok(links.includes('/exams'));
  });

  it('drops a group with no visible sub-items', () => {
    const items = filterNavigation(defaultNavigationConfig, canFrom(TEACHER));
    for (const item of items) {
      if (item.subItems) assert.ok(item.subItems.length > 0, item.key);
    }
    // Settings sub-pages all need settings.manage / staff.view
    assert.ok(!items.some((i) => i.subItems?.some((s) => s.href === '/settings/staff')));
  });

  it('admin with every permission sees the staff page', () => {
    assert.ok(hrefs([...REGISTRAR, ...ACCOUNTANT, 'staff.view', 'settings.manage', 'academic.manage']).includes('/settings/staff'));
  });
});

describe('requiredPermissionFor', () => {
  it('maps a page and its sub-routes to the sidebar entry permission', () => {
    assert.strictEqual(requiredPermissionFor('/students', defaultNavigationConfig), 'students.view');
    assert.strictEqual(requiredPermissionFor('/students/12', defaultNavigationConfig), 'students.view');
    assert.strictEqual(requiredPermissionFor('/settings/staff', defaultNavigationConfig), 'staff.view');
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

  it('canUseDashboard: staff and teachers yes, families no', () => {
    assert.ok(canUseDashboard(user('REGISTRAR')));
    assert.ok(canUseDashboard(user('TEACHER')));
    assert.ok(!canUseDashboard(user('FAMILY')));
    assert.ok(!canUseDashboard(null));
  });

  it('hasPermission reads the server list (missing list = nothing)', () => {
    assert.ok(hasPermission(user('ACCOUNTANT', ACCOUNTANT), 'fees.manage'));
    assert.ok(!hasPermission(user('ACCOUNTANT', ACCOUNTANT), 'students.manage'));
    assert.ok(!hasPermission(user('ACCOUNTANT'), 'fees.view'));
  });
});
