'use client';

import React, { Children, isValidElement, ReactNode, useMemo } from 'react';
import { Box, Group, Paper, Stack, Text, ThemeIcon, rem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { AppStepperContext, AppStepperStepConfig } from './AppStepperContext';
import { AppStepperStep, AppStepperStepProps } from './AppStepperStep';
import { AppStepperActions } from './AppStepperActions';

export interface AppStepperProps {
  active: number;
  onStepClick?: (step: number) => void;
  allowStepSelect?: boolean;
  children: ReactNode;
}

export function AppStepper({
  active,
  onStepClick,
  allowStepSelect = false,
  children,
}: AppStepperProps) {
  // Extract steps configuration from children
  const steps = useMemo(() => {
    const list: AppStepperStepConfig[] = [];
    Children.forEach(children, (child) => {
      if (isValidElement<AppStepperStepProps>(child) && child.type === AppStepperStep) {
        list.push({
          step: child.props.step,
          label: child.props.label,
          description: child.props.description,
          icon: child.props.icon,
        });
      }
    });
    return list.sort((a, b) => a.step - b.step);
  }, [children]);

  const totalSteps = steps.length;

  const contextValue = useMemo(
    () => ({
      active,
      totalSteps,
      steps,
      registerStep: () => {},
      onStepClick,
      allowStepSelect,
    }),
    [active, totalSteps, steps, onStepClick, allowStepSelect],
  );

  return (
    <AppStepperContext.Provider value={contextValue}>
      <Box w="100%">
        {/* Header Steps Bar — Clean, Flat, Seamless */}
        <Paper
          p="sm"
          px="md"
          radius="md"
          withBorder
          mb="md"
          style={{
            backgroundColor: 'var(--mantine-color-body)',
            borderColor: 'var(--mantine-color-gray-2)',
            borderRadius: rem(8),
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
          }}
        >
          <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
            {steps.map((s, idx) => {
              const isCompleted = s.step < active;
              const isCurrent = s.step === active;
              const isClickable = allowStepSelect && onStepClick && (isCompleted || isCurrent);

              return (
                <React.Fragment key={s.step}>
                  <Group
                    gap="xs"
                    wrap="nowrap"
                    onClick={() => isClickable && onStepClick(s.step)}
                    style={{
                      cursor: isClickable ? 'pointer' : 'default',
                      opacity: isCurrent || isCompleted ? 1 : 0.65,
                      userSelect: 'none',
                    }}
                  >
                    <ThemeIcon
                      size={30}
                      radius="md"
                      color={isCompleted ? 'teal' : isCurrent ? 'primary' : 'gray'}
                      variant={isCompleted || isCurrent ? 'filled' : 'light'}
                    >
                      {isCompleted ? (
                        <IconCheck size={16} stroke={2.5} />
                      ) : s.icon ? (
                        s.icon
                      ) : (
                        <Text size="xs" fw={700}>
                          {s.step + 1}
                        </Text>
                      )}
                    </ThemeIcon>

                    <Stack gap={0} visibleFrom="sm">
                      <Text
                        size="xs"
                        fw={isCurrent ? 700 : 500}
                        c={isCurrent ? 'primary.8' : 'inherit'}
                        style={{ fontSize: rem(12.5) }}
                      >
                        {s.label}
                      </Text>
                      {s.description && (
                        <Text size="11px" c="dimmed" lineClamp={1}>
                          {s.description}
                        </Text>
                      )}
                    </Stack>
                  </Group>

                  {idx < steps.length - 1 && (
                    <Box
                      style={{
                        flex: 1,
                        height: rem(1.5),
                        backgroundColor: isCompleted
                          ? 'var(--mantine-color-teal-6)'
                          : 'var(--mantine-color-gray-2)',
                        transition: 'background-color 0.2s ease',
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Group>
        </Paper>

        {/* Content & Actions (Unboxed, fills the page) */}
        {children}
      </Box>
    </AppStepperContext.Provider>
  );
}

AppStepper.Step = AppStepperStep;
AppStepper.Actions = AppStepperActions;
