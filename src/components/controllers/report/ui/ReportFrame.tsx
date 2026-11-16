'use client';

import type { ReactNode } from 'react';
import { ReportRunningHeader } from './ReportRunningHeader';

/**
 * Inner pages of a printed report: a table whose head (the running header)
 * the browser repeats on every page; the body flows across pages.
 */
export function ReportFrame({ children }: { children: ReactNode }) {
  return (
    <table className="report-frame">
      <thead>
        <tr>
          <td className="report-frame-head">
            <ReportRunningHeader />
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="report-frame-body">{children}</td>
        </tr>
      </tbody>
    </table>
  );
}
