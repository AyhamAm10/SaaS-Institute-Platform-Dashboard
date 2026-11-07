'use client';

import { Group, Stack, Switch, Text } from '@mantine/core';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { TONE_OPTIONS } from '../../static-data/reference-data.data';
import { LookupFieldConfig } from '../lookup.config';
import { useLookupMirror, useLookupMirrorSelector } from '../store/useLookupMirror';

/**
 * LookupFieldInput
 *
 * Renders one configured form field of the lookup drawer.
 * ZERO useState hooks — value/error/options come from useLookupMirror.
 */
export function LookupFieldInput({ field }: { field: LookupFieldConfig }) {
  const value = useLookupMirrorSelector((s) => s.form[field.name]);
  const error = useLookupMirrorSelector((s) => s.formErrors[field.name]);
  const options = useLookupMirror('options');
  const setField = useLookupMirror('setField');

  if (field.type === 'switch') {
    return (
      <Group justify="space-between" wrap="nowrap" gap="md">
        <Stack gap={0}>
          <Text size="sm" fw={500}>
            {field.label}
          </Text>
          {field.description && (
            <Text size="xs" c="dimmed">
              {field.description}
            </Text>
          )}
        </Stack>
        <Switch
          checked={Boolean(value)}
          onChange={(e) => setField(field.name, e.currentTarget.checked)}
          aria-label={field.label}
        />
      </Group>
    );
  }

  if (field.type === 'select' || field.type === 'tone') {
    const data = field.type === 'tone' ? TONE_OPTIONS : (options[field.options!] ?? []);
    return (
      <AppSelect
        label={field.label}
        description={field.description}
        placeholder={field.placeholder ?? 'اختر...'}
        data={data}
        value={value === null || value === undefined ? null : String(value)}
        onChange={(val: string | null) => setField(field.name, val)}
        error={error || undefined}
        required={field.required}
        clearable={field.type === 'select' && !field.required}
        searchable={field.type === 'select'}
      />
    );
  }

  return (
    <AppInput
      type={field.type}
      label={field.label}
      description={field.description}
      placeholder={field.placeholder}
      value={value === null || value === undefined ? '' : (value as string | number)}
      onChange={(val: string | number) => setField(field.name, val === '' ? null : val)}
      error={error || undefined}
      required={field.required}
      min={field.type === 'number' ? 0 : undefined}
    />
  );
}
