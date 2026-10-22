'use client';

import { ReactNode } from 'react';
import { Badge, Box, Group, rem, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
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
        padding: `${rem(16)} ${rem(22)}`,
        borderRadius: 0,
        userSelect: 'none',
        backgroundColor: isOpen ? '#f5eee6' : 'transparent',
        borderBottom: isOpen ? '1px solid #e5d9cf' : 'none',
        transition: 'background-color 0.2s ease',
      }}
    >
      {children ? (
        children
      ) : (
        <Group justify="space-between" align="center" wrap="nowrap">
          {/* Right side in RTL: Indicator badge & step labels */}
          <Group gap="sm" align="center" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            {/* Small status circle */}
            <Box
              style={{
                width: rem(26),
                height: rem(26),
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backgroundColor: isCompleted
                  ? '#c4a66b'
                  : isCurrent
                  ? '#491d2b'
                  : '#f0e3d8',
                color: isCompleted || isCurrent ? '#ffffff' : '#806c69',
                border: isCompleted || isCurrent ? 'none' : '1px solid #e5d9cf',
                transition: 'all 0.2s ease',
              }}
            >
              {isCompleted ? (
                <IconCheck size={14} stroke={2.5} />
              ) : (
                <Text size="xs" fw={700}>
                  {step + 1}
                </Text>
              )}
            </Box>

            <Stack gap={rem(2)} style={{ flex: 1, minWidth: 0 }}>
              <Group gap="xs" align="center" wrap="nowrap">
                <Text
                  size="sm"
                  fw={isOpen ? 700 : 600}
                  c={isOpen ? '#491d2b' : isCompleted ? '#351b25' : '#806c69'}
                  lineClamp={1}
                >
                  {label}
                </Text>

                {isCompleted && (
                  <Badge
                    size="xs"
                    radius="sm"
                    style={{
                      backgroundColor: '#f0e3d8',
                      color: '#8b6a34',
                      fontWeight: 600,
                    }}
                  >
                    مكتمل
                  </Badge>
                )}
                {isCurrent && (
                  <Badge variant="light" color="primary" size="xs" radius="sm">
                    الخطوة الحالية
                  </Badge>
                )}
              </Group>

              {description && (
                <Text size="xs" c="#806c69" lineClamp={1}>
                  {description}
                </Text>
              )}
            </Stack>
          </Group>

          {/* Left side in RTL: Animated Chevron indicator */}
          <Box
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              color: isOpen ? '#491d2b' : '#9d817a',
            }}
          >
            <IconChevronDown size={18} />
          </Box>
        </Group>
      )}
    </UnstyledButton>
  );
}

AppStepperStepHeader.displayName = 'AppStepperStep.Header';
