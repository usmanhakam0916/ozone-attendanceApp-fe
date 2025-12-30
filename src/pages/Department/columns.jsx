import { getNumberSorter, getStringSorter } from '@/utils/sorters';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Switch } from 'antd';
import { NAME_SPACE } from './constants';

export const getColumns = ({ userRole, dispatch, currentPageSize, currentSkip }) => {
  const columns = [
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

  if (userRole === 'admin') {
    columns.push({
      title: 'Status',
      dataIndex: 'isActive',
      width: '15%',
      key: '3',
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => {
            dispatch({
              type: `${NAME_SPACE}/updateDepartmentStatus`,
              payload: {
                id: record.id,
                isActive: checked,
                take: currentPageSize,
                skip: currentSkip,
              },
            });
          }}
        />
      ),
    });

    columns.push({
      title: 'Action',
      width: '10%',
      key: '4',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this department?"
            onConfirm={() => {
              dispatch({
                type: `${NAME_SPACE}/deleteDepartment`,
                payload: {
                  id: record.id,
                  take: currentPageSize,
                  skip: currentSkip,
                },
              });
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    });
  }

  return columns;
};
