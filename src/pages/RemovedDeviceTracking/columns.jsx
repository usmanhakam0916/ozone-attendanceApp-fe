import { formatDate } from '@/utils/utils';

export const getColumns = () => [
  {
    title: 'Employee No',
    render: (_, object) =>
      `${
        object?.__user__?.initialData
          ? JSON.parse(object?.__user__?.initialData)?.['Employee No']
          : 'N/A'
      }`,
    key: '2',
    width: '8%',
  },
  {
    title: 'Name',
    render: (_, object) =>
      `${object?.__user__?.initialData ? JSON.parse(object?.__user__?.initialData)?.Name : 'N/A'}`,
    key: '1',
  },
  {
    title: 'Old Device Id',
    dataIndex: 'deviceId',
    key: '2',
  },
  {
    title: 'Current Device Id',
    render: (_, object) => (object?.__user__?.deviceId ? object?.__user__?.deviceId : '-'),
    key: '2',
  },
  {
    title: 'Location',
    render: (_, object) =>
      `${
        object.__user__?.initialData
          ? JSON.parse(object?.__user__?.initialData)?.location_Name
          : 'N/A'
      }`,
    key: '3',
  },
  {
    title: 'Department',
    render: (_, object) =>
      `${
        object.__user__?.initialData ? JSON.parse(object?.__user__?.initialData)?.Department : 'N/A'
      }`,
    key: '3',
  },
  {
    title: 'Amend By',
    render: (_, object) =>
      `${object?.__amendBy__?.username ? object?.__amendBy__?.username?.toUpperCase() : 'N/A'}`,
    key: '1',
  },
  {
    title: 'Date & Time',
    render: (_, object) => `${object.createdAt ? formatDate(object.createdAt) : 'N/A'}`,
    key: '3',
  },
];
