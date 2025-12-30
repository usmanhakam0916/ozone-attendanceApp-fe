import { getDateFormatterWithoutKey, getStringSorterWithoutKey } from '@/utils/sorters';
import { formatDate } from '@/utils/utils';
import { EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { UpdateRequestStatus } from './constants';

// Helper to check if status is a request type
const isRequestedStatus = (status) => {
  return status === UpdateRequestStatus.CHECKIN_REQUESTED || 
         status === UpdateRequestStatus.CHECKOUT_REQUESTED;
};

export const getColumns = (hasRequestedItems, onViewRequest, isAdmin = false) => {
  const baseColumns = [
    {
      title: 'Name',
      render: (_, object) =>
        `${
          object?.employee?.authUser?.initialData
            ? object?.employee?.authUser?.initialData.FirstName
            : 'N/A'
        } ${
          object?.employee?.authUser?.initialData
            ? object?.employee?.authUser?.initialData.LastName
            : ''
        }`,
      sorter: (a, b) => getStringSorterWithoutKey(a, b),
      key: '1',
    },
     {
      title: 'Email',
      render: (_, object) =>
        `${
          object?.employee?.authUser?.email
            ? object?.employee?.authUser?.email
            : 'N/A'
        }`,
      sorter: (a, b) => getStringSorterWithoutKey(a, b),
      key: '2',
      width: '8%',
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

  // Only add Request Area column if user is admin and there are items with CHECKIN_REQUESTED or CHECKOUT_REQUESTED status
  if (isAdmin && hasRequestedItems) {
    baseColumns.push({
      title: 'Request Area',
      key: '8',
      width: '12%',
      render: (_, object) => {
        if (isRequestedStatus(object.updateRequestStatus)) {
          return (
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewRequest(object)}
            >
              View Request
            </Button>
          );
        }
        return null;
      },
    });
  }

  return baseColumns;
};
