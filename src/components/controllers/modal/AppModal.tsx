'use client';

import React, { Children, isValidElement, useEffect, useState } from 'react';
import { AppModalInitialProps } from './init/modal.init';
import { ModalContext, createModalStore } from './store/modal.store';
import {
  AppModalActions,
  AppModalCancel,
  AppModalClose,
  AppModalConfirm,
  AppModalContent,
  AppModalDescription,
  AppModalFooter,
  AppModalFooterEnd,
  AppModalFooterStart,
  AppModalHeader,
  AppModalIcon,
  AppModalRoot,
  AppModalTitle,
} from './ui';

export interface AppModalProps extends AppModalInitialProps {}

/**
 * AppModal
 *
 * Authoritative, Project-Owned Modal Component System for the SaaS Platform.
 * Built adhering strictly to role.md (Layered Architecture, Isolated Zustand Store, Mantine-Only primitives).
 *
 * Distinct UX Responsibility from AppDrawer:
 * - AppModal is designed for focused decisions, warnings, confirmations, and compact workflows.
 * - AppDrawer is designed for complex forms, long content, and deep entity details.
 *
 * Supports both:
 * 1. Simple Usage:
 *    <AppModal opened={opened} onClose={onClose} title="Title" description="Desc" variant="danger">
 *      <Children />
 *    </AppModal>
 *
 * 2. Full Compound Composition:
 *    <AppModal opened={opened} onClose={onClose} variant="danger">
 *      <AppModal.Header>
 *        <AppModal.Icon />
 *        <AppModal.Title />
 *        <AppModal.Close />
 *      </AppModal.Header>
 *      <AppModal.Content>...</AppModal.Content>
 *      <AppModal.Footer>...</AppModal.Footer>
 *    </AppModal>
 */
export function AppModal(props: AppModalProps) {
  const [store] = useState(() => createModalStore(props));

  // Sync external controlled props into the isolated store
  useEffect(() => {
    store.getState().updateProps(props);
  }, [
    props.opened,
    props.loading,
    props.title,
    props.description,
    props.icon,
    props.variant,
    props.size,
    props.centered,
    props.radius,
    props.withCloseButton,
    props.closeOnClickOutside,
    props.closeOnEscape,
    props.onClose,
    store,
  ]);

  const childrenArray = Children.toArray(props.children);
  const hasCompoundHeader = childrenArray.some(
    (child) =>
      isValidElement(child) &&
      (child.type === AppModalHeader || (child.type as any)?.displayName === 'AppModalHeader'),
  );
  const hasCompoundContent = childrenArray.some(
    (child) =>
      isValidElement(child) &&
      (child.type === AppModalContent || (child.type as any)?.displayName === 'AppModalContent'),
  );

  const isCompoundMode = hasCompoundHeader || hasCompoundContent;

  const content = isCompoundMode ? (
    props.children
  ) : (
    <>
      <AppModalHeader />
      <AppModalContent>{props.children}</AppModalContent>
    </>
  );

  return (
    <ModalContext.Provider value={store}>
      <AppModalRoot zIndex={props.zIndex}>{content}</AppModalRoot>
    </ModalContext.Provider>
  );
}

// Compound component attachments
AppModal.Header = AppModalHeader;
AppModal.Title = AppModalTitle;
AppModal.Description = AppModalDescription;
AppModal.Icon = AppModalIcon;
AppModal.Actions = AppModalActions;
AppModal.Close = AppModalClose;
AppModal.Content = AppModalContent;
AppModal.Footer = AppModalFooter;
AppModal.FooterStart = AppModalFooterStart;
AppModal.FooterEnd = AppModalFooterEnd;
AppModal.Cancel = AppModalCancel;
AppModal.Confirm = AppModalConfirm;
AppModal.Root = AppModalRoot;
