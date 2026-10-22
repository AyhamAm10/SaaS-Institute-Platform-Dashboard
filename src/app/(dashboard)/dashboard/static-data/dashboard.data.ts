export interface DashboardKpiItem {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  badgeText: string;
  badgeColor: string;
  progressPercent: number;
  iconType: 'students' | 'sections' | 'teachers' | 'finance';
}

export interface StageDistributionItem {
  id: string;
  name: string;
  studentsCount: number;
  percentage: number;
  color: string;
}

export interface LiveScheduleItem {
  id: string;
  sectionName: string;
  subjectName: string;
  teacherName: string;
  roomName: string;
  timeSlot: string;
  status: 'live' | 'upcoming' | 'completed';
  statusText: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  href: string;
  iconType: 'section' | 'branch' | 'year' | 'timetable';
  color: string;
}

export const dashboardStaticData = {
  header: {
    welcomeSubtitle: 'نظرة شاملة ومباشرة على أداء المعهد، الشعب، والعمليات التعليمية اليومية.',
    capacityTitle: 'نسبة الاستيعاب الكلية للمعهد',
    capacityValue: '83%',
    capacityDetail: '1,248 من أصل 1,500 طالب',
  },

  kpis: [
    {
      id: 'students',
      title: 'إجمالي الطلاب المسجلين',
      value: '1,248',
      subtitle: 'طالبا وطالبة هذا الفصل',
      badgeText: '+12% نمو سنوي',
      badgeColor: 'teal',
      progressPercent: 83,
      iconType: 'students',
    },
    {
      id: 'sections',
      title: 'الشعب والقاعات النشطة',
      value: '38',
      subtitle: 'شعبة في 14 قاعة دراسية',
      badgeText: '92% إشغال القاعات',
      badgeColor: 'blue',
      progressPercent: 92,
      iconType: 'sections',
    },
    {
      id: 'teachers',
      title: 'الكادر التدريسي المعتمد',
      value: '34',
      subtitle: 'مدرسا ومدرسة متخصصا',
      badgeText: '100% تغطية الحصص',
      badgeColor: 'violet',
      progressPercent: 100,
      iconType: 'teachers',
    },
    {
      id: 'finance',
      title: 'معدل التحصيل المالي',
      value: '82%',
      subtitle: '324,500 ر.س تم تحصيلها',
      badgeText: 'مستهدف: 395 ألف ر.س',
      badgeColor: 'teal',
      progressPercent: 82,
      iconType: 'finance',
    },
  ] as DashboardKpiItem[],

  stageDistribution: [
    {
      id: 'grade-12-scientific',
      name: 'الثالث الثانوي (الفرع العلمي)',
      studentsCount: 420,
      percentage: 34,
      color: 'teal',
    },
    {
      id: 'grade-12-literary',
      name: 'الثالث الثانوي (الفرع الأدبي)',
      studentsCount: 260,
      percentage: 21,
      color: 'blue',
    },
    {
      id: 'grade-11',
      name: 'الثاني الثانوي (عام ولغات)',
      studentsCount: 318,
      percentage: 25,
      color: 'violet',
    },
    {
      id: 'grade-10-preparatory',
      name: 'الأول الثانوي والمرحلة الأساسية',
      studentsCount: 250,
      percentage: 20,
      color: 'orange',
    },
  ] as StageDistributionItem[],

  liveSchedule: [
    {
      id: 'sch-1',
      sectionName: 'شعبة الثالث الثانوي (أ)',
      subjectName: 'رياضيات متقدمة (تفاضل وتكامل)',
      teacherName: 'أ. محمد العمر',
      roomName: 'قاعة الخوارزمي (101)',
      timeSlot: '10:00 ص - 11:30 ص',
      status: 'live',
      statusText: 'جارية الآن',
    },
    {
      id: 'sch-2',
      sectionName: 'شعبة الثاني الثانوي (ب)',
      subjectName: 'فيزياء تطبيقية (الميكانيكا)',
      teacherName: 'أ. أحمد الخالد',
      roomName: 'قاعة نيوتن (103)',
      timeSlot: '11:45 ص - 01:15 م',
      status: 'upcoming',
      statusText: 'تبدأ بعد 15 دقيقة',
    },
    {
      id: 'sch-3',
      sectionName: 'شعبة الثالث الثانوي (ب)',
      subjectName: 'كيمياء عضوية وتطبيقية',
      teacherName: 'د. سامر العلي',
      roomName: 'مختبر ابن الهيثم',
      timeSlot: '01:30 م - 03:00 م',
      status: 'upcoming',
      statusText: 'قادمة اليوم',
    },
    {
      id: 'sch-4',
      sectionName: 'شعبة التاسع الأساسي (أ)',
      subjectName: 'لغة عربية (نحو وصرف)',
      teacherName: 'أ. فاطمة النجار',
      roomName: 'قاعة المتنبي (102)',
      timeSlot: '08:30 ص - 10:00 ص',
      status: 'completed',
      statusText: 'مكتملة اليوم',
    },
  ] as LiveScheduleItem[],

  quickActions: [
    {
      id: 'add-section',
      title: 'إدارة وتوزيع الشعب',
      description: 'إنشاء شعبة صفية جديدة وتحديد الرسوم والقاعات',
      href: '/sections',
      iconType: 'section',
      color: 'blue',
    },
    {
      id: 'add-branch',
      title: 'الفروع الجغرافية',
      description: 'متابعة الفروع والمراكز التعليمية التابعة للمعهد',
      href: '/branches',
      iconType: 'branch',
      color: 'teal',
    },
    {
      id: 'academic-years',
      title: 'السنوات الدراسية',
      description: 'إدارة التقويم الأكاديمي وتحديد السنة النشطة',
      href: '/academic-years',
      iconType: 'year',
      color: 'violet',
    },
    {
      id: 'timetable',
      title: 'الجدول الدراسي العام',
      description: 'مخطط الحصص الأسبوعي ومتابعة تعارض الحصص والقاعات',
      href: '/timetable',
      iconType: 'timetable',
      color: 'orange',
    },
  ] as QuickActionItem[],
};
