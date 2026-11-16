import { Box, Group, Stack, Text, rem } from '@mantine/core';
import { REPORT_PAPER, type ReportInstitute } from '../init/report.init';
import { PrintLogo } from './PrintLogo';

/**
 * The running header of every printed page (reports, receipts, ...): small
 * logo + institute name on the right, the document title on the left, over a
 * brand rule. Props only, so non-report documents share it.
 */
export function PrintLetterhead({
  institute,
  brand,
  title,
  caption,
}: {
  institute: ReportInstitute | null;
  brand: string;
  title: string;
  caption?: string;
}) {
  return (
    <Box style={{ paddingBottom: rem(8), marginBottom: rem(10), borderBottom: `2px solid ${brand}` }}>
      <Group justify="space-between" align="center" wrap="nowrap" gap="md">
        <Group gap={rem(10)} wrap="nowrap">
          <PrintLogo institute={institute} brand={brand} size={34} />
          <Stack gap={0}>
            <Text fw={700} fz={rem(13)} lh={1.3} style={{ color: REPORT_PAPER.ink }}>
              {institute?.name ?? ''}
            </Text>
            {caption && (
              <Text fz={rem(9.5)} style={{ color: REPORT_PAPER.muted }}>
                {caption}
              </Text>
            )}
          </Stack>
        </Group>
        <Text fw={600} fz={rem(13)} ta="left" style={{ color: brand }}>
          {title}
        </Text>
      </Group>
    </Box>
  );
}
