import { NavItem } from '../init/navigation';

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
