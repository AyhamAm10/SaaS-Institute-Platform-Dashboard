import { redirect } from 'next/navigation';

export default function ScheduleSettingsPage() {
  redirect('/settings?tab=schedule');
}

