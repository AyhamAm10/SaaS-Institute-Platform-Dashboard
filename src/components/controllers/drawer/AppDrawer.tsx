'use client';

import React, { Children, isValidElement, useEffect, useState } from 'react';
import { AppDrawerInitialProps } from './init/drawer.init';
import { DrawerContext, createDrawerStore } from './store/drawer.store';
import {
  AppDrawerActions,
  AppDrawerCancel,
  AppDrawerClose,
  AppDrawerContent,
  AppDrawerDescription,
  AppDrawerDetail,
  AppDrawerDetails,
  AppDrawerFooter,
  AppDrawerFooterEnd,
  AppDrawerFooterStart,
  AppDrawerHeader,
  AppDrawerIcon,
  AppDrawerRoot,
  AppDrawerSection,
  AppDrawerSectionHeader,
  AppDrawerSubmit,
  AppDrawerTitle,
  AppDrawerToolbar,
} from './ui';

export interface AppDrawerProps extends AppDrawerInitialProps {}

/**
 * AppDrawer
 *
 * Authoritative, Project-Owned Drawer Component System for the SaaS Platform.
 * Built adhering strictly to role.md (Layered Architecture, Isolated Zustand Store, Mantine-Only primitives).
 *
 * Supports both:
 * 1. Simple Usage:
 *    <AppDrawer opened={opened} onClose={onClose} title="Title" description="Desc">
 *      <Children />
 *    </AppDrawer>
 *
 * 2. Full Compound Composition:
 *    <AppDrawer opened={opened} onClose={onClose}>
 *      <AppDrawer.Header>
 *        <AppDrawer.Icon />
 *        <AppDrawer.Title />
 *        <AppDrawer.Close />
 *      </AppDrawer.Header>
 *      <AppDrawer.Toolbar>...</AppDrawer.Toolbar>
 *      <AppDrawer.Content>...</AppDrawer.Content>
 *      <AppDrawer.Footer>...</AppDrawer.Footer>
 *    </AppDrawer>
 */
export function AppDrawer(props: AppDrawerProps) {
  const [store] = useState(() => createDrawerStore(props));

  // Sync external controlled props into the isolated store
  useEffect(() => {
    store.getState().updateProps(props);
  }, [
    props.opened,
    props.loading,
    props.title,
    props.description,
    props.icon,
    props.size,
    props.position,
    props.padding,
    props.withCloseButton,
    props.closeOnClickOutside,
    props.closeOnEscape,
    props.onClose,
    store,
  ]);

  // Determine if consumer passed compound components or raw simple children
  const childrenArray = Children.toArray(props.children);
  const hasCompoundHeader = childrenArray.some(
    (child) => isValidElement(child) && (child.type === AppDrawerHeader || (child.type as any)?.displayName === 'AppDrawerHeader'),
  );
  const hasCompoundContent = childrenArray.some(
    (child) => isValidElement(child) && (child.type === AppDrawerContent || (child.type as any)?.displayName === 'AppDrawerContent'),
  );

  const isCompoundMode = hasCompoundHeader || hasCompoundContent;

  const content = isCompoundMode ? (
    props.children
  ) : (
    <>
      <AppDrawerHeader />
      <AppDrawerContent>{props.children}</AppDrawerContent>
    </>
  );

  return (
    <DrawerContext.Provider value={store}>
      <AppDrawerRoot zIndex={props.zIndex}>
        {content}
      </AppDrawerRoot>
    </DrawerContext.Provider>
  );
}

// Compound component attachments
AppDrawer.Header = AppDrawerHeader;
AppDrawer.Title = AppDrawerTitle;
AppDrawer.Description = AppDrawerDescription;
AppDrawer.Icon = AppDrawerIcon;
AppDrawer.Actions = AppDrawerActions;
AppDrawer.Close = AppDrawerClose;
AppDrawer.Toolbar = AppDrawerToolbar;
AppDrawer.Content = AppDrawerContent;
AppDrawer.Section = AppDrawerSection;
AppDrawer.SectionHeader = AppDrawerSectionHeader;
AppDrawer.Details = AppDrawerDetails;
AppDrawer.Detail = AppDrawerDetail;
AppDrawer.Footer = AppDrawerFooter;
AppDrawer.FooterStart = AppDrawerFooterStart;
AppDrawer.FooterEnd = AppDrawerFooterEnd;
AppDrawer.Cancel = AppDrawerCancel;
AppDrawer.Submit = AppDrawerSubmit;
AppDrawer.Root = AppDrawerRoot;
