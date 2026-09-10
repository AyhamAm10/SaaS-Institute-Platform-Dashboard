'use client';

import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Divider,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconAlertTriangle,
  IconCheck,
  IconSparkles,
  IconWand,
} from '@tabler/icons-react';
import { useTimetableMirror } from '../store/useTimetableMirror';

interface TimetableGenerateModalProps {
  onGenerate: () => void;
}

export function TimetableGenerateModal({ onGenerate }: TimetableGenerateModalProps) {
  const generateModalOpened = useTimetableMirror('generateModalOpened');
  const generateIncremental = useTimetableMirror('generateIncremental');
  const generateLockExisting = useTimetableMirror('generateLockExisting');
  const generateResult = useTimetableMirror('generateResult');
  const generateError = useTimetableMirror('generateError');
  const isGenerating = useTimetableMirror('isGenerating');

  const closeGenerateModal = useTimetableMirror('closeGenerateModal');
  const setGenerateIncremental = useTimetableMirror('setGenerateIncremental');
  const setGenerateLockExisting = useTimetableMirror('setGenerateLockExisting');

  return (
    <Modal
      opened={generateModalOpened}
      onClose={closeGenerateModal}
      radius="xl"
      size="lg"
      title={
        <Group gap="xs">
          <ThemeIcon color="indigo" variant="light" radius="xl">
            <IconSparkles size={18} />
          </ThemeIcon>
          <Text fw={700} size="md">
            التوليد الآلي للجدول الدراسي (محرك الذكاء الاصطناعي)
          </Text>
        </Group>
      }
      centered
    >
      <Stack gap="md">
        <Text size="xs" c="dimmed">
          يقوم المحرك بحل قيود الجداول (Constraint Satisfaction Problem) وتوزيع الحصص على أيام الدوام مع مراعاة تفرغ المعلمين، صلاحيات القاعات، ومنع أي تضارب مزدوج.
        </Text>

        <Paper p="md" radius="lg" withBorder bg="var(--mantine-color-gray-0)">
          <Stack gap="sm">
            <Checkbox
              label="جدولة تدريجية (Incremental Scheduling)"
              description="الإبقاء على الحصص المجدولة حالياً ومحاولة إكمال الحصص الشاغرة فقط"
              checked={generateIncremental}
              onChange={(e) => setGenerateIncremental(e.currentTarget.checked)}
            />
            <Checkbox
              label="تثبيت الحصص الحالية تلقائياً"
              description="تطبيق قفل الحماية على كافة الحصص الحالية لمنع تغيير مواعيدها"
              checked={generateLockExisting}
              onChange={(e) => setGenerateLockExisting(e.currentTarget.checked)}
            />
          </Stack>
        </Paper>

        {generateError && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            color="red"
            radius="xl"
            title="تعذر التوليد"
          >
            {generateError}
          </Alert>
        )}

        {generateResult && (
          <Stack gap="xs">
            <Alert
              icon={<IconCheck size={18} />}
              color="teal"
              radius="xl"
              title="اكتملت الجدولة بنجاح"
            >
              <Text size="xs">
                تم إنشاء وتوزيع {generateResult.totalGenerated} حصة دراسية في الجدول.
              </Text>
            </Alert>

            {generateResult.unassignedRequirements &&
              generateResult.unassignedRequirements.length > 0 && (
                <Alert
                  icon={<IconAlertTriangle size={18} />}
                  color="yellow"
                  radius="xl"
                  title={`تعذر إيجاد شاغر لـ ${generateResult.unassignedRequirements.length} متطلبات`}
                >
                  <Stack gap={4}>
                    {generateResult.unassignedRequirements.map((u, i) => (
                      <Text key={i} size="xs">
                        شُعبة {u.sectionId}: تبقى {u.periodsRemaining} حصص ({u.reason})
                      </Text>
                    ))}
                  </Stack>
                </Alert>
              )}
          </Stack>
        )}

        <Divider mt="xs" />

        <Group justify="flex-end">
          <Button variant="light" color="gray" radius="xl" onClick={closeGenerateModal}>
            إغلاق
          </Button>
          <Button
            leftSection={<IconWand size={18} />}
            color="indigo"
            radius="xl"
            loading={isGenerating}
            onClick={onGenerate}
          >
            بدء التوليد الذكي الآن
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
