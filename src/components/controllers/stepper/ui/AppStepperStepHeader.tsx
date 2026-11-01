'use client';

import { ReactNode } from 'react';
import { Box, Group, rem, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { StatusBadge } from '../../badge';
import { IconTile } from '../../info-tile';
import { useStepItemContext } from './StepItemContext';

export interface AppStepperStepHeaderProps {
  children?: ReactNode;
}

export function AppStepperStepHeader({ children }: AppStepperStepHeaderProps) {
  const { step, label, description, isOpen, isCompleted, isCurrent, toggleOpen } = useStepItemContext();

  return (
    <UnstyledButton
      onClick={toggleOpen}
      style={{
        display: 'block',
        width: '100%',
        padding: `${rem(18)} ${rem(22)}`,
        userSelect: 'none',
        borderBottom: isOpen ? '1px solid var(--app-border-subtle)' : '1px solid transparent',
        transition: 'border-color 0.2s ease',
      }}
    >
      {children ? (
        children
      ) : (
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="md" align="center" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            {/* Step marker: glossy orange when done, glossy ink when current, recessed when pending. */}
            {isCompleted || isCurrent ? (
              <IconTile tone={isCompleted ? 'brand' : 'ink'} size={36}>
                {isCompleted ? (
                  <IconCheck size={17} stroke={2.4} />
                ) : (
                  <Text fw={500} size="sm" c="inherit">
                    {step + 1}
                  </Text>
                )}
              </IconTile>
            ) : (
              <Box
                style={{
                  width: rem(36),
                  height: rem(36),
                  flexShrink: 0,
                  borderRadius: rem(12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--app-tabs-track)',
                  boxShadow: 'var(--app-tabs-track-shadow)',
                  color: 'var(--app-text-muted)',
                }}
              >
                <Text fw={500} size="sm" c="inherit">
                  {step + 1}
                </Text>
              </Box>
            )}

            <Stack gap={rem(3)} style={{ flex: 1, minWidth: 0 }}>
              <Group gap="xs" align="center" wrap="nowrap">
                <Text
                  fw={500}
                  lineClamp={1}
                  style={{
                    fontSize: rem(15),
                    color: isOpen || isCompleted ? 'var(--app-text-primary)' : 'var(--app-text-secondary)',
                  }}
                >
                  {label}
                </Text>
                {isCompleted && (
                  <StatusBadge tone="success" size="xs">
                    مكتمل
                  </StatusBadge>
                )}
                {isCurrent && (
                  <StatusBadge tone="brand" variant="dot" size="xs">
                    الخطوة الحالية
                  </StatusBadge>
                )}
              </Group>

              {description && (
                <Text size="xs" fw={300} c="var(--app-text-muted)" lineClamp={1}>
                  {description}
                </Text>
              )}
            </Stack>
          </Group>

          <Box
            style={{
              display: 'flex',
              color: 'var(--app-text-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s var(--app-ease-soft)',
            }}
          >
            <IconChevronDown size={18} stroke={1.6} />
          </Box>
        </Group>
      )}
    </UnstyledButton>
  );
}
