import { AndroidOutlined, AppleOutlined, CalendarOutlined, DeleteOutlined, EditOutlined, LockOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { history } from 'umi';

import { IMAGE_BASE_URL } from '@/utils/constants';
import { getNumberSorter, getStringSorterWithoutKey } from '@/utils/sorters';
import avatar from '../../../public/avatar.png';
import { NAME_SPACE } from './constants';

export const getColumns = ({ dispatch, userRole }) =>
  [
    // {
    //   title: 'User ID',
    //   width: '10%',
    //   render: (_, object) => {
    //     const imageUrl = object?.avatar?.id ? `${IMAGE_BASE_URL}${object?.avatar?.key}` : avatar;
    //     let title = imageUrl?.split('/');
    //     title = title[title.length - 1];
    //     return (
    //       <div
    //         style={{ display: 'flex', alignItems: 'center', cursor: userRole === 'admin' ? 'pointer' : 'default' }}
    //         onClick={() => {
    //           if (userRole === 'admin') {
    //             dispatch({
    //               type: `${NAME_SPACE}/setImageModal`,
    //               payload: {
    //                 visible: true,
    //                 title,
    //                 imageUrl,
    //               },
    //             });
    //           }
    //         }}
    //       >
    //         {userRole === 'admin' && (
    //           <img 
    //             src={imageUrl} 
    //             alt="" 
    //             style={{ 
    //               width: 32, 
    //               height: 32, 
    //               borderRadius: '50%', 
    //               marginRight: 10, 
    //               objectFit: 'cover' 
    //             }} 
    //           />
    //         )}
    //         <span>{object?.authUser?.username}</span>
    //       </div>
    //     );
    //   },
    //   sorter: (a, b) => getStringSorterWithoutKey(a, b),
    //   key: '1',
    // },
    {
      title: 'Name',
      width: '12%',
      render: (_, Object) => `${Object?.employee ? Object?.employee?.FirstName : 'N/A'} ${Object?.employee ? Object?.employee?.LastName : ''}`,
      sorter: (a) => getStringSorterWithoutKey(a),
      key: '2',
    },
    {
      title: 'Department',
      width: '12%',
      render: (_, object) =>
        `${object?.employee?.Department ? object?.employee?.Department : 'N/A'}`,
      sorter: (a) => getStringSorterWithoutKey(a),
      key: '3',
    },
    {
      title: 'Position',
      width: '10%',
      render: (_, object) => `${object?.employee?.Position ? object?.employee?.Position : 'N/A'}`,
      sorter: (a) => getStringSorterWithoutKey(a),
      key: '4',
    },
    {
      title: 'Attendance Radius',
      width: '10%',
      dataIndex: 'attendanceRadius',
      sorter: getNumberSorter('attendanceRadius'),
      key: '5',
    },
    {
      title: 'Attendance Type',
      width: '10%',
      dataIndex: 'attendanceType',
      key: '6',
      render: (text) => (
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 500,
          backgroundColor: '#f0f0f0',
          color: '#333',
        }}>
          {text || 'Single'}
        </span>
      ),
    },
    {
      title: 'Group',
      width: '8%',
      dataIndex: 'group',
      key: '7',
      render: (_, object) => `${object?.group ? object?.group.name : 'N/A'}`,
    },
    {
      title: 'Status',
      width: '8%',
      key: '8',
      render: (_, object) => {
        const status = object?.authUser?.status;
        const isActive = status === 'active';
        return (
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 500,
            backgroundColor: isActive ? 'rgba(82, 196, 26, 0.1)' : 'rgba(255, 77, 79, 0.1)',
            color: isActive ? '#52c41a' : '#ff4d4f',
          }}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A'}
          </span>
        );
      },
    },
    {
      title: 'Device Type',
      width: '8%',
      key: '9',
      render: (_, object) =>
        object?.authUser?.deviceType === 'android' ? (
          <AndroidOutlined style={{ color: '#692C96', fontSize: 18 }} />
        ) : (
          <AppleOutlined style={{ color: '#692C96', fontSize: 18 }} />
        ),
    },
    {
      title: 'Action',
      align: 'center',
      width: '6%',
      key: '10',
      render: (_, object) => {
        const menuItems = [
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Employee',
            onClick: () => {
              history.push({
                pathname: `/employee/${object?.id}`,
                query: {
                  tab: '1',
                },
              });
            },
          },
          {
            key: 'password',
            icon: <LockOutlined />,
            label: 'Edit Password',
            onClick: () => {
              dispatch({
                type: `${NAME_SPACE}/showModal`,
                payload: {
                  visible: true,
                  title: 'Change password for',
                  id: object?.id,
                },
              });
            },
          },
        ];

        if (userRole === 'admin' || userRole === 'supervisor') {
          menuItems.push({
            key: 'attendance',
            icon: <CalendarOutlined />,
            label: 'Attendance Details',
            onClick: () => {
              history.push({
                pathname: `/employee/${object?.id}`,
                query: {
                  tab: '2',
                },
              });
            },
          });
        }

        if (object?.authUser?.deviceId) {
          menuItems.push({
            key: 'removeDevice',
            icon: <DeleteOutlined />,
            label: 'Remove Device',
            onClick: () => {
              dispatch({
                type: `${NAME_SPACE}/removeDevices`,
                payload: {
                  id: object?.authUser?.id,
                },
              });
            },
          });
        }

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
    },
  ].filter((item) =>
    userRole === 'manager' || userRole === 'hr-manager' ? item.key !== '5' : item,
  );
