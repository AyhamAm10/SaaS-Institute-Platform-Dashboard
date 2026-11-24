'use client';

import { AppSelect } from '@/src/components/controllers';
import { usePortalMirror } from '../store/portal.store';
import { portalLabels as labels } from '../static-data/portal.data';

/** Choose which child to follow; shown only for a guardian with more than one. ZERO useState hooks. */
export function ChildSwitcher() {
  const me = usePortalMirror('me');
  const childId = usePortalMirror('childId');
  const selectChild = usePortalMirror('selectChild');
  const children = me?.children ?? [];
  if (children.length < 2) return null;

  return (
    <AppSelect
      placeholder={labels.childPlaceholder}
      data={children.map((c) => ({ value: String(c.id), label: c.fullName }))}
      value={childId ? String(childId) : null}
      onChange={(v: string | null) => v && selectChild(Number(v))}
      size="sm"
      w={220}
    />
  );
}
