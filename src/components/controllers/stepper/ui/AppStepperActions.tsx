'use client';

import { ReactNode } from 'react';
import { Box, Button, Group, rem, Stack } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { useStepperMirror } from '../store/useStepperMirror';

export interface AppStepperActionsProps {
  onPrev?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disableNext?: boolean;
  disablePrev?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  cancelLabel?: string;
  secondaryAction?: ReactNode;
}

export function AppStepperActions({
  onPrev,
  onNext,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disableNext = false,
  disablePrev = false,
  prevLabel = 'السابق',
  nextLabel = 'متابعة للخطوة التالية',
  submitLabel = 'حفظ وتأكيد',
  cancelLabel = 'إلغاء والعودة',
  secondaryAction,
}: AppStepperActionsProps) {
  const active = useStepperMirror('active');
  const totalSteps = useStepperMirror('totalSteps');
  const nextStep = useStepperMirror('nextStep');
  const prevStep = useStepperMirror('prevStep');

  const isFirstStep = active === 0;
  const isLastStep = active === totalSteps - 1;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      void nextStep();
    }
  };

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else {
      void prevStep();
    }
  };

  return (
    <Stack
      gap="xs"
      pt="md"
      style={{
        borderTop: '1.5px solid #e5d9cf',
        width: '100%',
      }}
    >
      {/* Primary Action Button (Next / Submit) */}
      {!isLastStep && (
        <Button
          fullWidth
          variant="filled"
          color="primary"
          radius="md"
          size="md"
          onClick={handleNext}
          leftSection={<IconArrowLeft size={16} />}
          disabled={disableNext || isSubmitting}
          style={{
            boxShadow: '0 4px 14px rgba(73, 29, 43, 0.18)',
          }}
        >
          {nextLabel}
        </Button>
      )}

      {isLastStep && onSubmit && (
        <Button
          fullWidth
          variant="filled"
          color="primary"
          radius="md"
          size="md"
          onClick={onSubmit}
          loading={isSubmitting}
          leftSection={<IconCheck size={16} />}
          style={{
            boxShadow: '0 4px 14px rgba(73, 29, 43, 0.22)',
          }}
        >
          {submitLabel}
        </Button>
      )}

      {/* Secondary Actions: Previous & Cancel */}
      <Group justify="space-between" align="center" wrap="nowrap" mt={rem(2)}>
        {!isFirstStep ? (
          <Button
            variant="default"
            radius="md"
            size="xs"
            onClick={handlePrev}
            rightSection={<IconArrowRight size={14} />}
            disabled={disablePrev || isSubmitting}
            style={{
              borderColor: '#e5d9cf',
              color: '#806c69',
              backgroundColor: '#fffaf5',
            }}
          >
            {prevLabel}
          </Button>
        ) : (
          <Box />
        )}

        <Group gap="xs">
          {secondaryAction}

          {onCancel && (
            <Button
              variant="subtle"
              color="gray"
              radius="md"
              size="xs"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
          )}
        </Group>
      </Group>
    </Stack>
  );
}

AppStepperActions.displayName = 'AppStepper.Actions';
