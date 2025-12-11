import { getNumberSorter, getStringSorter } from '@/utils/sorters';

export const getColumns = ({ userRole }) => [
  userRole === 'admin'
    ? {
        title: 'Department Id',
        dataIndex: 'id',
        width: '8%',
        sorter: getNumberSorter('id'),
        key: '1',
      }
    : { title: '', width: '1%', key: '1' },
  {
    title: 'Name',
    width: '25%',
    render: (_, object) => object?.name?.toUpperCase(),
    sorter: getStringSorter('name'),
    key: userRole === 'admin' ? '2' : '1',
  },
];
