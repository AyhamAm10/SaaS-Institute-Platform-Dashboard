import { Text } from '@mantine/core';
import { AppSurface, DetailList } from '@/src/components/controllers';
import type { Student } from '@/src/core/api';

const v = (value?: string | null) => (value && value.trim() ? value : '—');

/** The official identity and the parents' details (as the official lists use them). Props only. */
export function StudentOfficialCard({ student }: { student: Student }) {
  const family = student.family;
  return (
    <AppSurface level={2} radius="lg" padding="md">
      <Text fw={600} size="sm" mb="xs">
        البيانات الرسمية
      </Text>
      <DetailList
        columns={3}
        items={[
          { label: 'الجنسية', value: v(student.nationality?.name) },
          { label: 'الديانة', value: v(student.religion?.name) },
          { label: 'اللغة الأجنبية', value: v(student.language?.name) },
          { label: 'الرقم الوطني', value: v(student.nationalId) },
          { label: 'مكان الولادة', value: v(student.birthPlace) },
          { label: 'محل ورقم القيد', value: v(student.civilRegistry) },
          { label: 'اسم الجد', value: v(student.grandfatherName) },
          { label: 'الاسم بالأحرف الأجنبية', value: v(student.foreignName) },
          { label: 'العنوان الدائم', value: v(student.address) },
          { label: 'الأب', value: [family?.fatherName, family?.fatherJob].filter(Boolean).join(' - ') || '—' },
          { label: 'الأم', value: [family?.motherName, family?.motherJob].filter(Boolean).join(' - ') || '—' },
          { label: 'جوال الأب / الأم', value: [family?.fatherPhone, family?.motherPhone].filter(Boolean).join(' / ') || '—' },
        ]}
      />
    </AppSurface>
  );
}
