'use client';

import { Badge, Button, Group } from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendarStats,
  IconSchool,
  IconUserCheck,
  IconUsers,
} from '@tabler/icons-react';
import Link from 'next/link';
import { AppModule, StatCard } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';

export function DashboardView() {
  const weeklyActivityData = [
    { label: 'السبت', value: 38 },
    { label: 'الأحد', value: 72 },
    { label: 'الإثنين', value: 92, highlight: true, tooltipBadge: '🔥 8h الذروة' },
    { label: 'الثلاثاء', value: 68 },
    { label: 'الأربعاء', value: 84 },
    { label: 'الخميس', value: 50 },
  ];

  const curriculumDonutData = [
    { label: 'المناهج المكتملة', value: 84, color: 'var(--app-brand-primary)' },
    { label: 'قيد التدريس', value: 16, color: 'var(--app-brand-accent)' },
  ];

  return (
    <AppModule variant="dashboard">
      {/* 1. Header with Title and Quick Nav */}
      <AppModule.Header
        breadcrumbs={[
          { label: 'الرئيسية' },
          { label: 'لوحة التحكم الإحصائية' },
        ]}
        title="لوحة التحكم الإحصائية"
        description="متابعة مؤشرات الأداء الأكاديمي، نشاط الشُعب المباشر، والتقارير الأسبوعية المحدثة لحظياً"
        badge={
          <Badge variant="light" color="primary" radius="xl" size="md">
            العام الأكاديمي 2026/2027
          </Badge>
        }
        actions={
          <Group gap="xs">
            <Button
              component={Link}
              href="/students"
              variant="filled"
              radius="xl"
              leftSection={<IconUsers size={16} />}
              rightSection={<IconArrowLeft size={14} />}
            >
              سجلات الطلاب
            </Button>
            <Button
              component={Link}
              href="/sections"
              variant="light"
              radius="xl"
              leftSection={<IconSchool size={16} />}
            >
              الشعب الدراسية
            </Button>
          </Group>
        }
      />

      {/* 2. Structured Stat Cards (Compound Pattern) */}
      <AppModule.Stats cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon color="var(--app-brand-primary)">
              <IconUsers size={18} />
            </StatCard.Icon>
            <Badge variant="light" color="teal" size="xs" radius="xl">
              +12% هذا الفصل
            </Badge>
          </Group>
          <StatCard.Title>إجمالي الطلاب المسجلين</StatCard.Title>
          <StatCard.Content subtitle="في جميع التخصصات">2,480</StatCard.Content>
          <StatCard.Progress value={88} label="القدرة الاستيعابية" />
        </StatCard>

        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon color="var(--app-brand-accent)">
              <IconSchool size={18} />
            </StatCard.Icon>
            <Badge variant="light" color="blue" size="xs" radius="xl">
              94% إشغال
            </Badge>
          </Group>
          <StatCard.Title>الشعب والفصول النشطة</StatCard.Title>
          <StatCard.Content subtitle="فصول دراسية مكتملة">48</StatCard.Content>
          <StatCard.Progress value={94} label="معدل الامتلاء" color="var(--app-brand-accent)" />
        </StatCard>

        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon color="#10b981">
              <IconUserCheck size={18} />
            </StatCard.Icon>
            <Badge variant="light" color="teal" size="xs" radius="xl">
              مكتمل الكادر
            </Badge>
          </Group>
          <StatCard.Title>الكادر التعليمي والمحاضرون</StatCard.Title>
          <StatCard.Content subtitle="أساتذة معتمدون">64</StatCard.Content>
          <StatCard.Progress value={100} label="اكتمال النصاب" color="#10b981" />
        </StatCard>

        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon color="#8b5cf6">
              <IconCalendarStats size={18} />
            </StatCard.Icon>
            <Badge variant="light" color="violet" size="xs" radius="xl">
              مرتفع جداً
            </Badge>
          </Group>
          <StatCard.Title>نسبة الحضور والالتزام</StatCard.Title>
          <StatCard.Content subtitle="متوسط الأسبوع الحالي">96.8%</StatCard.Content>
          <StatCard.Progress value={96.8} label="معدل الانضباط" color="#8b5cf6" />
        </StatCard>
      </AppModule.Stats>

      {/* 3. Responsive Charts (Bar Chart + Circle Donut Chart) */}
      <AppModule.Charts ratio="main-side">
        <ChartCard
          title="ساعات الحضور والنشاط الأسبوعي"
          subtitle="توزيع الكثافة التعليمية والحضور الفعلي حسب أيام الأسبوع"
          periods={['يومي', 'أسبوعي', 'شهري']}
        >
          <ChartCard.Bar data={weeklyActivityData} />
        </ChartCard>

        <ChartCard
          title="إنجاز الخطط والمناهج"
          subtitle="نسبة الدروس المنجزة من المناهج المعتمدة"
        >
          <ChartCard.Circle
            segments={curriculumDonutData}
            totalLabel="مجموع المقررات"
          />
        </ChartCard>
      </AppModule.Charts>
    </AppModule>
  );
}
