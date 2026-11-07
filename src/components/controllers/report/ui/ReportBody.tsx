'use client';

import { Stack, rem } from '@mantine/core';
import type { ReportBlock } from '@/src/core/api';
import { useReportMirrorSelector } from '../store/useReportMirror';
import { ReportStatsBlock } from './blocks/ReportStatsBlock';
import { ReportFieldsBlock } from './blocks/ReportFieldsBlock';
import { ReportTableBlock } from './blocks/ReportTableBlock';
import { ReportGridBlock } from './blocks/ReportGridBlock';
import { ReportBarsBlock } from './blocks/ReportBarsBlock';
import { ReportNoteBlock } from './blocks/ReportNoteBlock';
import { ReportSignaturesBlock } from './blocks/ReportSignaturesBlock';

function Block({ block }: { block: ReportBlock }) {
  switch (block.type) {
    case 'stats':
      return <ReportStatsBlock title={block.title} items={block.items} />;
    case 'fields':
      return <ReportFieldsBlock title={block.title} columns={block.columns} items={block.items} />;
    case 'table':
      return <ReportTableBlock {...block} />;
    case 'grid':
      return <ReportGridBlock {...block} />;
    case 'bars':
      return <ReportBarsBlock title={block.title} items={block.items} />;
    case 'note':
      return <ReportNoteBlock tone={block.tone} text={block.text} />;
    case 'signatures':
      return <ReportSignaturesBlock items={block.items} />;
  }
}

/** Every block of the document, in order. */
export function ReportBody() {
  const blocks = useReportMirrorSelector((s) => s.document.blocks);
  return (
    <Stack gap={rem(18)}>
      {blocks.map((block, i) => (
        <Block key={`${block.type}-${i}`} block={block} />
      ))}
    </Stack>
  );
}
