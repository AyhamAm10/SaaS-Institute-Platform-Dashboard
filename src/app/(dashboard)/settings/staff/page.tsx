import { redirect } from 'next/navigation';

/** StaffPage — redirects to unified /settings tab (role.md §9). */
export default function StaffPage() {
  redirect('/settings?tab=staff');
}

