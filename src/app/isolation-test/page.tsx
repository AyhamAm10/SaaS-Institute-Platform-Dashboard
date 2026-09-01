'use client';

import {
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowRight,
  IconCheck,
  IconLayoutSidebar,
  IconTestPipe,
} from '@tabler/icons-react';
import Link from 'next/link';
import { SidebarController, useSidebarMirror } from '@/src/components/controllers/sidebar';

/**
 * Child inspector component that consumes Sidebar state via useSidebarMirror.
 */
function SidebarInstanceInspector({ label, color }: { label: string; color: string }) {
  const isCollapsed = useSidebarMirror('isDesktopCollapsed');
  const toggleCollapse = useSidebarMirror('toggleDesktopCollapse');
  const isMobileOpen = useSidebarMirror('isMobileOpen');
  const toggleMobile = useSidebarMirror('toggleMobile');
  const openedSections = useSidebarMirror('openedSections');
  const toggleSection = useSidebarMirror('toggleSection');

  return (
    <Card padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="sm">
        <Group gap="xs">
          <Badge color={color} size="lg" variant="filled">
            {label}
          </Badge>
          <Text fw={600} size="sm">
            Zustand Store معزول ومستقل
          </Text>
        </Group>
      </Group>

      <Divider my="xs" />

      <Stack gap="xs" my="sm">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">حالة طي القائمة (isDesktopCollapsed):</Text>
          <Badge color={isCollapsed ? 'indigo' : 'gray'}>
            {isCollapsed ? 'نعم (مطوية)' : 'لا (موسعة)'}
          </Badge>
        </Group>

        <Group justify="space-between">
          <Text size="sm" c="dimmed">حالة قائمة الجوال (isMobileOpen):</Text>
          <Badge color={isMobileOpen ? 'green' : 'gray'}>
            {isMobileOpen ? 'مفتوحة' : 'مغلقة'}
          </Badge>
        </Group>

        <Group justify="space-between">
          <Text size="sm" c="dimmed">الأقسام الموسعة حالياً:</Text>
          <Text size="xs" fw={600}>
            {openedSections.length > 0 ? openedSections.join('، ') : 'لا يوجد'}
          </Text>
        </Group>
      </Stack>

      <Divider my="xs" />

      <Stack gap="xs" mt="sm">
        <Text size="xs" fw={700} c="dimmed">
          التفاعل مع هذا الـ Store حصراً:
        </Text>
        <SimpleGrid cols={2} spacing="xs">
          <Button size="xs" variant="light" color={color} onClick={toggleCollapse}>
            تبديل الطي
          </Button>
          <Button size="xs" variant="light" color={color} onClick={toggleMobile}>
            تبديل الجوال
          </Button>
          <Button size="xs" variant="outline" color={color} onClick={() => toggleSection('academic')}>
            تبديل الأكاديمية
          </Button>
          <Button size="xs" variant="outline" color={color} onClick={() => toggleSection('people')}>
            تبديل الكوادر
          </Button>
        </SimpleGrid>
      </Stack>
    </Card>
  );
}

export default function StoreIsolationVerificationPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Button
            component={Link}
            href="/"
            variant="subtle"
            rightSection={<IconArrowRight size={16} />}
          >
            العودة للوحة التحكم
          </Button>
          <Badge size="lg" color="teal" variant="light" leftSection={<IconCheck size={14} />}>
            بنية عزل الحالة لكل مثيل
          </Badge>
        </Group>

        <Paper p="lg" radius="md" withBorder>
          <Group gap="md">
            <IconTestPipe size={32} color="var(--mantine-color-primary-6)" />
            <Stack gap={2}>
              <Title order={2} fw={700}>
                التحقق التفاعلي من عزل حالة Zustand لكل مثيل
              </Title>
              <Text c="dimmed" size="sm">
                تعرض هذه الصفحة مثيلين منفصلين تماماً من <code>&lt;SidebarController /&gt;</code> يعملان جنباً إلى جنب.
                قم بالنقر على أزرار التبديل أدناه لتتأكد من أن تغيير حالة المتجر (أ) لا يؤثر إطلاقاً على المتجر (ب).
              </Text>
            </Stack>
          </Group>
        </Paper>

        <Grid>
          {/* Instance A */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <SidebarController defaultCollapsed={false}>
              <SidebarInstanceInspector label="مثيل القائمة (أ)" color="primary" />
            </SidebarController>
          </Grid.Col>

          {/* Instance B */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <SidebarController defaultCollapsed={true}>
              <SidebarInstanceInspector label="مثيل القائمة (ب)" color="teal" />
            </SidebarController>
          </Grid.Col>
        </Grid>

        <Alert color="primary" title="الضمان المعماري" icon={<IconLayoutSidebar size={18} />}>
          يستخدم كل مكوّن Controller دالة توليد مستقلة للمتجر داخل <code>useState(() =&gt; createSidebarStore(props))</code> ويتم تمريرها عبر React Context. يضمن ذلك عدم تداخل أو تسرب الحالة بين المكونات المتعددة على نفس الشاشة.
        </Alert>
      </Stack>
    </Container>
  );
}
