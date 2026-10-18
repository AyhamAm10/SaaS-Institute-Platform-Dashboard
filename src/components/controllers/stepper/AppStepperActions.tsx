'use client';

import { Button, Group } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { useAppStepperContext } from './AppStepperContext';

export interface AppStepperActionsProps {
  onPrev?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  disableNext?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

export function AppStepperActions({
  onPrev,
  onNext,
  onSubmit,
  onCancel,
  isSubmitting = false,
  disableNext = false,
  prevLabel = 'السابق',
  nextLabel = 'التالي',
  submitLabel = 'حفظ وتأكيد',
  cancelLabel = 'إلغاء',
}: AppStepperActionsProps) {
  const { active, totalSteps } = useAppStepperContext();
  const isFirstStep = active === 0;
  const isLastStep = active === totalSteps - 1;

  return (
    <Group justify="space-between" mt="lg" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
      <Group gap="xs">
        {onCancel && (
          <Button variant="subtle" color="gray" radius="md" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        {!isFirstStep && onPrev && (
          <Button
            variant="default"
            radius="md"
            size="sm"
            onClick={onPrev}
            rightSection={<IconArrowRight size={15} />}
            disabled={isSubmitting}
          >
            {prevLabel}
          </Button>
        )}
      </Group>

      <Group gap="xs">
        {!isLastStep && onNext && (
          <Button
            variant="filled"
            color="primary"
            radius="md"
            size="sm"
            onClick={onNext}
            leftSection={<IconArrowLeft size={15} />}
            disabled={disableNext || isSubmitting}
          >
            {nextLabel}
          </Button>
        )}

        {isLastStep && onSubmit && (
          <Button
            variant="filled"
            color="teal"
            radius="md"
            size="sm"
            onClick={onSubmit}
            loading={isSubmitting}
            leftSection={<IconCheck size={15} />}
          >
            {submitLabel}
          </Button>
        )}
      </Group>
    </Group>
  );
}

AppStepperActions.displayName = 'AppStepper.Actions';
