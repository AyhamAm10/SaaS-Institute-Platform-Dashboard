'use client';

import { Stack } from '@mantine/core';
import { IconDice } from '@tabler/icons-react';
import { AppButton, AppInput, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { GUARDIAN_RELATIONSHIP_OPTIONS } from '../static-data/mobile-accounts.data';
import { useMobileAccountsMirror } from '../store/useMobileAccountsMirror';
import { GuardianRelationship } from '@/src/core/api';

interface GuardianAccountFormProps {
  familiesData: { value: string; label: string }[];
  onGeneratePassword: () => void;
}

export function GuardianAccountForm({ familiesData, onGeneratePassword }: GuardianAccountFormProps) {
  const guardianForm = useMobileAccountsMirror('guardianForm');
  const setGuardianFormField = useMobileAccountsMirror('setGuardianFormField');

  return (
    <Stack gap="md">
      <AppSelect
        label="العائلة"
        placeholder="اختر العائلة التابع لها"
        data={familiesData}
        value={guardianForm.familyId ? String(guardianForm.familyId) : null}
        onChange={(val: string | null) => {
          const id = val ? Number(val) : null;
          const found = familiesData.find((f) => f.value === val);
          setGuardianFormField('familyId', id);
          setGuardianFormField('familyName', found ? found.label : '');
        }}
        searchable
        required
      />
      <AppSelect
        label="صلة القرابة"
        data={GUARDIAN_RELATIONSHIP_OPTIONS}
        value={guardianForm.relationship}
        onChange={(val: string | null) => setGuardianFormField('relationship', (val as GuardianRelationship) || 'FATHER')}
        required
      />
      <AppInput
        label="الاسم الكامل لولي الأمر"
        placeholder="مثال: أحمد عبد الله"
        value={guardianForm.fullName}
        onChange={(e: unknown) => setGuardianFormField('fullName', inputText(e))}
        required
      />
      <AppInput
        type="tel"
        label="رقم الهاتف (اسم المستخدم)"
        placeholder="مثال: 0912345678"
        value={guardianForm.phone}
        onChange={(e: unknown) => setGuardianFormField('phone', inputText(e))}
        required
      />
      <Stack gap="xs">
        <AppInput
          type="text"
          label="كلمة المرور"
          placeholder="8 محارف على الأقل أو انقر على توليد"
          value={guardianForm.password}
          onChange={(e: unknown) => setGuardianFormField('password', inputText(e))}
          required
        />
        <AppButton variant="ghost" size="xs" leftSection={<IconDice size={14} />} onClick={onGeneratePassword}>
          توليد كلمة مرور عشوائية
        </AppButton>
      </Stack>
    </Stack>
  );
}
