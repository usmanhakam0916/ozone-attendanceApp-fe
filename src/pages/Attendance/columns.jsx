import { getDateFormatterWithoutKey, getStringSorterWithoutKey } from '@/utils/sorters';
import { formatDate } from '@/utils/utils';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';

export const getColumns = (hasRequestedItems, onAccept, onReject, loadingId) => {
  const baseColumns = [
    {
      title: 'Employee No',
      render: (_, object) =>
        `${
          object?.employee?.authUser?.initialData
            ? object?.employee?.authUser?.initialData['Employee No']
            : 'N/A'
        }`,
      sorter: (a, b) => getStringSorterWithoutKey(a, b),
      key: '2',
      width: '8%',
    },
    {
      title: 'Name',
      render: (_, object) =>
        `${
          object?.employee?.authUser?.initialData
            ? object?.employee?.authUser?.initialData.Name
            : 'N/A'
        }`,
      sorter: (a, b) => getStringSorterWithoutKey(a, b),
      key: '1',
    },
    {
      title: 'Department',
      render: (_, object) =>
        `${
          object.employee?.authUser?.initialData?.Department
            ? object.employee?.authUser?.initialData?.Department
            : 'N/A'
        }`,
      sorter: (a) => getStringSorterWithoutKey(a),
      key: '3',
    },
    {
      title: 'Check-in Time',
      render: (_, object) => `${object.checkInTime ? formatDate(object.checkInTime) : 'N/A'}`,
      key: '4',
      sorter: (a) => getDateFormatterWithoutKey(a.checkInTime),
    },
    {
      title: 'Checkout Time',
      render: (_, object) => `${object.checkoutTime ? formatDate(object.checkoutTime) : 'N/A'}`,
      key: '5',
      sorter: (a) => getDateFormatterWithoutKey(a.checkoutTime),
    },
    {
      title: 'Check-in Location',
      render: (_, object) => `${object?.location ? object.location.name : 'N/A'}`,
      sorter: (a, b) => getStringSorterWithoutKey(a, b),
      key: '6',
    },
    {
      title: 'Checkout Location',
      render: (_, object) => `${object?.checkoutLocation ? object.checkoutLocation.name : 'N/A'}`,
      sorter: (a, b) => getStringSorterWithoutKey(a, b),
      key: '7',
    },
  ];

  // Only add Request Area column if there are items with REQUESTED status
  if (hasRequestedItems) {
    baseColumns.push({
      title: 'Request Area',
      key: '8',
      width: '15%',
      render: (_, object) => {
        if (object.updateRequestStatus === 'REQUESTED') {
          const isLoading = loadingId === object.id;
          return (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                loading={isLoading}
                onClick={() => onAccept(object.id)}
              >
                Accept
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                loading={isLoading}
                onClick={() => onReject(object.id)}
              >
                Reject
              </Button>
            </Space>
          );
        }
        return null;
      },
    });
  }

  return baseColumns;
};
