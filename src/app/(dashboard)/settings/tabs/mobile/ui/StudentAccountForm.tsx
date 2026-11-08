'use client';

import { Stack } from '@mantine/core';
import { IconDice } from '@tabler/icons-react';
import { AppButton, AppInput, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { useMobileAccountsMirror } from '../store/useMobileAccountsMirror';

interface StudentAccountFormProps {
  eligibleStudentsData: { value: string; label: string; suggestedPhone?: string | null }[];
  onGeneratePassword: () => void;
}

export function StudentAccountForm({ eligibleStudentsData, onGeneratePassword }: StudentAccountFormProps) {
  const studentForm = useMobileAccountsMirror('studentForm');
  const setStudentFormField = useMobileAccountsMirror('setStudentFormField');

  const handleStudentSelect = (val: string | null) => {
    const id = val ? Number(val) : null;
    const found = eligibleStudentsData.find((s) => s.value === val);
    setStudentFormField('studentId', id);
    setStudentFormField('studentName', found ? found.label : '');
    if (found?.suggestedPhone) {
      setStudentFormField('phone', found.suggestedPhone);
    }
  };

  return (
    <Stack gap="md">
      <AppSelect
        label="الطالب"
        placeholder="اختر الطالب لإنشاء حسابه"
        data={eligibleStudentsData}
        value={studentForm.studentId ? String(studentForm.studentId) : null}
        onChange={handleStudentSelect}
        searchable
        required
      />
      <AppInput
        type="tel"
        label="رقم الهاتف (اسم المستخدم)"
        placeholder="مثال: 0912345678"
        value={studentForm.phone}
        onChange={(e: unknown) => setStudentFormField('phone', inputText(e))}
        required
      />
      <Stack gap="xs">
        <AppInput
          type="text"
          label="كلمة المرور"
          placeholder="8 محارف على الأقل أو انقر على توليد"
          value={studentForm.password}
          onChange={(e: unknown) => setStudentFormField('password', inputText(e))}
          required
        />
        <AppButton variant="ghost" size="xs" leftSection={<IconDice size={14} />} onClick={onGeneratePassword}>
          توليد كلمة مرور عشوائية
        </AppButton>
      </Stack>
    </Stack>
  );
}
