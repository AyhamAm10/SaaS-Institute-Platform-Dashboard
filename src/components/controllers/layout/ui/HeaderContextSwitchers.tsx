'use client';

import { Box, Group, Menu } from '@mantine/core';
import { IconBuildingCommunity, IconCalendarEvent } from '@tabler/icons-react';
import { useOperationalContext, useOperationalContextStore } from '@/src/core/api';
import { useActiveContextLabels } from '../useActiveContextLabels';
import { ContextPill } from './HeaderContextPill';

/**
 * Active branch / academic year menus. Validation and defaults live in
 * useOperationalContextResolver (layout); this only shows and switches the
 * context (the cache resets centrally).
 */
export function HeaderContextSwitchers() {
  const { activeBranchId, activeAcademicYearId, setActiveBranchId, setActiveAcademicYearId } = useOperationalContext();
  const branches = useOperationalContextStore((s) => s.branches);
  const years = useOperationalContextStore((s) => s.years);
  // One source with the sidebar (useActiveContextLabels)
  const { branchName: activeBranchName, yearName: activeYearName } = useActiveContextLabels();

  return (
    <Group gap="xs" wrap="nowrap" visibleFrom="xs">
      <Menu width={240} position="bottom-start">
        <Menu.Target>
          <Box>
            <ContextPill icon={<IconBuildingCommunity size={16} stroke={1.6} />} label={activeBranchName} accent />
          </Box>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>الفرع النشط</Menu.Label>
          {branches.map((b) => {
            const isSelected = b.id === activeBranchId;
            return (
              <Menu.Item
                key={b.id}
                leftSection={<IconBuildingCommunity size={15} stroke={1.6} />}
                style={{ fontWeight: isSelected ? 500 : 400 }}
                color={isSelected ? 'brand' : undefined}
                onClick={() => {
                  setActiveBranchId(b.id);
                }}
              >
                {b.name}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>

      <Menu width={240} position="bottom-start">
        <Menu.Target>
          <Box visibleFrom="sm">
            <ContextPill icon={<IconCalendarEvent size={16} stroke={1.6} />} label={activeYearName} />
          </Box>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>السنة الدراسية النشطة</Menu.Label>
          {years.map((y) => {
            const isSelected = y.id === activeAcademicYearId;
            return (
              <Menu.Item
                key={y.id}
                leftSection={<IconCalendarEvent size={15} stroke={1.6} />}
                style={{ fontWeight: isSelected ? 500 : 400 }}
                color={isSelected ? 'brand' : undefined}
                onClick={() => {
                  setActiveAcademicYearId(y.id);
                }}
              >
                {y.name} {y.isCurrent ? '(الحالية)' : ''}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
