export interface TimezoneOption {
  value: string;
  label: string;
}

export const COMMON_TIMEZONES: TimezoneOption[] = [
  { value: 'Asia/Damascus', label: 'دمشق (Asia/Damascus) — توقيت دمشق' },
  { value: 'Asia/Riyadh', label: 'الرياض (Asia/Riyadh) — توقيت مكة المكرمة' },
  { value: 'Asia/Dubai', label: 'دبي (Asia/Dubai) — توقيت الإمارات' },
  { value: 'Africa/Cairo', label: 'القاهرة (Africa/Cairo) — توقيت مصر' },
  { value: 'Asia/Beirut', label: 'بيروت (Asia/Beirut) — توقيت لبنان' },
  { value: 'Asia/Amman', label: 'عمّان (Asia/Amman) — توقيت الأردن' },
  { value: 'Asia/Baghdad', label: 'بغداد (Asia/Baghdad) — توقيت العراق' },
  { value: 'Asia/Kuwait', label: 'الكويت (Asia/Kuwait) — توقيت الكويت' },
  { value: 'Asia/Qatar', label: 'الدوحة (Asia/Qatar) — توقيت قطر' },
  { value: 'Asia/Bahrain', label: 'المنامة (Asia/Bahrain) — توقيت البحرين' },
  { value: 'Asia/Muscat', label: 'مسقط (Asia/Muscat) — توقيت عُمان' },
  { value: 'Europe/Istanbul', label: 'إسطنبول (Europe/Istanbul) — توقيت تركيا' },
  { value: 'UTC', label: 'التوقيت العالمي المنسق (UTC)' },
];

