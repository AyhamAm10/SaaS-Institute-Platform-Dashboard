'use client';

import { Box, Group, SegmentedControl, Text, rem } from '@mantine/core';
import { useTabsMirror } from '../store/useTabsMirror';

/**
 * Pill tab strip with an ink indicator that slides between options.
 * Built on SegmentedControl, whose indicator animation is native to Mantine.
 */
export function AppTabsList() {
  const items = useTabsMirror('items');
  const active = useTabsMirror('active');
  const config = useTabsMirror('config');
  const setActive = useTabsMirror('setActive');

  return (
    <SegmentedControl
      value={active}
      onChange={setActive}
      fullWidth={config.fullWidth}
      size={config.size}
      radius="xl"
      color="primary"
      transitionDuration={320}
      transitionTimingFunction="cubic-bezier(0.16, 1, 0.3, 1)"
      data={items.map((item) => ({
        value: item.value,
        disabled: item.disabled,
        label: (
          <Group gap={6} justify="center" wrap="nowrap">
            {item.icon}
            <Text span inherit fw={item.value === active ? 500 : 400}>
              {item.label}
            </Text>
            {item.count !== undefined && (
              <Box
                component="span"
                style={{
                  minWidth: rem(20),
                  padding: `0 ${rem(6)}`,
                  borderRadius: 'var(--app-radius-pill)',
                  fontSize: rem(11),
                  lineHeight: rem(18),
                  textAlign: 'center',
                  backgroundColor: item.value === active ? 'var(--app-brand-accent)' : 'var(--app-sidebar-subtle)',
                  color: item.value === active ? 'var(--app-text-on-brand)' : 'var(--app-text-secondary)',
                }}
              >
                {item.count}
              </Box>
            )}
          </Group>
        ),
      }))}
    />
  );
}
