'use client';

import { Box, Center, Group, Image, Loader, Stack, Text, ThemeIcon, rem } from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { AppSurface } from '@/src/components/controllers';
import type { VerificationResult } from '@/src/core/api';
import { formatDate } from '@/src/core/format';

const KIND_LABELS: Record<string, string> = {
  'student-statement': 'كشف حساب طالب',
  'student-transcript': 'كشف علامات طالب',
  'exam-results': 'كشف علامات مذاكرة',
  receipt: 'إيصال دفع',
};

/** Verification result card. Props only. */
export function VerifyView({ result, isLoading }: { result: VerificationResult | null; isLoading: boolean }) {
  if (isLoading || !result) {
    return (
      <Center h="100vh">
        <Loader size="sm" color="primary" />
      </Center>
    );
  }
  const brand = result.institute?.primaryColor || 'var(--app-brand-primary)';

  return (
    <Center mih="100vh" p="md" style={{ background: 'var(--app-bg)' }}>
      <AppSurface level={2} radius="lg" padding="xl" style={{ width: '100%', maxWidth: rem(440), borderTop: `${rem(5)} solid ${brand}` }}>
        {result.valid ? (
          <Stack gap="md" align="center" ta="center">
            {result.institute?.logoUrl && <Image src={result.institute.logoUrl} alt="" h={rem(56)} w="auto" fit="contain" />}
            <Text fw={600} size="lg" style={{ color: brand }}>
              {result.institute?.name}
            </Text>
            <Group gap="xs" justify="center">
              <ThemeIcon color="green" variant="light" radius="xl" size="lg">
                <IconCircleCheck size={20} />
              </ThemeIcon>
              <Text fw={600}>مستند صادر عن المعهد</Text>
            </Group>
            <Box w="100%" p="md" style={{ background: 'var(--app-sidebar-subtle)', borderRadius: 'var(--app-radius-md)' }}>
              <Stack gap={6}>
                <Row label="نوع المستند" value={KIND_LABELS[result.kind ?? ''] ?? result.kind ?? '—'} />
                <Row label="رقم المستند" value={result.number ?? '—'} ltr />
                <Row label="بخصوص" value={result.subject ?? '—'} />
                <Row label="تاريخ الإصدار" value={formatDate(result.issuedAt)} ltr />
              </Stack>
            </Box>
            {(result.lines ?? []).map((line) => (
              <Text key={line} size="sm" fw={500}>
                {line}
              </Text>
            ))}
            <Text size="xs" c="var(--app-text-muted)">
              تطابق هذه البيانات مع الورقة المطبوعة يعني أنها لم تُعدَّل. المبالغ والأرقام كما كانت لحظة الإصدار.
            </Text>
          </Stack>
        ) : (
          <Stack gap="sm" align="center" ta="center">
            <ThemeIcon color="red" variant="light" radius="xl" size={rem(52)}>
              <IconCircleX size={30} />
            </ThemeIcon>
            <Text fw={600} size="lg">
              تعذّر التحقق من المستند
            </Text>
            <Text size="sm" c="var(--app-text-muted)">
              الرمز غير صالح أو تم تعديله. لا تعتمد هذه الورقة قبل مراجعة المعهد.
            </Text>
          </Stack>
        )}
      </AppSurface>
    </Center>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <Group justify="space-between" wrap="nowrap" gap="sm">
      <Text size="sm" c="var(--app-text-muted)">
        {label}
      </Text>
      <Text size="sm" fw={600} dir={ltr ? 'ltr' : undefined}>
        {value}
      </Text>
    </Group>
  );
}
