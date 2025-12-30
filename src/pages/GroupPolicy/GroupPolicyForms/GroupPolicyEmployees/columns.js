import React from 'react';
import { Tooltip } from 'antd';
import DeleteIcon from '../../../../../public/delete.svg';
import { NAME_SPACE } from '../../constants';

export const getColumns = (dispatch) => [
  {
    title: 'Badge No',
    render: (_, object) => object['Employee No'],
    key: '2',
  },
  {
    title: 'Name',
    render: (_, object) => object.Name,
    key: '3',
  },
  {
    title: '',
    align: 'center',
    key: '4',
    render: (_, object, index) => (
      <Tooltip placement="top" title="Remove from policy">
        <img
          src={DeleteIcon}
          alt="logo"
          onClick={() =>
            dispatch({
              type: `${NAME_SPACE}/deleteEmployeesData`,
              payload: index,
            })
          }
          style={{ marginRight: 10, cursor: 'pointer' }}
        />
      </Tooltip>
    ),
  },
];
