import React, { ReactNode } from 'react';
import { MantineSize, MantineRadius } from '@mantine/core';
import {
  IconPhone,
  IconMail,
  IconSearch,
  IconLock,
  IconHash,
  IconWorld,
} from '@tabler/icons-react';

export type InputType =
  | 'text'
  | 'password'
  | 'number'
  | 'email'
  | 'tel'
  | 'search'
  | 'url'
  | 'textarea';

/**
 * Props accepted by the InputController.
 * Matches standard Mantine input options plus type-specific configurations.
 */
export interface InputInitialProps {
  type?: InputType;
  name?: string;
  id?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | number | string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  withAsterisk?: boolean;
  size?: MantineSize;
  radius?: MantineRadius;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  clearable?: boolean;
  dir?: 'rtl' | 'ltr' | 'auto';
  autoFocus?: boolean;
  autoComplete?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  minRows?: number;
  maxRows?: number;
  autosize?: boolean;
  className?: string;
  style?: React.CSSProperties;
  styles?: Record<string, any>;
  [key: string]: any;
}

export interface ResolvedInputConfig {
  type: InputType;
  direction: 'rtl' | 'ltr' | 'auto';
  textAlign: 'right' | 'left' | 'start';
  defaultLeftSection: ReactNode;
  size: MantineSize;
  radius: MantineRadius;
}

/**
 * Pure initialization function deriving configuration from props.
 */
export function resolveInputConfig(props: InputInitialProps): ResolvedInputConfig {
  const type: InputType = props.type ?? 'text';

  // Determine direction: Numbers, phones, emails, passwords, and URLs are naturally LTR
  const isLtrType =
    type === 'tel' ||
    type === 'email' ||
    type === 'password' ||
    type === 'number' ||
    type === 'url';

  const direction: 'rtl' | 'ltr' | 'auto' = props.dir ?? (isLtrType ? 'ltr' : 'rtl');
  const textAlign: 'right' | 'left' | 'start' =
    direction === 'ltr' ? 'left' : direction === 'rtl' ? 'right' : 'start';

  // Smart default icons when leftSection is not explicitly provided
  let defaultLeftSection: ReactNode = props.leftSection;
  if (!defaultLeftSection) {
    switch (type) {
      case 'tel':
        defaultLeftSection = React.createElement(IconPhone, { size: 18, stroke: 1.6 });
        break;
      case 'email':
        defaultLeftSection = React.createElement(IconMail, { size: 18, stroke: 1.6 });
        break;
      case 'search':
        defaultLeftSection = React.createElement(IconSearch, { size: 18, stroke: 1.6 });
        break;
      case 'password':
        defaultLeftSection = React.createElement(IconLock, { size: 18, stroke: 1.6 });
        break;
      case 'number':
        defaultLeftSection = React.createElement(IconHash, { size: 18, stroke: 1.6 });
        break;
      case 'url':
        defaultLeftSection = React.createElement(IconWorld, { size: 18, stroke: 1.6 });
        break;
      default:
        defaultLeftSection = undefined;
    }
  }

  return {
    type,
    direction,
    textAlign,
    defaultLeftSection,
    size: props.size ?? 'md',
    radius: props.radius ?? 'md',
  };
}
