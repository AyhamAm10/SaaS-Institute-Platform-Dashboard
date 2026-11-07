'use client';

import { Box, Group, Image, Stack, Table, Text } from '@mantine/core';
import { AppButton } from '@/src/components/controllers';
import { IconPrinter } from '@tabler/icons-react';
import { type InstituteInfo, type PaymentRecord, toAmount } from '@/src/core/api';
import { formatDate, formatMoney } from '@/src/core/format';
import { PAYMENT_METHOD_LABELS } from '@/src/app/(dashboard)/students/finance/static-data/student-finance.data';

const PRINT_CSS = `
@page { size: A5; margin: 10mm; }
@media print { .no-print { display: none !important; } body { background: white !important; } }
`;

/** Printable A5 receipt. Props only. */
interface ReceiptViewProps {
  payment: PaymentRecord;
  institute: InstituteInfo | null;
  /** Document number + QR to the public verification page (D3). */
  verification: { number: string; qr: string } | null;
}

export function ReceiptView({ payment, institute, verification }: ReceiptViewProps) {
  // Institute brand color (data); falls back to the platform token
  const brand = institute?.primaryColor || 'var(--app-brand-primary)';
  const contractCurrency = payment.subscription.currency;
  const cancelled = payment.status === 'CANCELLED';
  const rows: [string, string][] = [
    ['الطالب', payment.subscription.student.fullName],
    ['العائلة', payment.subscription.student.family?.familyName ?? '—'],
    ['الشعبة', `${payment.subscription.section.name} · ${payment.academicYear.name}`],
    ['الفرع', payment.branch.name],
    ['طريقة الدفع', PAYMENT_METHOD_LABELS[payment.paymentMethod]],
  ];

  return (
    <Box maw={560} mx="auto" p="lg" style={{ background: 'white', color: 'black' }}>
      <style>{PRINT_CSS}</style>
      <Group className="no-print" justify="flex-end" mb="md">
        <AppButton leftSection={<IconPrinter size={16} />} onClick={() => window.print()}>
          طباعة
        </AppButton>
      </Group>

      <Stack gap="md" style={{ border: `2px solid ${brand}`, borderRadius: 12, padding: 20, position: 'relative' }}>
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Text fw={600} size="lg" style={{ color: brand }}>
              {institute?.name ?? ''}
            </Text>
            {institute?.address && <Text size="xs">{institute.address}</Text>}
            {institute?.phone && <Text size="xs" dir="ltr">{institute.phone}</Text>}
          </Stack>
          {institute?.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={institute.logoUrl} alt="" style={{ height: 56, objectFit: 'contain' }} />
          )}
        </Group>

        <Group justify="space-between" style={{ borderTop: `1px solid ${brand}`, paddingTop: 10 }}>
          <Text fw={600}>إيصال دفع رقم {payment.receiptNumber}</Text>
          <Text size="sm">{formatDate(payment.paidAt)}</Text>
        </Group>

        {cancelled && (
          <Text fw={600} c="red" ta="center">
            إيصال ملغى{payment.cancelReason ? ` — ${payment.cancelReason}` : ''}
          </Text>
        )}

        <Table withRowBorders={false} verticalSpacing={4} fz="sm">
          <Table.Tbody>
            {rows.map(([label, value]) => (
              <Table.Tr key={label}>
                <Table.Td w={110} c="dimmed">{label}</Table.Td>
                <Table.Td fw={500}>{value}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Box p="sm" style={{ background: 'var(--app-brand-accent-soft)', borderRadius: 8 }}>
          <Text ta="center" fw={600} size="xl" style={{ color: brand }}>
            {formatMoney(toAmount(payment.amount), payment.currency)}
          </Text>
          {payment.currency !== contractCurrency && (
            <Text ta="center" size="xs">
              سعر الصرف {toAmount(payment.exchangeRate)} ← {formatMoney(toAmount(payment.appliedAmount), contractCurrency)}
            </Text>
          )}
        </Box>

        {payment.allocations.length > 0 && (
          <Stack gap={2}>
            <Text size="xs" fw={500}>توزيع الدفعة على الأقساط:</Text>
            {payment.allocations.map((a) => (
              <Text key={a.installment.id} size="xs">
                القسط {a.installment.installmentNumber} (استحقاق {formatDate(a.installment.dueDate)}):{' '}
                {formatMoney(toAmount(a.amount), contractCurrency)}
              </Text>
            ))}
          </Stack>
        )}

        {payment.note && <Text size="xs">ملاحظة: {payment.note}</Text>}

        <Group justify="space-between" mt="lg" align="flex-end">
          <Stack gap={4}>
            <Text size="xs">توقيع المستلم: ..................</Text>
            <Text size="xs">الختم</Text>
          </Stack>
          {verification && (
            <Stack gap={2} align="center">
              <Image src={verification.qr} alt="رمز التحقق" w={64} h={64} />
              <Text size="10px" dir="ltr">{verification.number}</Text>
            </Stack>
          )}
        </Group>
      </Stack>
    </Box>
  );
}
