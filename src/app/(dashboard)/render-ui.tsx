'use client';

import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendarCheck,
  IconCalendarEvent,
  IconLayoutGrid,
  IconPlus,
  IconSchool,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useAuth } from '@/src/core/auth';
import { useAcademicYearsQuery, useSectionsQuery } from '@/src/core/api';

/**
 * RenderUi for Dashboard Home Page
 *
 * Clean Client Component boundary presenting live overview cards for
 * Academic Years and Sections with fast navigational pathways.
 */
export function RenderUi() {
  const { user } = useAuth();

  const { data: yearsData, isLoading: yearsLoading } = useAcademicYearsQuery({ limit: 5 });
  const { data: sectionsData, isLoading: sectionsLoading } = useSectionsQuery({ limit: 5 });

  const activeYear = yearsData?.data?.find((y) => y.isCurrent);
  const totalYears = yearsData?.total ?? 0;
  const totalSections = sectionsData?.total ?? 0;

  return (
    <Box p={{ base: 'xs', sm: 'md' }}>
      <Stack gap="xl">
        {/* Welcome Header */}
        <Card
          radius="xl"
          p="xl"
          withBorder
          style={{
            background:
              'linear-gradient(135deg, rgba(30, 78, 140, 0.05) 0%, rgba(30, 78, 140, 0.01) 100%)',
            borderColor: 'var(--mantine-color-gray-2)',
          }}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Stack gap={4}>
              <Group gap="xs">
                <Title order={2} size="h3" fw={700}>
                  أهلاً بك، {user?.fullName || 'مدير المعهد'}
                </Title>
                <Badge variant="light" color="teal" radius="xl" size="sm">
                  لوحة الإدارة
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                متابعة وإدارة الهيكل الأكاديمي، السنوات الدراسية، والشُعب التعليمية للمعهد.
              </Text>
            </Stack>

            {activeYear && (
              <Card radius="lg" withBorder p="xs" px="md" bg="var(--mantine-color-body)">
                <Group gap="xs">
                  <ThemeIcon size="md" radius="xl" color="teal" variant="light">
                    <IconCalendarCheck size={18} />
                  </ThemeIcon>
                  <Stack gap={0}>
                    <Text size="xs" c="dimmed">
                      السنة الدراسية الحالية
                    </Text>
                    <Text size="sm" fw={700} c="teal">
                      {activeYear.name}
                    </Text>
                  </Stack>
                </Group>
              </Card>
            )}
          </Group>
        </Card>

        {/* Feature Cards Grid */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {/* Academic Years Card */}
          <Card radius="xl" withBorder p="lg" shadow="none">
            <Stack justify="space-between" h="100%" gap="md">
              <Group justify="space-between" align="flex-start">
                <Group gap="md">
                  <ThemeIcon size={48} radius="xl" color="primary" variant="light">
                    <IconCalendarEvent size={24} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Title order={3} size="h4" fw={700}>
                      السنوات الدراسية
                    </Title>
                    <Text size="xs" c="dimmed">
                      تنظيم التقويم الدراسي وتفعيل السنة الحالية
                    </Text>
                  </Stack>
                </Group>
                <Badge variant="filled" color="primary" radius="xl" size="lg">
                  {yearsLoading ? '...' : `${totalYears} سنوات`}
                </Badge>
              </Group>

              {yearsData?.data && yearsData.data.length > 0 && (
                <Stack gap="xs" mt="xs">
                  <Text size="xs" fw={600} c="dimmed">
                    السنوات الأخيرة:
                  </Text>
                  {yearsData.data.slice(0, 3).map((year) => (
                    <Group
                      key={year.id}
                      justify="space-between"
                      p="xs"
                      px="sm"
                      style={{
                        backgroundColor: 'var(--mantine-color-gray-0)',
                        borderRadius: rem(10),
                      }}
                    >
                      <Text size="sm" fw={500}>
                        {year.name}
                      </Text>
                      {year.isCurrent ? (
                        <Badge size="xs" color="teal" variant="light" radius="xl">
                          نشطة
                        </Badge>
                      ) : (
                        <Text size="xs" c="dimmed">
                          {year.startDate?.split('T')[0]}
                        </Text>
                      )}
                    </Group>
                  ))}
                </Stack>
              )}

              <Group justify="space-between" mt="md">
                <Button
                  component={Link}
                  href="/academic-years"
                  variant="light"
                  color="primary"
                  radius="xl"
                  size="sm"
                  rightSection={<IconArrowLeft size={14} />}
                >
                  إدارة السنوات الدراسية
                </Button>
                <Button
                  component={Link}
                  href="/academic-years"
                  variant="subtle"
                  color="primary"
                  radius="xl"
                  size="sm"
                  leftSection={<IconPlus size={14} />}
                >
                  إضافة سنة
                </Button>
              </Group>
            </Stack>
          </Card>

          {/* Sections Card */}
          <Card radius="xl" withBorder p="lg" shadow="none">
            <Stack justify="space-between" h="100%" gap="md">
              <Group justify="space-between" align="flex-start">
                <Group gap="md">
                  <ThemeIcon size={48} radius="xl" color="blue" variant="light">
                    <IconLayoutGrid size={24} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Title order={3} size="h4" fw={700}>
                      الشُعب والفصول
                    </Title>
                    <Text size="xs" c="dimmed">
                      إدارة الفصول والمراحل وتوزيع الرسوم الدراسية
                    </Text>
                  </Stack>
                </Group>
                <Badge variant="filled" color="blue" radius="xl" size="lg">
                  {sectionsLoading ? '...' : `${totalSections} شعب`}
                </Badge>
              </Group>

              {sectionsData?.data && sectionsData.data.length > 0 && (
                <Stack gap="xs" mt="xs">
                  <Text size="xs" fw={600} c="dimmed">
                    الشُعب المسجلة:
                  </Text>
                  {sectionsData.data.slice(0, 3).map((section) => (
                    <Group
                      key={section.id}
                      justify="space-between"
                      p="xs"
                      px="sm"
                      style={{
                        backgroundColor: 'var(--mantine-color-gray-0)',
                        borderRadius: rem(10),
                      }}
                    >
                      <Group gap="xs">
                        <Text size="sm" fw={500}>
                          {section.name}
                        </Text>
                        <Badge size="xs" color="gray" variant="light" radius="xl">
                          {section.grade}
                        </Badge>
                      </Group>
                      <Text size="xs" fw={600} c="teal">
                        {Number(section.feeAmount).toLocaleString('ar-SA')} ر.س
                      </Text>
                    </Group>
                  ))}
                </Stack>
              )}

              <Group justify="space-between" mt="md">
                <Button
                  component={Link}
                  href="/sections"
                  variant="light"
                  color="blue"
                  radius="xl"
                  size="sm"
                  rightSection={<IconArrowLeft size={14} />}
                >
                  إدارة الشُعب والفصول
                </Button>
                <Button
                  component={Link}
                  href="/sections"
                  variant="subtle"
                  color="blue"
                  radius="xl"
                  size="sm"
                  leftSection={<IconPlus size={14} />}
                >
                  إضافة شعبة
                </Button>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
