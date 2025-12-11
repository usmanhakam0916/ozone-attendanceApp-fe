import React from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { NAME_SPACE } from '../constants';
import { getDateWiseObjects } from '../../../utils/utils';

const AttendanceDetail = ({ attendances }) => {
  const record = getDateWiseObjects(attendances?.record);
  const data = [{ s1: record[0], s2: record[1] }];
  const columns = [
    {
      title: 'S1 Check-in Device Id',
      key: '1',
      render: (_, object) => {
        return `${object?.s1?.checkinDeviceId || '-'}`;
      },
    },

    {
      title: 'S1 Check-in Type',
      key: '2',
      render: (_, object) => {
        return `${object?.s1?.checkInType || '-'}`;
      },
    },
    {
      title: 'S1 Check-out Device Id',
      key: '3',
      render: (_, object) => {
        return `${object?.s1?.checkoutDeviceId || '-'}`;
      },
    },
    {
      title: 'S1 Check-out Type',
      key: '4',
      render: (_, object) => {
        return `${object?.s1?.checkOutType || '-'}`;
      },
    },
    {
      title: 'S2 Check-in Device Id',
      key: '5',
      render: (_, object) => {
        return `${object?.s2?.checkinDeviceId || '-'}`;
      },
    },

    {
      title: 'S2 Check-in Type',
      key: '6',
      render: (_, object) => {
        return `${object?.s2?.checkInType || '-'}`;
      },
    },
    {
      title: 'S2 Check-out Device Id',
      key: '7',
      render: (_, object) => {
        return `${object?.s2?.checkoutDeviceId || '-'}`;
      },
    },
    {
      title: 'S2 Check-out Type',
      key: '8',
      render: (_, object) => {
        return `${object?.s2?.checkOutType || '-'}`;
      },
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};

export default connect(({ [NAME_SPACE]: { employeeAttendances } }) => ({
  data: employeeAttendances,
}))(AttendanceDetail);
