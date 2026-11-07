import type { ComponentType } from 'react';
import type { LookupResource } from '@/src/core/api';

export type LookupFormValue = string | number | boolean | null;

/** Source of select options loaded by the controller. */
export type LookupOptionsSource = 'cities';

export interface LookupFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'tel' | 'number' | 'select' | 'tone' | 'switch';
  required?: boolean;
  placeholder?: string;
  description?: string;
  defaultValue?: LookupFormValue;
  /** For `select` fields. */
  options?: LookupOptionsSource;
  /** Only sent on create (e.g. immutable after creation). */
  createOnly?: boolean;
}

export interface LookupColumnConfig {
  field: string;
  title: string;
  render: 'text' | 'phone' | 'tone' | 'default' | 'active' | 'option';
  options?: LookupOptionsSource;
}

/**
 * Everything the generic LookupController needs to manage one reference
 * table: its API resource, labels, form fields and extra table columns.
 */
export interface LookupConfig {
  key: string;
  resource: LookupResource;
  title: string;
  /** Singular noun used in buttons and messages, e.g. "مدينة". */
  singular: string;
  description: string;
  icon: ComponentType<{ size?: number | string; stroke?: number }>;
  fields: LookupFieldConfig[];
  columns: LookupColumnConfig[];
}
