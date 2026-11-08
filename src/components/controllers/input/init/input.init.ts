import React, { ReactNode } from 'react';
import { MantineSize, MantineRadius, ComboboxItem, ComboboxData } from '@mantine/core';
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
  | 'textarea'
  | 'select';

export type SelectDataType = ComboboxData | string[];

/** What an input reports on change: a DOM event (text inputs) or a value (select / number). */
export type InputChangeValue = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string | number | null;

/**
 * Props accepted by the InputController (AppInput / AppSelect).
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
  value?: string | number | null;
  defaultValue?: string | number | null;
  /**
   * Method syntax on purpose: callers may declare the narrower value they
   * expect (`(v: string | null) => …` for a select) without `any`.
   */
  onChange?(event: InputChangeValue, option?: ComboboxItem): void;
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
  searchable?: boolean;
  data?: SelectDataType;
  checkIconPosition?: 'left' | 'right';
  nothingFoundMessage?: ReactNode;
  maxDropdownHeight?: number | string;
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
  styles?: Record<string, React.CSSProperties>;
  /** Other Mantine props, forwarded as-is to the underlying input. */
  [key: string]: unknown;
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
  const type: InputType = props.type ?? (props.data ? 'select' : 'text');

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
