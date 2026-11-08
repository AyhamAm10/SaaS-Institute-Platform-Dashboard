import { redirect } from 'next/navigation';

/** ReferenceDataPage — redirects to unified /settings tab (role.md §9). */
export default function ReferenceDataPage() {
  redirect('/settings?tab=reference-data');
}

