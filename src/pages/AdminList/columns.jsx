import React from 'react';
import { Popconfirm, message } from 'antd';

import { getUserData } from '@/utils/localStorage';
import { getStringSorter } from '@/utils/sorters';
import { NAME_SPACE } from './constants';
import DeleteIcon from '../../../public/delete.svg';
import edit from '../../../public/edit.svg';

export const getColumns = ({ dispatch, currentUser, userId = getUserData()?.id }) => [
  {
    title: 'Name',
    render: (_, Object) => `${Object.authUser.username}`,
    sorter: getStringSorter('name'),
    key: '1',
  },
  {
    title: 'Role',
    render: (_, Object) => `${Object.authUser.type}`,
    key: '2',
  },
  {
    title: 'Action',
    align: 'center',
    width: '20%',
    key: '3',
    render: (_, object, index) => (
      <div>
        <img
          src={edit}
          alt="edit"
          onClick={() => {
            dispatch({
              type: `${NAME_SPACE}/setModalVisible`,
              payload: {
                visible: true,
                id: object.id,
                index,
              },
            });
          }}
          style={{ marginRight: 10, cursor: 'pointer' }}
        />
        <div
          style={
            object?.authUser.id === userId
              ? { cursor: 'not-allowed', display: 'inline-block' }
              : { display: 'inline-block' }
          }
        >
          <Popconfirm
            placement="top"
            title="Are you sure to delete?"
            onConfirm={() => {
              if (currentUser.id !== object.id) {
                dispatch({
                  type: `${NAME_SPACE}/deleteAdmin`,
                  payload: {
                    id: object.id,
                    index,
                  },
                });
              } else {
                message.error('You cannot delete yourself.....!');
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <img
              style={
                object?.authUser.id === userId ? { pointerEvents: 'none' } : { cursor: 'pointer' }
              }
              src={DeleteIcon}
              alt="logo"
            />
          </Popconfirm>
        </div>
      </div>
    ),
  },
];
