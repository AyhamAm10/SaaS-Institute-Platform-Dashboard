'use client';

import { Group } from '@mantine/core';
import {
  IconArrowLeft,
  IconCalendarStats,
  IconSchool,
  IconUserCheck,
  IconUsers,
} from '@tabler/icons-react';
import { AppButton, AppModule, StatCard, StatusBadge } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { dashboardActivityDatasets, dashboardCurriculumSegments } from '../static-data/dashboard.data';

export function DashboardView() {
  return (
    <AppModule variant="dashboard">
      {/* Title + actions only: branch and academic year already live in the top bar. */}
      <AppModule.Header
        title="لوحة التحكم"
        actions={
          <Group gap="sm">
            <AppButton href="/sections" variant="outline" leftSection={<IconSchool size={16} stroke={1.7} />}>
              الشعب الدراسية
            </AppButton>
            <AppButton
              href="/students"
              leftSection={<IconUsers size={16} stroke={1.7} />}
              rightSection={<IconArrowLeft size={14} />}
            >
              سجلات الطلاب
            </AppButton>
          </Group>
        }
      />

      {/* KPI cards */}
      <AppModule.Stats>
        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon tone="brand">
              <IconUsers size={21} stroke={1.7} />
            </StatCard.Icon>
            <StatusBadge tone="success">+12% هذا الفصل</StatusBadge>
          </Group>
          <StatCard.Title>إجمالي الطلاب المسجلين</StatCard.Title>
          <StatCard.Content subtitle="في جميع التخصصات">2,480</StatCard.Content>
          <StatCard.Progress value={88} label="القدرة الاستيعابية" />
        </StatCard>

        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon tone="ink">
              <IconSchool size={21} stroke={1.7} />
            </StatCard.Icon>
            <StatusBadge tone="neutral">94% إشغال</StatusBadge>
          </Group>
          <StatCard.Title>الشعب والفصول النشطة</StatCard.Title>
          <StatCard.Content subtitle="فصول دراسية مكتملة">48</StatCard.Content>
          <StatCard.Progress value={94} label="معدل الامتلاء" tone="ink" />
        </StatCard>

        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon tone="ink">
              <IconUserCheck size={21} stroke={1.7} />
            </StatCard.Icon>
            <StatusBadge tone="brand">مكتمل الكادر</StatusBadge>
          </Group>
          <StatCard.Title>الكادر التعليمي</StatCard.Title>
          <StatCard.Content subtitle="أساتذة معتمدون">64</StatCard.Content>
          <StatCard.Progress value={100} label="اكتمال النصاب" tone="ink" />
        </StatCard>

        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon tone="brand">
              <IconCalendarStats size={21} stroke={1.7} />
            </StatCard.Icon>
            <StatusBadge tone="success">مرتفع جدا</StatusBadge>
          </Group>
          <StatCard.Title>نسبة الحضور والالتزام</StatCard.Title>
          <StatCard.Content subtitle="متوسط الأسبوع الحالي">96.8%</StatCard.Content>
          <StatCard.Progress value={96.8} label="معدل الانضباط" />
        </StatCard>
      </AppModule.Stats>

      {/* Interactive charts (demo data until the API exists) */}
      <AppModule.Charts ratio="main-side">
        <ChartCard
          title="ساعات الحضور والنشاط"
          subtitle="مرر فوق العمود لرؤية قيمته، واضغط عليه لتمييزه"
          periods={Object.keys(dashboardActivityDatasets)}
        >
          <ChartCard.Bar datasets={dashboardActivityDatasets} unit="h" />
        </ChartCard>

        <ChartCard title="إنجاز الخطط والمناهج" subtitle="نسبة الدروس المنجزة من المناهج المعتمدة">
          <ChartCard.Circle segments={dashboardCurriculumSegments} totalLabel="مقرر دراسي" />
        </ChartCard>
      </AppModule.Charts>
    </AppModule>
  );
}
