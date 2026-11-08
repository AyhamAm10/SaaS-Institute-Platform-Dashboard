import { redirect } from 'next/navigation';

/** StudentFieldsPage — redirects to unified /settings tab (role.md §9). */
export default function StudentFieldsPage() {
  redirect('/settings?tab=student-fields');
}

