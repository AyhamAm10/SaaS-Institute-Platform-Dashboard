import { NavItem } from '../init/navigation';
import type { Permission } from '@/src/core/auth/permissions';

/**
 * Checks if a nav item or any of its sub-items matches the current path.
 */
export function isNavItemActive(item: NavItem, currentPath: string): boolean {
  if (item.href) {
    if (item.href === '/') {
      return currentPath === '/';
    }
    return currentPath === item.href || currentPath.startsWith(`${item.href}/`);
  }

  if (item.subItems && item.subItems.length > 0) {
    return item.subItems.some(
      (sub) => currentPath === sub.href || currentPath.startsWith(`${sub.href}/`),
    );
  }

  return false;
}

/**
 * Finds all parent section keys that should be expanded by default for a given active route.
 */
export function findInitialOpenedSections(items: NavItem[], activeRoute: string): string[] {
  const opened: string[] = [];
  for (const item of items) {
    if (
      item.subItems &&
      item.subItems.some((sub) => sub.href === activeRoute || activeRoute.startsWith(`${sub.href}/`))
    ) {
      opened.push(item.key);
    }
  }
  return opened;
}

export const resolveActiveSections = findInitialOpenedSections;

/**
 * Keeps the entries the user may see (role.md §8.6): leaves by their own
 * permission, groups by their visible sub-items (empty groups disappear).
 */
export function filterNavigation(items: NavItem[], can: (permission: Permission) => boolean): NavItem[] {
  return items.flatMap((item) => {
    if (item.subItems?.length) {
      const subItems = item.subItems.filter((sub) => !sub.permission || can(sub.permission));
      return subItems.length > 0 ? [{ ...item, subItems }] : [];
    }
    return !item.permission || can(item.permission) ? [item] : [];
  });
}

/** Pages whose permission differs from their sidebar entry. */
const ROUTE_OVERRIDES: Record<string, Permission> = {
  '/students/new': 'students.manage',
  '/teachers/new': 'academic.manage',
};

/**
 * Permission needed to open `pathname`, from the most specific matching
 * sidebar entry (or an override). `null` = no restriction (e.g. the home
 * page, which adapts to the role itself).
 */
export function requiredPermissionFor(pathname: string, items: NavItem[]): Permission | null {
  const override = Object.keys(ROUTE_OVERRIDES)
    .filter((route) => pathname === route || pathname.startsWith(`${route}/`))
    .sort((a, b) => b.length - a.length)[0];
  if (override) return ROUTE_OVERRIDES[override];

  const entries = items.flatMap((item) => [item, ...(item.subItems ?? [])]);
  const match = entries
    .filter((e) => e.href && e.href !== '/' && (pathname === e.href || pathname.startsWith(`${e.href}/`)))
    .sort((a, b) => (b.href?.length ?? 0) - (a.href?.length ?? 0))[0];
  return match?.permission ?? null;
}
