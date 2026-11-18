import { formatDate } from '@/src/core/format';

/** Page of a record when the dashboard has one (null: no page for this type). */
const ENTITY_ROUTES: Record<string, (id: number) => string> = {
  student: (id) => `/students/${id}`,
  family: (id) => `/families/${id}`,
  teacher: (id) => `/teachers/${id}`,
  section: (id) => `/sections/${id}`,
  subject: (id) => `/subjects/${id}`,
  payment: (id) => `/payments/${id}`,
  studentSubscription: (id) => `/contracts/${id}`,
};

export function entityHref(entity: string, id: number): string | null {
  return ENTITY_ROUTES[entity]?.(id) ?? null;
}

/** `YYYY-MM-DD HH:mm` of an instant in the institute time zone. */
export function formatWhen(value: string, timeZone?: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const time = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
  const date = new Intl.DateTimeFormat('en-CA', { timeZone }).format(d);
  return `${formatDate(date)} ${time}`;
}
