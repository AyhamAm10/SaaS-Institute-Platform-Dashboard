'use client';

import { useEffect, useState } from 'react';
import { type AppReportProps, resolveReportConfig } from './init/report.init';
import { useQrDataUri } from './useQrDataUri';
import { createReportStore, ReportContext } from './store/report.store';
import { ReportPaper } from './ui/ReportPaper';
import { ReportHeader } from './ui/ReportHeader';
import { ReportMeta } from './ui/ReportMeta';
import { ReportBody } from './ui/ReportBody';
import { ReportFooter } from './ui/ReportFooter';

/**
 * AppReport
 *
 * Renders one server report document (D3) as a sheet of paper, on screen
 * or for print, branded with the institute. Isolated store per instance.
 *
 * Simple usage: <AppReport document={doc} institute={institute} />
 *
 * Compound:
 *   <AppReport document={doc} institute={institute} variant="print">
 *     <AppReport.Paper>
 *       <AppReport.Header /> <AppReport.Meta /> <AppReport.Body /> <AppReport.Footer />
 *     </AppReport.Paper>
 *   </AppReport>
 */
export function AppReport(props: AppReportProps) {
  const [store] = useState(() => createReportStore(props));
  const verifyUrl = resolveReportConfig(props).verifyUrl;

  // Keep the store in step with a new document (another report / params)
  useEffect(() => {
    const config = resolveReportConfig(props);
    store.getState().sync({ document: props.document, institute: props.institute, ...config });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.document, props.institute, props.variant, props.verifyOrigin, store]);

  // Verification QR (async SVG generation) → store
  const qr = useQrDataUri(verifyUrl);
  useEffect(() => {
    store.getState().setQrDataUri(qr);
  }, [qr, store]);

  return (
    <ReportContext.Provider value={store}>
      {props.children ?? (
        <ReportPaper>
          <ReportHeader />
          <ReportMeta />
          <ReportBody />
          <ReportFooter />
        </ReportPaper>
      )}
    </ReportContext.Provider>
  );
}

AppReport.Paper = ReportPaper;
AppReport.Header = ReportHeader;
AppReport.Meta = ReportMeta;
AppReport.Body = ReportBody;
AppReport.Footer = ReportFooter;
