'use client';

import { useMemo } from 'react';
import { Badge, Group } from '@mantine/core';
import {
  IconCalendarStats,
  IconSchool,
  IconUserCheck,
  IconUsers,
} from '@tabler/icons-react';
import { AppModule, StatCard } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { studentsLabels } from '../static-data/students.data';
import { getStudentsColumns } from './StudentsTable';
import { Student } from '@/src/core/api';

export function StudentsView() {
  const students = useStudentsMirror('students');
  const total = useStudentsMirror('total');
  const totalPages = useStudentsMirror('totalPages');
  const page = useStudentsMirror('page');
  const limit = useStudentsMirror('limit');
  const isLoading = useStudentsMirror('isLoading');
  const setPage = useStudentsMirror('setPage');
  const setSearch = useStudentsMirror('setSearch');

  const columns = useMemo(() => getStudentsColumns(), []);

  // Demo data for Bar chart matching Image 2
  const weeklyActivityData = [
    { label: 'Mon', value: 38 },
    { label: 'Tues', value: 72 },
    { label: 'Wed', value: 68 },
    { label: 'Thurs', value: 92, highlight: true, tooltipBadge: '🔥 8 Hours' },
    { label: 'Fri', value: 45 },
    { label: 'Sat', value: 30 },
    { label: 'Sun', value: 80 },
  ];

  // Demo data for Circle / Donut chart matching assignment breakdown
  const assignmentData = [
    { label: 'تم التسليم بالكامل', value: 65, color: 'var(--app-brand-primary)' },
    { label: 'قيد المراجعة', value: 20, color: 'var(--app-brand-accent)' },
    { label: 'مهام متبقية', value: 15, color: 'var(--app-border)' },
  ];

  return (
    <AppModule variant="table">
      {/* Note: AppModule.Header is intentionally omitted on this page per requirements */}

      {/* 1. Structured Stat Cards (Exact Image 2 Anatomy) */}
      <AppModule.Stats cols={{ base: 1, sm: 2, lg: 4 }}>
        {/* Card 1: Enrolled / Active with Progress */}
        <StatCard>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <StatCard.Icon>
                <IconUsers size={16} />
              </StatCard.Icon>
              <StatCard.Title>الطلاب المقيدون</StatCard.Title>
            </Group>
            <Badge variant="light" color="teal" size="xs" radius="xl">
              • نشط
            </Badge>
          </Group>
          <StatCard.Content>{total || 22}</StatCard.Content>
          <StatCard.Progress value={55} label="Progress" color="var(--app-brand-primary)" />
        </StatCard>

        {/* Card 2: Total Assignments / Sections with Action Pill */}
        <StatCard>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <StatCard.Icon>
                <IconSchool size={16} />
              </StatCard.Icon>
              <StatCard.Title>الشعب والفصول</StatCard.Title>
            </Group>
          </Group>
          <StatCard.Content>{totalPages || 32}</StatCard.Content>
          <StatCard.Action href="/sections">عرض الشعب</StatCard.Action>
        </StatCard>

        {/* Card 3: Completed Courses / Attendance with Action Pill */}
        <StatCard>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <StatCard.Icon>
                <IconUserCheck size={16} />
              </StatCard.Icon>
              <StatCard.Title>نسبة الالتزام والدوام</StatCard.Title>
            </Group>
          </Group>
          <StatCard.Content>11</StatCard.Content>
          <StatCard.Action>عرض سجل الحضور</StatCard.Action>
        </StatCard>

        {/* Card 4: Upcoming Quiz / Timetable with Action Pill */}
        <StatCard>
          <Group justify="space-between" align="center">
            <Group gap="xs" align="center">
              <StatCard.Icon>
                <IconCalendarStats size={16} />
              </StatCard.Icon>
              <StatCard.Title>الامتحانات القادمة</StatCard.Title>
            </Group>
          </Group>
          <StatCard.Content>7 Days</StatCard.Content>
          <StatCard.Action href="/timetable">عرض الجدول</StatCard.Action>
        </StatCard>
      </AppModule.Stats>

      {/* 2. Responsive Charts (Exact Image 2 Bar Chart + Circle Chart) */}
      <AppModule.Charts ratio="main-side">
        <ChartCard
          title="تحليلات الحضور والنشاط (Report Analytics)"
          subtitle="توزيع الساعات الأسبوعية وتحديد فترات الذروة"
          periods={['Daily', 'Weekly', 'Monthly']}
          activePeriod="Daily"
        >
          <ChartCard.Bar data={weeklyActivityData} />
        </ChartCard>

        <ChartCard
          title="معدل تسليم الواجبات (Assignment Breakdown)"
          subtitle="مؤشرات إنجاز الأنشطة للطلاب المتابعين"
        >
          <ChartCard.Circle
            segments={assignmentData}
            totalLabel="مجموع الواجبات"
          />
        </ChartCard>
      </AppModule.Charts>

      {/* 3. Modern Floating Strip Table */}
      <AppModule.Table>
        <DataModuleController
          title=""
          description=""
          data={students}
          columns={columns}
          total={total}
          page={page}
          limit={limit}
          totalPages={totalPages}
          isLoading={isLoading}
          emptyMessage={studentsLabels.emptyMessage}
          emptyDescription={studentsLabels.emptyDescription}
          searchPlaceholder={studentsLabels.searchPlaceholder}
          keyExtractor={(item: Student) => item.id}
          onPageChange={setPage}
          onSearchChange={setSearch}
        >
          <DataModuleController.FilterBar>
            <DataModuleController.SearchInput placeholder={studentsLabels.searchPlaceholder} />
          </DataModuleController.FilterBar>

          <DataModuleController.Content>
            <DataModuleController.Table />
          </DataModuleController.Content>

          <DataModuleController.Footer />
        </DataModuleController>
      </AppModule.Table>
    </AppModule>
  );
}
