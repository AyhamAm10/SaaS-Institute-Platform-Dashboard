'use client';

import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import type { ReportParamKind } from '@/src/core/api';
import { CURRENCY_OPTIONS, inputText } from '@/src/core/format';
import { PAYMENT_METHOD_OPTIONS } from '../../../students/finance/static-data/student-finance.data';
import { useWorkspaceMirror } from '../store/report-workspace.store';
import { PARAM_LABELS, reportsLabels as labels } from '../../static-data/reports.data';
import type { OptionKey } from '../state/report-workspace.state';

const SELECT_OPTIONS: Partial<Record<ReportParamKind, OptionKey>> = {
  section: 'sections',
  exam: 'exams',
  teacher: 'teachers',
};

/** One parameter input, chosen by its kind. ZERO useState hooks. */
export function ReportParamField({ kind, required }: { kind: ReportParamKind; required: boolean }) {
  const value = useWorkspaceMirror('form')[kind] ?? null;
  const missing = useWorkspaceMirror('missing').includes(kind);
  const options = useWorkspaceMirror('options');
  const selectedStudent = useWorkspaceMirror('selectedStudent');
  const setField = useWorkspaceMirror('setField');
  const setStudentSearch = useWorkspaceMirror('setStudentSearch');
  const setSelectedStudent = useWorkspaceMirror('setSelectedStudent');
  const common = {
    label: PARAM_LABELS[kind],
    required,
    error: missing ? `${PARAM_LABELS[kind]} مطلوب` : '',
  };

  if (kind === 'student') {
    const list = options.students;
    const data = selectedStudent && !list.some((o) => o.value === selectedStudent.value) ? [selectedStudent, ...list] : list;
    return (
      <AppSelect
        {...common}
        placeholder={labels.studentSearch}
        data={data}
        value={value}
        searchable
        clearable
        onSearchChange={(q: string) => setStudentSearch(q)}
        onChange={(v: string | null) => {
          setField('student', v);
          setSelectedStudent(data.find((o) => o.value === v) ?? null);
        }}
      />
    );
  }
  const optionKey = SELECT_OPTIONS[kind];
  if (optionKey) {
    return (
      <AppSelect {...common} data={options[optionKey]} value={value} searchable clearable onChange={(v: string | null) => setField(kind, v)} />
    );
  }
  if (kind === 'date' || kind === 'from' || kind === 'to') {
    return <AppDatePicker {...common} value={value} clearable onChange={(v) => setField(kind, v ?? null)} />;
  }
  if (kind === 'currency' || kind === 'paymentMethod') {
    return (
      <AppSelect
        {...common}
        data={kind === 'currency' ? CURRENCY_OPTIONS : PAYMENT_METHOD_OPTIONS}
        value={value}
        clearable
        onChange={(v: string | null) => setField(kind, v)}
      />
    );
  }
  return (
    <AppInput
      {...common}
      type="number"
      min={1}
      value={value ?? ''}
      placeholder={kind === 'minCount' ? '3' : '10'}
      onChange={(e: unknown) => setField(kind, inputText(e))}
    />
  );
}
