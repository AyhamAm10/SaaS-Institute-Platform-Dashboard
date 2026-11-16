'use client';

import { Alert, Checkbox, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCalendarOff } from '@tabler/icons-react';
import { AppButton, AppDatePicker, AppDrawer, AppInput, AppSelect } from '@/src/components/controllers';
import type { ClosureScope } from '@/src/core/api';
import { inputText } from '@/src/core/format';
import { useClosuresMirror } from '../store/closures.store';
import { closureLabels as labels, SCOPE_OPTIONS } from '../static-data/closures.data';

/** Create / edit a closure: scope, branch or sections, period and reason. ZERO useState hooks. */
export function ClosureDrawer({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const opened = useClosuresMirror('drawerOpened');
  const editing = useClosuresMirror('editing');
  const form = useClosuresMirror('form');
  const errors = useClosuresMirror('formErrors');
  const generalError = useClosuresMirror('generalError');
  const isSubmitting = useClosuresMirror('isSubmitting');
  const branches = useClosuresMirror('branches');
  const sections = useClosuresMirror('sections');
  const setField = useClosuresMirror('setField');
  const toggleSection = useClosuresMirror('toggleSection');
  const closeDrawer = useClosuresMirror('closeDrawer');

  return (
    <AppDrawer opened={opened} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconCalendarOff size={20} />} color="primary" />
        <Stack gap={2} style={{ flex: 1 }}>
          <AppDrawer.Title>{editing ? labels.editTitle : labels.createTitle}</AppDrawer.Title>
          <AppDrawer.Description>{labels.drawerDescription}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <Stack gap="md">
          {generalError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {generalError}
            </Alert>
          )}
          <AppInput
            label={labels.reason}
            placeholder={labels.reasonPlaceholder}
            value={form.reason}
            onChange={(e: unknown) => setField('reason', inputText(e))}
            error={errors.reason}
            required
          />
          <AppSelect
            label={labels.scope}
            data={SCOPE_OPTIONS}
            value={form.scope}
            onChange={(v: string | null) => v && setField('scope', v as ClosureScope)}
            required
          />
          {form.scope === 'BRANCH' && (
            <AppSelect
              label={labels.branch}
              placeholder={labels.branchPlaceholder}
              data={branches}
              value={form.branchId}
              onChange={(v: string | null) => setField('branchId', v)}
              error={errors.branchId}
              required
            />
          )}
          {form.scope === 'SECTION' && (
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                {labels.sections}
              </Text>
              <Text size="xs" c="var(--app-text-muted)">
                {labels.sectionsHint}
              </Text>
              {sections.length === 0 && (
                <Text size="sm" c="var(--app-text-muted)">
                  {labels.noSections}
                </Text>
              )}
              {sections.map((s) => (
                <Checkbox
                  key={s.value}
                  label={s.label}
                  checked={form.sectionIds.includes(Number(s.value))}
                  onChange={() => toggleSection(Number(s.value))}
                />
              ))}
              {errors.sectionIds && (
                <Text size="xs" c="red">
                  {errors.sectionIds}
                </Text>
              )}
            </Stack>
          )}
          <AppDatePicker
            label={labels.fromDate}
            placeholder={labels.datePlaceholder}
            value={form.fromDate || null}
            onChange={(v) => setField('fromDate', v ?? '')}
            error={errors.fromDate}
            required
          />
          <AppDatePicker
            label={labels.toDate}
            placeholder={labels.datePlaceholder}
            value={form.toDate || null}
            onChange={(v) => setField('toDate', v ?? '')}
            error={errors.toDate}
            required
          />
        </Stack>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{labels.cancel}</AppDrawer.Cancel>
          <AppButton onClick={onSubmit} loading={isSubmitting}>
            {labels.save}
          </AppButton>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
