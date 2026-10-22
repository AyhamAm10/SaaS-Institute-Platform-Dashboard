'use client';

import React from 'react';
import { Badge, Box, Group, rem, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useStepperMirror } from '../store/useStepperMirror';

export interface AppStepperSidebarProps {
  children?: React.ReactNode;
}

export function AppStepperSidebar({ children }: AppStepperSidebarProps) {
  const steps = useStepperMirror('steps');
  const active = useStepperMirror('active');
  const config = useStepperMirror('config');
  const goToStep = useStepperMirror('goToStep');
  const rawProps = useStepperMirror('rawProps');

  const handleStepClick = (stepIndex: number) => {
    if (config.allowStepSelect || stepIndex < active) {
      if (rawProps.onStepClick) {
        rawProps.onStepClick(stepIndex);
      } else {
        goToStep(stepIndex);
      }
    }
  };

  return (
    <Box
      visibleFrom="md"
      w={typeof config.sidebarWidth === 'number' ? rem(config.sidebarWidth) : config.sidebarWidth}
      style={{
        flexShrink: 0,
        position: 'sticky',
        top: rem(24),
        paddingTop: rem(6),
      }}
    >
      <Stack gap={rem(32)}>
        <Stack gap={rem(44)} style={{ position: 'relative' }}>
        {steps.map((s, idx) => {
          const isCompleted = s.step < active;
          const isCurrent = s.step === active;
          const isClickable = config.allowStepSelect || isCompleted;
          const isLast = idx === steps.length - 1;

          return (
            <UnstyledButton
              key={s.step}
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
                      fw={isCurrent ? 700 : isCompleted ? 600 : 500}
                      c={isCurrent ? '#491d2b' : isCompleted ? '#351b25' : '#806c69'}
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
                          backgroundColor: '#f0e3d8',
                          color: '#8b6a34',
                          fontWeight: 600,
                        }}
                      >
                        مكتملة
                      </Badge>
                    )}
                  </Group>

                  {s.description && (
                    <Text
                      size="xs"
                      c="#806c69"
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
                  {/* Vertical connecting line to the next circle */}
                  {!isLast && (
                    <Box
                      style={{
                        position: 'absolute',
                        top: rem(40),
                        bottom: rem(-44), // Bridges the gap="44px" to the next circle
                        width: rem(2.5),
                        backgroundColor: isCompleted
                          ? '#c4a66b'
                          : '#e5d9cf',
                        transition: 'background-color 0.25s ease',
                        zIndex: 1,
                      }}
                    />
                  )}

                  {/* Circle Badge */}
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
                        ? '#c4a66b'
                        : isCurrent
                        ? '#491d2b'
                        : '#fffaf5',
                      border:
                        isCompleted || isCurrent
                          ? 'none'
                          : '1.5px solid #e5d9cf',
                      color:
                        isCompleted || isCurrent
                          ? '#ffffff'
                          : '#9d817a',
                      boxShadow: isCurrent
                        ? '0 6px 18px rgba(73, 29, 43, 0.25)'
                        : 'none',
                    }}
                  >
                    {isCompleted ? (
                      <IconCheck size={18} stroke={2.5} />
                    ) : (
                      <Text size="sm" fw={700}>
                        {s.step + 1}
                      </Text>
                    )}
                  </Box>
                </Box>
              </Group>
            </UnstyledButton>
          );
        })}
        </Stack>

        {children}
      </Stack>
    </Box>
  );
}
