import { redirect } from 'next/navigation';

/** StaffPage — redirects to the accounts tab of the unified /settings page (role.md §9). */
export default function StaffPage() {
  redirect('/settings?tab=accounts');
}
