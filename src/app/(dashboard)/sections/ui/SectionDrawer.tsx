'use client';

import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconEdit, IconSchool } from '@tabler/icons-react';
import { useMemo } from 'react';
import { AppDrawer, AppInput, AppSelect } from '@/src/components/controllers';
import { useOperationalContext } from '@/src/core/api';
import { sectionFormLabels } from '../static-data/sections.data';
import { useSectionsMirror } from '../store/useSectionsMirror';

export interface SectionDrawerProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

/**
 * SectionDrawer
 *
 * Pure presentation drawer for creating/editing a section.
 * Strictly adheres to role.md Section 12 (ZERO useState, reads via useSectionsMirror).
 */
export function SectionDrawer({
  opened,
  onClose,
  onSubmit,
}: SectionDrawerProps) {
  const { activeAcademicYearId } = useOperationalContext();
  const selectedSection = useSectionsMirror('selectedSection');
  const sectionForm = useSectionsMirror('sectionForm');
  const setSectionFormField = useSectionsMirror('setSectionFormField');
  const sectionFormError = useSectionsMirror('sectionFormError');
  const formSubmitting = useSectionsMirror('formSubmitting');
  const academicYears = useSectionsMirror('academicYears');
  const academicBranches = useSectionsMirror('academicBranches');

  const isEditing = Boolean(selectedSection);

  // Derive academic year select options
  const yearOptions = useMemo(
    () =>
      academicYears.map((y) => ({
        value: String(y.id),
        label: `${y.name} ${y.isCurrent ? '(الحالية)' : ''}`,
      })),
    [academicYears],
  );

  // Derive academic branch select options
  const branchOptions = useMemo(
    () =>
      academicBranches.map((b) => ({
        value: String(b.id),
        label: b.name,
      })),
    [academicBranches],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer
      opened={opened}
      onClose={onClose}
      size="md"
    >
      <AppDrawer.Header>
        <AppDrawer.Icon
          icon={isEditing ? <IconEdit size={20} /> : <IconSchool size={20} />}
          color={isEditing ? 'blue' : 'primary'}
        />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {isEditing
              ? sectionFormLabels.editTitle
              : sectionFormLabels.createTitle}
          </AppDrawer.Title>
          <AppDrawer.Description>
            {isEditing
              ? 'تحديث بيانات ومرحلة الشعبة الدراسية'
              : 'إضافة شعبة دراسية جديدة وتعيين الرسوم والمرحلة التعليمية'}
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="section-form" onSubmit={handleSubmit}>
          <Stack gap="md">
            {sectionFormError && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
                radius="md"
              >
                {sectionFormError}
              </Alert>
            )}

            {/* Basic Information Section */}
            <AppDrawer.Section
              title="البيانات الأساسية"
              description="حدد اسم الشعبة والمرحلة التعليمية والسنة الدراسية"
            >
              <AppInput
                type="text"
                label={sectionFormLabels.name}
                placeholder={sectionFormLabels.namePlaceholder}
                value={sectionForm.name}
                onChange={(e) =>
                  setSectionFormField(
                    'name',
                    typeof e === 'string'
                      ? e
                      : e && typeof e === 'object' && 'target' in e
                        ? (e.target as HTMLInputElement).value
                        : '',
                  )
                }
                required
              />

              <AppSelect
                label={sectionFormLabels.academicBranchId}
                placeholder="اختر الفرع الأكاديمي (مثال: الثانوي العام — الفرع العلمي)"
                data={branchOptions}
                value={sectionForm.academicBranchId}
                onChange={(val: string | null) =>
                  setSectionFormField('academicBranchId', val)
                }
                searchable
                required
              />

              {!isEditing && (
                <AppSelect
                  label={sectionFormLabels.academicYearId}
                  data={yearOptions}
                  value={
                    sectionForm.academicYearId ||
                    (activeAcademicYearId ? String(activeAcademicYearId) : '')
                  }
                  onChange={(val: string | null) =>
                    setSectionFormField('academicYearId', val)
                  }
                  required
                  placeholder="اختر السنة الدراسية"
                />
              )}
            </AppDrawer.Section>

            {/* Financial Information Section */}
            <AppDrawer.Section
              title="البيانات المالية"
              description="الرسوم الدراسية المقررة لطلاب هذه الشعبة"
            >
              <AppInput
                type="number"
                label={sectionFormLabels.feeAmount}
                placeholder={sectionFormLabels.feePlaceholder}
                value={sectionForm.feeAmount}
                min={0}
                onChange={(e) =>
                  setSectionFormField(
                    'feeAmount',
                    typeof e === 'string'
                      ? e
                      : typeof e === 'number'
                        ? String(e)
                        : e && typeof e === 'object' && 'target' in e
                          ? (e.target as HTMLInputElement).value
                          : '0',
                  )
                }
                required
              />
            </AppDrawer.Section>
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel disabled={formSubmitting} />
          <AppDrawer.Submit
            form="section-form"
            loading={formSubmitting}
          >
            {isEditing ? sectionFormLabels.submitEdit : sectionFormLabels.submitCreate}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}

// Backward compatibility alias
export const SectionModal = SectionDrawer;
export type SectionModalProps = SectionDrawerProps;
