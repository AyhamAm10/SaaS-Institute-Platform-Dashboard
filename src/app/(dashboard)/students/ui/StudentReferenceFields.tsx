'use client';

import { SimpleGrid } from '@mantine/core';
import { AppSelect } from '@/src/components/controllers';
import {
  schoolsOfCity,
  StudentReferenceField,
  StudentReferenceOptions,
  StudentReferenceValues,
} from '../utils/student-references.utils';

export interface StudentReferenceFieldsProps {
  values: StudentReferenceValues;
  options: StudentReferenceOptions;
  onChange: (field: StudentReferenceField, value: number | null) => void;
}

const toValue = (id: number | null) => (id ? String(id) : null);
const toId = (val: string | null) => (val ? Number(val) : null);

/**
 * StudentReferenceFields
 *
 * Status, referral source, city, school and bus selects. Shared by the
 * registration wizard and the edit drawer; fully controlled (no state).
 * Choosing another city clears a school that belongs to a different city.
 */
export function StudentReferenceFields({ values, options, onChange }: StudentReferenceFieldsProps) {
  const schools = schoolsOfCity(options.schools, values.cityId);

  const handleCity = (val: string | null) => {
    const cityId = toId(val);
    onChange('cityId', cityId);
    const school = options.schools.find((s) => s.value === toValue(values.schoolId));
    if (cityId && school?.cityId && school.cityId !== cityId) onChange('schoolId', null);
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      <AppSelect
        label="حالة الطالب"
        placeholder="الحالة الافتراضية"
        data={options.statuses}
        value={toValue(values.statusId)}
        onChange={(val: string | null) => onChange('statusId', toId(val))}
      />
      <AppSelect
        label="كيف تعرّف على المعهد"
        placeholder="اختر..."
        data={options.knowWays}
        value={toValue(values.knowWayId)}
        onChange={(val: string | null) => onChange('knowWayId', toId(val))}
        clearable
      />
      <AppSelect
        label="المدينة"
        placeholder="اختر المدينة..."
        data={options.cities}
        value={toValue(values.cityId)}
        onChange={handleCity}
        searchable
        clearable
      />
      <AppSelect
        label="المدرسة"
        placeholder="اختر المدرسة..."
        data={schools}
        value={toValue(values.schoolId)}
        onChange={(val: string | null) => onChange('schoolId', toId(val))}
        searchable
        clearable
      />
      <AppSelect
        label="الباص"
        placeholder="بدون نقل"
        description="باصات الفرع النشط فقط"
        data={options.buses}
        value={toValue(values.busId)}
        onChange={(val: string | null) => onChange('busId', toId(val))}
        clearable
      />
    </SimpleGrid>
  );
}
