'use client';

import { ActionIcon, Badge, Group, Text, Tooltip } from '@mantine/core';
import { IconEdit, IconListDetails } from '@tabler/icons-react';
import { StudentField } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';

function getFieldTypeBadge(type: StudentField['type']) {
  switch (type) {
    case 'TEXT':
      return <Badge color="blue" variant="light" radius="xl" size="sm">نصي</Badge>;
    case 'NUMBER':
      return <Badge color="teal" variant="light" radius="xl" size="sm">رقمي</Badge>;
    case 'DATE':
      return <Badge color="violet" variant="light" radius="xl" size="sm">تاريخ</Badge>;
    case 'SELECT':
      return <Badge color="orange" variant="light" radius="xl" size="sm">قائمة منسدلة</Badge>;
    case 'BOOLEAN':
      return <Badge color="gray" variant="light" radius="xl" size="sm">نعم / لا</Badge>;
  }
}

export function getStudentFieldsColumns(
  onEdit: (field: StudentField) => void,
): DataModuleColumn<StudentField>[] {
  return [
    {
      key: 'label',
      title: 'تسمية الحقل',
      sortable: true,
      render: (field) => (
        <Group gap="sm" wrap="nowrap">
          <ActionIcon size="md" radius="xl" variant="light" color="primary">
            <IconListDetails size={18} />
          </ActionIcon>
          <Text fw={700} size="sm">
            {field.label}
          </Text>
        </Group>
      ),
    },
    {
      key: 'type',
      title: 'نوع الحقل',
      render: (field) => getFieldTypeBadge(field.type),
    },
    {
      key: 'isRequired',
      title: 'إلزامية الحقل',
      render: (field) => (
        <Badge
          color={field.isRequired ? 'red' : 'gray'}
          variant={field.isRequired ? 'filled' : 'light'}
          radius="xl"
          size="sm"
        >
          {field.isRequired ? 'إجباري' : 'اختياري'}
        </Badge>
      ),
    },
    {
      key: 'displayInReport',
      title: 'الظهور في البطاقة والتقارير',
      render: (field) => (
        <Badge
          color={field.displayInReport ? 'teal' : 'gray'}
          variant="light"
          radius="xl"
          size="sm"
        >
          {field.displayInReport ? 'يظهر بالتقرير' : 'داخلي فقط'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'center',
      render: (field) => (
        <Tooltip label="تعديل الحقل" withArrow position="top">
          <ActionIcon
            variant="subtle"
            color="primary"
            radius="xl"
            size="sm"
            onClick={() => onEdit(field)}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Tooltip>
      ),
    },
  ];
}
