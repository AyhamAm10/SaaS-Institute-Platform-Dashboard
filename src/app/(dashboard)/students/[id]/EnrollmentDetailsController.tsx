'use client';

import { useCallback, useState } from 'react';
import { IconId } from '@tabler/icons-react';
import { AppButton } from '@/src/components/controllers';
import {
  enrollmentSituationsResource,
  getApiErrorMessage,
  languagesResource,
  type StudentEnrollmentItem,
  useUpdateEnrollmentDetailsMutation,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import {
  detailsFormFrom,
  detailsPayloadFrom,
  type EnrollmentDetailsForm,
  enrollmentDetailsLabels as labels,
} from './static-data/enrollment-details.data';
import { EnrollmentDetailsModal } from './ui/EnrollmentDetailsModal';

const ALL = { limit: 100 };
const options = (list?: { id: number; name: string }[]) => (list ?? []).map((x) => ({ value: String(x.id), label: x.name }));

/**
 * EnrollmentDetailsController
 *
 * "بيانات السنة" of one enrollment on the student page: the student's situation this
 * year, where he comes from and his official exam candidacy. The lists load only while
 * the form is open. Staff with students.manage only.
 */
export function EnrollmentDetailsController({ enrollment }: { enrollment: StudentEnrollmentItem }) {
  const { can } = useAuth();
  const mutation = useUpdateEnrollmentDetailsMutation();
  const [values, setValues] = useState<EnrollmentDetailsForm | null>(null);
  const [error, setError] = useState<string | null>(null);
  const situations = enrollmentSituationsResource.useList(ALL, values !== null).data?.data;
  const languages = languagesResource.useList(ALL, values !== null).data?.data;

  const submit = useCallback(async () => {
    if (!values) return;
    setError(null);
    try {
      await mutation.mutateAsync({ id: enrollment.id, payload: detailsPayloadFrom(values) });
      setValues(null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, labels.error));
    }
  }, [values, enrollment.id, mutation]);

  if (!can(PERMISSIONS.studentsManage)) return null;
  return (
    <>
      <AppButton
        size="xs"
        variant="ghost"
        leftSection={<IconId size={14} />}
        onClick={() => {
          setError(null);
          setValues(detailsFormFrom(enrollment));
        }}
      >
        {labels.edit}
      </AppButton>
      <EnrollmentDetailsModal
        title={values ? `${enrollment.section?.name ?? ''} · ${enrollment.academicYear?.name ?? ''}` : null}
        values={values ?? detailsFormFrom(enrollment)}
        situations={options(situations)}
        languages={options(languages)}
        error={error}
        isSubmitting={mutation.isPending}
        onChange={(patch) => setValues((v) => (v ? { ...v, ...patch } : v))}
        onClose={() => setValues(null)}
        onSubmit={submit}
      />
    </>
  );
}
