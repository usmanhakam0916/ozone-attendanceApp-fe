import { getUserData } from '@/utils/localStorage';
import { getStringSorterWithoutKey } from '@/utils/sorters';
import { DeleteOutlined, EditOutlined, MoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { history } from 'umi';
import { NAME_SPACE } from './constants';

export const getColumns = (dispatch, userRole, userId = getUserData()?.id) => [
  {
    title: 'No',
    width: '8%',
    render: (_, object, index) => index + 1,
    key: '1',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: '15%',
    sorter: (a) => getStringSorterWithoutKey(a),
    key: '2',
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    width: '15%',
    sorter: (a) => getStringSorterWithoutKey(a),
    key: '3',
  },
  {
    title: 'Employee Count',
    width: '12%',
    render: (_, object) => object.employees.length,
    sorter: (a) => getStringSorterWithoutKey(a),
    key: '4',
  },
  {
    title: 'Check-in Time',
    dataIndex: 'checkinTime',
    width: '18%',
    sorter: (a) => getStringSorterWithoutKey(a),
    key: '5',
  },
  {
    title: 'Checkout Time',
    dataIndex: 'checkoutTime',
    width: '15%',
    sorter: (a) => getStringSorterWithoutKey(a),
    key: '6',
  },
  userRole === 'admin' || userRole === 'supervisor'
    ? {
        title: 'Action',
        align: 'center',
        width: '8%',
        key: '7',
        render: (_, object) => {
          const canEdit = object?.owner?.id === userId || userRole === 'admin';

          const menuItems = [];

          if (canEdit) {
            menuItems.push({
              key: 'edit',
              icon: <EditOutlined />,
              label: 'Edit Group Policy',
              onClick: () => {
                dispatch({
                  type: `${NAME_SPACE}/showModal`,
                  payload: { visibility: true, record: object },
                });
              },
            });

            menuItems.push({
              key: 'updateEmployees',
              icon: <SettingOutlined />,
              label: 'Update Employees',
              onClick: () => {
                history.push({
                  pathname: `/groupPolicy/${object.id}`,
                });
              },
            });
          }

          if (userRole === 'admin') {
            menuItems.push({
              key: 'delete',
              icon: <DeleteOutlined />,
              label: 'Delete Group Policy',
              onClick: () => {
                dispatch({
                  type: `${NAME_SPACE}/deleteGroupPolicy`,
                  payload: {
                    id: object.id,
                  },
                });
              },
            });
          }

          if (menuItems.length === 0) return null;

          const menu = (
            <Menu>
              {menuItems.map((item) => (
                <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          );

          return (
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <MoreOutlined style={{ fontSize: 18, cursor: 'pointer', color: '#666' }} />
            </Dropdown>
          );
        },
      }
    : {},
];
