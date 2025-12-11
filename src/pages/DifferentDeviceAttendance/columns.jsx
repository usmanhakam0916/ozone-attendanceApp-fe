import { formatDate } from '@/utils/utils';

export const getColumns = () => [
  {
    title: 'Employee No',
    render: (_, object) =>
      `${
        object?.employee?.authUser?.initialData
          ? JSON.parse(object?.employee?.authUser?.initialData)?.['Employee No']
          : 'N/A'
      }`,
    key: '2',
  },
  {
    title: 'Name',
    render: (_, object) =>
      `${
        object?.employee?.authUser?.initialData
          ? JSON.parse(object?.employee?.authUser?.initialData)?.Name
          : 'N/A'
      }`,
    key: '1',
  },
  {
    title: 'Department',
    render: (_, object) =>
      `${
        object.employee?.authUser?.initialData
          ? JSON.parse(object?.employee?.authUser?.initialData)?.Department
          : 'N/A'
      }`,
    key: '3',
  },
  { title: 'Check-In Device Id', key: '1', dataIndex: 'checkinDeviceId' },
  { title: 'Check-Out Device Id', key: '2', dataIndex: 'checkoutDeviceId' },
  {
    title: 'Check-In Device Id Owner',
    key: '3',
    render: (_, object) =>
      object?.checkInDeviceIdOwner ? object?.checkInDeviceIdOwner?.authUser?.username : '-',
  },
  {
    title: 'Check-Out Device Id Owner',
    key: '3',
    render: (_, object) =>
      object?.checkoutDeviceIdOwner ? object?.checkoutDeviceIdOwner?.authUser?.username : '-',
  },
  {
    title: 'Check-In Device Type',
    key: '3',
    dataIndex: 'checkInType',
  },
  {
    title: 'Check-In Device Type',
    key: '4',
    dataIndex: 'checkOutType',
  },
  {
    title: 'Check-in Time',
    render: (_, object) => `${object.checkInTime ? formatDate(object.checkInTime) : 'N/A'}`,
    key: '3',
  },
  {
    title: 'Checkout Time',
    render: (_, object) => `${object.checkoutTime ? formatDate(object.checkoutTime) : 'N/A'}`,
    key: '4',
  },
];
