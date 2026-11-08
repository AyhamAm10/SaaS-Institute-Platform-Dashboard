'use client';

import { SimpleGrid, Stack } from '@mantine/core';
import { AppInput } from '@/src/components/controllers/input';
import { inputText } from '@/src/core/format';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';

/** New family form. */
export function Step1NewFamily() {
  const newFamily = useStudentRegistrationMirror('newFamily');
  const setNewFamilyField = useStudentRegistrationMirror('setNewFamilyField');

  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <AppInput
          label="كنية العائلة"
          placeholder="مثال: العمر، الخالد..."
          value={newFamily.familyName}
          onChange={(e) => setNewFamilyField('familyName', inputText(e))}
          required
        />
        <AppInput
          type="tel"
          label="رقم هاتف التواصل"
          placeholder="09xxxxxxxx"
          value={newFamily.phone}
          onChange={(e) => setNewFamilyField('phone', inputText(e))}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <AppInput
          label="اسم الأب"
          placeholder="الاسم الأول للأب"
          value={newFamily.fatherName}
          onChange={(e) => setNewFamilyField('fatherName', inputText(e))}
        />
        <AppInput
          label="اسم الأم"
          placeholder="الاسم الأول للأم"
          value={newFamily.motherName}
          onChange={(e) => setNewFamilyField('motherName', inputText(e))}
        />
      </SimpleGrid>
    </Stack>
  );
}
