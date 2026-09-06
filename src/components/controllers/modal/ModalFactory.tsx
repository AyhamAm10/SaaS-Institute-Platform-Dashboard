'use client';

import React from 'react';
import { Stack, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { AppModal } from './AppModal';

export interface DeleteConfirmationModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  itemName?: string;
  warningMessage?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

/**
 * DeleteConfirmationModalFactory
 *
 * Pre-configured modal factory variant for destructive confirmation workflows.
 * Lives directly in the modal controller directory to encapsulate specialized modal variants.
 */
export function DeleteConfirmationModal({
  opened,
  onClose,
  onConfirm,
  title = 'تأكيد الحذف',
  description = 'هذا الإجراء نهائي ولا يمكن التراجع عنه',
  itemName,
  warningMessage,
  confirmLabel = 'نعم، قم بالحذف',
  cancelLabel = 'إلغاء',
  isLoading = false,
}: DeleteConfirmationModalProps) {
  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      variant="danger"
      size="sm"
    >
      <AppModal.Header>
        <AppModal.Icon icon={<IconTrash size={20} />} />
        <AppModal.Title>{title}</AppModal.Title>
        <AppModal.Description>{description}</AppModal.Description>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="sm">
          {itemName && (
            <Text size="sm">
              هل أنت متأكد من رغبتك في حذف <Text span fw={700} c="red.8">«{itemName}»</Text>؟
            </Text>
          )}

          {warningMessage && (
            <Text size="xs" c="dimmed">
              {warningMessage}
            </Text>
          )}
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel disabled={isLoading}>
            {cancelLabel}
          </AppModal.Cancel>
          <AppModal.Confirm
            color="red"
            loading={isLoading}
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            leftSection={<IconTrash size={16} />}
          >
            {confirmLabel}
          </AppModal.Confirm>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}

// Backward compatibility / explicit factory export alias
export const DeleteConfirmationModalFactory = DeleteConfirmationModal;
