'use client';

import React, { Children, isValidElement, ReactNode } from 'react';
import { Box, Flex, Group, rem, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { useStepperMirror } from '../store/useStepperMirror';
import { AppStepperSidebar } from './AppStepperSidebar';
import { AppStepperActions } from './AppStepperActions';

export interface AppStepperRootProps {
  children?: ReactNode;
}

export function AppStepperRoot({ children }: AppStepperRootProps) {
  const steps = useStepperMirror('steps');
  const active = useStepperMirror('active');
  const config = useStepperMirror('config');
  const goToStep = useStepperMirror('goToStep');

  const currentStepConfig = steps.find((s) => s.step === active);

  // Separate AppStepperActions from step row items
  const childrenArray = Children.toArray(children);
  const actionsChild = childrenArray.find(
    (child) =>
      isValidElement(child) &&
      (child.type === AppStepperActions ||
        (child.type as any)?.displayName === 'AppStepper.Actions'),
  );
  const stepChildren = childrenArray.filter(
    (child) =>
      !(
        isValidElement(child) &&
        (child.type === AppStepperActions ||
          (child.type as any)?.displayName === 'AppStepper.Actions')
      ),
  );

  return (
    <Box w="100%">
      {/* MOBILE PROGRESS BAR (hiddenFrom="md") */}
      <Box hiddenFrom="md" mb="lg">
        <Group justify="space-between" align="center" wrap="nowrap" mb="xs">
          {steps.map((s, idx) => {
            const isCompleted = s.step < active;
            const isCurrent = s.step === active;
            const isClickable = config.allowStepSelect || isCompleted;

            return (
              <React.Fragment key={s.step}>
                <UnstyledButton
                  onClick={() => isClickable && goToStep(s.step)}
                  style={{
                    cursor: isClickable ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: rem(4),
                  }}
                >
                  <Box
                    style={{
                      width: rem(32),
                      height: rem(32),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isCompleted
                        ? 'var(--mantine-color-teal-6)'
                        : isCurrent
                        ? 'var(--mantine-color-primary-6)'
                        : 'var(--mantine-color-body)',
                      border:
                        isCompleted || isCurrent
                          ? 'none'
                          : '1.5px solid var(--mantine-color-gray-3)',
                      color: isCompleted || isCurrent ? '#ffffff' : 'var(--mantine-color-gray-6)',
                      boxShadow: isCurrent
                        ? '0 2px 8px rgba(var(--mantine-color-primary-6-rgb), 0.35)'
                        : 'none',
                    }}
                  >
                    {isCompleted ? (
                      <IconCheck size={16} stroke={2.5} />
                    ) : (
                      <Text size="xs" fw={700}>
                        {s.step + 1}
                      </Text>
                    )}
                  </Box>
                </UnstyledButton>

                {idx < steps.length - 1 && (
                  <Box
                    style={{
                      flex: 1,
                      height: rem(2),
                      backgroundColor:
                        idx < active
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

        {currentStepConfig && (
          <Box pt="xs" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
            <Text size="sm" fw={700} c="primary.8">
              {currentStepConfig.label}
            </Text>
            {currentStepConfig.description && (
              <Text size="xs" c="dimmed">
                {currentStepConfig.description}
              </Text>
            )}
          </Box>
        )}
      </Box>

      {/* DESKTOP SPLIT VIEW: Right Timeline Sidebar (with Actions under it!) + Left Collapsible Row Items Stack */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 'lg', md: rem(40) }}
        align="flex-start"
        w="100%"
      >
        {/* Right Column (in RTL): Vertical Stepper Sidebar Timeline + Actions underneath it */}
        <AppStepperSidebar>
          {actionsChild}
        </AppStepperSidebar>

        {/* Left Column (in RTL): Collapsible Row Items Stack (Free of buttons) */}
        <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
          {stepChildren}

          {/* Render actions here on mobile view only */}
          {actionsChild && (
            <Box hiddenFrom="md" mt="md">
              {actionsChild}
            </Box>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
