import React, { ReactNode } from 'react';
import { MantineSize, MantineRadius } from '@mantine/core';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';

// Ensure Arabic locale is active by default
dayjs.locale('ar');

export interface DatePickerProps {
  name?: string;
  id?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  value?: string | Date | null;
  defaultValue?: string | Date | null;
  onChange?: (value: string | null) => void;
  minDate?: string | Date | null;
  maxDate?: string | Date | null;
  required?: boolean;
  withAsterisk?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: MantineSize;
  radius?: MantineRadius;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  dropdownType?: 'popover' | 'modal';
  locale?: string;
  valueFormat?: string;
  className?: string;
  style?: React.CSSProperties;
  styles?: Record<string, any>;
  [key: string]: any;
}

export interface ResolvedDatePickerConfig {
  placeholder: string;
  clearable: boolean;
  disabled: boolean;
  readOnly: boolean;
  size: MantineSize;
  radius: MantineRadius;
  valueFormat: string;
  locale: string;
}

/**
 * Pure helper to parse various date formats into a standard JS Date object.
 */
export function parseDateValue(val: string | Date | null | undefined): Date | null {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  const d = dayjs(val);
  return d.isValid() ? d.toDate() : null;
}

/**
 * Pure helper to format a JS Date object into standard ISO YYYY-MM-DD string.
 */
export function formatDateToISO(val: Date | null | undefined): string | null {
  if (!val || isNaN(val.getTime())) return null;
  return dayjs(val).format('YYYY-MM-DD');
}

/**
 * Resolves static configuration from initial props.
 */
export function resolveDatePickerConfig(props: DatePickerProps): ResolvedDatePickerConfig {
  return {
    placeholder: props.placeholder ?? 'اختر التاريخ...',
    clearable: props.clearable ?? true,
    disabled: props.disabled ?? false,
    readOnly: props.readOnly ?? false,
    size: props.size ?? 'sm',
    radius: props.radius ?? 'md',
    valueFormat: props.valueFormat ?? 'YYYY-MM-DD',
    locale: props.locale ?? 'ar',
  };
}
