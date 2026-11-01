'use client';

import { useMemo } from 'react';
import { Group } from '@mantine/core';
import {
  IconCalendarStats,
  IconSchool,
  IconUserCheck,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react';
import { AppButton, AppModule, StatCard, StatusBadge } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { DataModuleController } from '@/src/components/controllers/data-module';
import { useStudentsMirror } from '../store/useStudentsMirror';
import {
  studentsActivityDatasets,
  studentsAssignmentSegments,
  studentsLabels,
} from '../static-data/students.data';
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

  return (
    <AppModule variant="table">
      {/* Note: AppModule.Header is intentionally omitted on this page per requirements */}

      {/* 1. KPI cards */}
      <AppModule.Stats cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon tone="brand">
              <IconUsers size={21} stroke={1.7} />
            </StatCard.Icon>
            <StatusBadge tone="success" variant="dot">نشط</StatusBadge>
          </Group>
          <StatCard.Title>الطلاب المقيدون</StatCard.Title>
          <StatCard.Content>{total || 22}</StatCard.Content>
          <StatCard.Progress value={55} label="نسبة الاستيعاب" />
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconSchool size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>الشعب والفصول</StatCard.Title>
          <StatCard.Content>{totalPages || 32}</StatCard.Content>
          <StatCard.Action href="/sections">عرض الشعب</StatCard.Action>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconUserCheck size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>نسبة الالتزام والدوام</StatCard.Title>
          <StatCard.Content>11</StatCard.Content>
          <StatCard.Action>عرض سجل الحضور</StatCard.Action>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="brand">
            <IconCalendarStats size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>الامتحانات القادمة</StatCard.Title>
          <StatCard.Content>7 أيام</StatCard.Content>
          <StatCard.Action href="/timetable">عرض الجدول</StatCard.Action>
        </StatCard>
      </AppModule.Stats>

      {/* 2. Interactive charts (demo data until the API exists) */}
      <AppModule.Charts ratio="main-side">
        <ChartCard
          title="تحليلات الحضور والنشاط"
          subtitle="توزيع الساعات وتحديد فترات الذروة"
          periods={Object.keys(studentsActivityDatasets)}
        >
          <ChartCard.Bar datasets={studentsActivityDatasets} unit="h" />
        </ChartCard>

        <ChartCard title="معدل تسليم الواجبات" subtitle="مؤشرات إنجاز الأنشطة للطلاب المتابعين">
          <ChartCard.Circle segments={studentsAssignmentSegments} totalLabel="مجموع الواجبات" />
        </ChartCard>
      </AppModule.Charts>

      {/* 3. Modern Floating Strip Table */}
      <AppModule.Table>
        <DataModuleController
          title={studentsLabels.title}
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
          <DataModuleController.Header>
            <DataModuleController.Title icon={<IconUsers size={22} stroke={1.7} />} badgeLabel="طالب" />
            <DataModuleController.Actions>
              <AppButton href="/students/new" leftSection={<IconUserPlus size={16} stroke={1.7} />}>
                {studentsLabels.createAction}
              </AppButton>
            </DataModuleController.Actions>
          </DataModuleController.Header>

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
