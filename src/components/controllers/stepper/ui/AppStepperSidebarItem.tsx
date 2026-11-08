'use client';

import { Badge, Box, Group, rem, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { StepConfig } from '../init/stepper.init';

interface AppStepperSidebarItemProps {
  s: StepConfig;
  isCompleted: boolean;
  isCurrent: boolean;
  isClickable: boolean;
  isLast: boolean;
  handleStepClick: (step: number) => void;
}

/** One step in the sidebar: labels, status tag, numbered circle and the connector line. */
export function AppStepperSidebarItem({
  s,
  isCompleted,
  isCurrent,
  isClickable,
  isLast,
  handleStepClick,
}: AppStepperSidebarItemProps) {
  return (
    <UnstyledButton
      onClick={() => isClickable && handleStepClick(s.step)}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        userSelect: 'none',
        display: 'block',
        width: '100%',
      }}
    >
      <Group align="flex-start" justify="space-between" wrap="nowrap" gap="md">
        {/* Step Labels: Title, Description & Status Tag */}
        <Stack gap={rem(4)} style={{ flex: 1, textAlign: 'right' }}>
          <Group gap="xs" align="center" wrap="nowrap">
            <Text
              size="md"
              fw={isCurrent ? 500 : 400}
              c={
                isCurrent
                  ? 'var(--mantine-color-primary-filled)'
                  : isCompleted
                    ? 'var(--app-text-primary)'
                    : 'var(--app-text-muted)'
              }
              style={{
                transition: 'color 0.2s ease',
                fontSize: rem(14.5),
              }}
            >
              {s.label}
            </Text>

            {isCurrent && (
              <Badge size="xs" variant="light" color="primary" radius="sm">
                قيد التعبئة
              </Badge>
            )}
            {isCompleted && (
              <Badge
                size="xs"
                radius="sm"
                style={{
                  backgroundColor: 'var(--app-badge-bg)',
                  color: 'var(--app-badge-text)',
                  fontWeight: 500,
                }}
              >
                مكتملة
              </Badge>
            )}
          </Group>

          {s.description && (
            <Text
              size="xs"
              c="var(--app-text-secondary)"
              lineClamp={2}
              style={{
                lineHeight: 1.5,
                opacity: isCurrent ? 0.95 : isCompleted ? 0.8 : 0.65,
                fontSize: rem(12),
              }}
            >
              {s.description}
            </Text>
          )}
        </Stack>

        {/* Circular Badge & Vertical Connector Line */}
        <Box
          style={{
            position: 'relative',
            width: rem(40),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {!isLast && (
            <Box
              style={{
                position: 'absolute',
                top: rem(40),
                bottom: rem(-44), // Bridges the gap="44px" to the next circle
                width: rem(2.5),
                backgroundColor: isCompleted ? 'var(--app-brand-accent)' : 'var(--app-border)',
                transition: 'background-color 0.25s ease',
                zIndex: 1,
              }}
            />
          )}
          <Box
            style={{
              width: rem(40),
              height: rem(40),
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              transition: 'all 0.25s ease',
              backgroundColor: isCompleted
                ? 'var(--app-brand-accent)'
                : isCurrent
                  ? 'var(--mantine-color-primary-filled)'
                  : 'var(--app-surface)',
              border: isCompleted || isCurrent ? 'none' : '1.5px solid var(--app-border)',
              color: isCompleted || isCurrent ? 'var(--app-text-on-brand)' : 'var(--app-text-muted)',
              boxShadow: isCurrent ? '0 0 0 4px var(--app-brand-accent-ring), var(--app-elev-1)' : 'none',
            }}
          >
            {isCompleted ? (
              <IconCheck size={18} stroke={2.5} />
            ) : (
              <Text size="sm" fw={500}>
                {s.step + 1}
              </Text>
            )}
          </Box>
        </Box>
      </Group>
    </UnstyledButton>
  );
}
