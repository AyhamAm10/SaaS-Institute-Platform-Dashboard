import { Box, Image, rem } from '@mantine/core';
import { REPORT_PAPER, type ReportInstitute, withAlpha } from '../init/report.init';

/** Institute logo, or its first letter on a soft brand tile when there is none. Props only. */
export function PrintLogo({
  institute,
  brand,
  size,
}: {
  institute: ReportInstitute | null;
  brand: string;
  size: number;
}) {
  if (institute?.logoUrl) {
    return <Image src={institute.logoUrl} alt="" h={rem(size)} w={rem(size)} fit="contain" style={{ flexShrink: 0 }} />;
  }
  return (
    <Box
      style={{
        width: rem(size),
        height: rem(size),
        flexShrink: 0,
        borderRadius: rem(size / 4),
        background: withAlpha(brand, 0.14),
        color: brand,
        display: 'grid',
        placeItems: 'center',
        fontWeight: 700,
        fontSize: rem(size * 0.45),
        border: `1px solid ${REPORT_PAPER.border}`,
      }}
    >
      {institute?.name?.trim().charAt(0) ?? '٭'}
    </Box>
  );
}
