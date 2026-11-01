'use client';

import { Box, NavLink, Stack, Tooltip, UnstyledButton, rem } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebarMirror } from '../../store/useSidebarMirror';
import { isNavItemActive } from '../../utils/nav.utils';
import { NavSubItem } from '../../init/navigation';

export interface SidebarNavListProps {
  /** Icon-only rail (desktop collapsed). */
  compact?: boolean;
  /** Called after a link is chosen (mobile drawer closes itself). */
  onNavigate?: () => void;
}

const ActiveDot = () => (
  <Box
    style={{
      width: rem(6),
      height: rem(6),
      borderRadius: '50%',
      backgroundColor: 'var(--app-brand-accent)',
      boxShadow: '0 0 10px var(--app-brand-accent)',
    }}
  />
);

/**
 * Shared navigation list for desktop and mobile sidebars.
 * Active item = ink pill + orange dot; hover = frosted highlight (see globals.css `.app-nav-link`).
 */
export function SidebarNavList({ compact, onNavigate }: SidebarNavListProps) {
  const items = useSidebarMirror('items');
  const openedSections = useSidebarMirror('openedSections');
  const toggleSection = useSidebarMirror('toggleSection');
  const toggleCollapse = useSidebarMirror('toggleDesktopCollapse');
  const pathname = usePathname() || '/';

  if (compact) {
    return (
      <Stack gap={6}>
        {items.map((item) => {
          const isActive = isNavItemActive(item, pathname);
          const Icon = item.icon;
          const content = <Icon size={20} stroke={1.6} />;

          return (
            <Tooltip key={item.key} label={item.label} position="left">
              {item.href ? (
                <UnstyledButton
                  component={Link}
                  href={item.href}
                  className="app-nav-icon"
                  data-active={isActive || undefined}
                  aria-label={item.label}
                >
                  {content}
                </UnstyledButton>
              ) : (
                <UnstyledButton
                  onClick={toggleCollapse}
                  className="app-nav-icon"
                  data-active={isActive || undefined}
                  aria-label={item.label}
                >
                  {content}
                </UnstyledButton>
              )}
            </Tooltip>
          );
        })}
      </Stack>
    );
  }

  return (
    <Stack gap={4}>
      {items.map((item) => {
        const isActive = isNavItemActive(item, pathname);
        const Icon = item.icon;
        const icon = <Icon size={19} stroke={1.6} />;

        if (item.subItems && item.subItems.length > 0) {
          return (
            <NavLink
              key={item.key}
              className="app-nav-link"
              label={item.label}
              leftSection={icon}
              opened={openedSections.includes(item.key)}
              onChange={() => toggleSection(item.key)}
              active={isActive}
              variant="subtle"
              color="primary"
            >
              <Stack gap={2} pt={4} pr={rem(14)} style={{ borderRight: '1px solid var(--app-border)' }} mr={rem(20)}>
                {item.subItems.map((sub: NavSubItem) => {
                  const isSubActive = pathname === sub.href;
                  return (
                    <NavLink
                      key={sub.key}
                      className="app-nav-link"
                      component={Link}
                      href={sub.href}
                      label={sub.label}
                      active={isSubActive}
                      variant="filled"
                      color="primary"
                      onClick={onNavigate}
                      style={{ paddingBlock: rem(8) }}
                    />
                  );
                })}
              </Stack>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={item.key}
            className="app-nav-link"
            component={Link}
            href={item.href || '/'}
            label={item.label}
            leftSection={icon}
            rightSection={isActive ? <ActiveDot /> : undefined}
            active={isActive}
            variant="filled"
            color="primary"
            onClick={onNavigate}
          />
        );
      })}
    </Stack>
  );
}
