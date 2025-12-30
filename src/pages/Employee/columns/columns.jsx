/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable vars-on-top */
// import { history } from 'umi';

import React from 'react';
import { DatePicker, TimePicker, Tooltip } from 'antd';
// import logo from '../../../public/Vector.png';
// import { EditOutlined } from '@ant-design/icons';

// import {
//   getNumberSorter,
//    getStringSorter
// } from '@/utils/sorters';
// import { NAME_SPACE } from './constants';
// import { formatDate } from '@/utils/utils';
import moment from 'moment';
import { NAME_SPACE } from '../constants';
import {
  compareCheckInTimes,
  compareCheckOutTimes,
  getDateWiseObjects,
} from '../../../utils/utils';
import { SyncOutlined } from '@ant-design/icons';
import defaultSettings from '@/../config/defaultSettings';

function getZeroTime(checkInTime) {
  const date = moment(checkInTime).format('MM-DD-YYYY');
  const zeroTime = moment(`${date} 00:00:00`).format('MM-DD-YYYY HH:mm');
  return zeroTime;
}

const changeTime = (prevDateTime, currentTime) =>
  `${prevDateTime.slice(0, 10)} ${moment(`${prevDateTime.slice(0, 10)} ${currentTime}`).format(
    'HH:mm:00',
  )}`;

const changeTimeToMoment = (dateTime) =>
  `${moment.utc(`${dateTime}`).format('YYYY-MM-DD HH:mm:00')}`;

function disabledDate(current, s) {
  // Can not select days before today and after tomorrow
  return (current && current < s) || (current && current > s.add(2, 'days'));
}

const dispatchTimeModal = (dispatch, body) => {
  dispatch({
    type: `${NAME_SPACE}/setTimeModal`,
    payload: {
      visible: true,
      body,
    },
  });
};

export const getColumns = ({ dispatch, id, employeeData, userRole, syncLoading }) => [
  {
    title: 'Location',
    width: '12%',
    render: (_, Object) =>
      `${Object?.record?.[0]?.location ? Object?.record?.[0]?.location.name : 'N/A'}`,
    key: '1',
  },
  {
    title: 'Date',
    width: '10%',
    key: '2',
    render: (_, object) => {
      const s1 = getDateWiseObjects(object?.record)?.[0];
      return `${s1 ? moment(s1?.checkInTime).format('MM-DD-YYYY') : 'N/A'}`;
    },
  },
  {
    title: 'S1 Check-in Time',
    width: '12%',
    dataIndex: 'checkInTime',
    align: 'center',
    key: '3',
    render: (text, object) => {
      const [s1, s2] = getDateWiseObjects(object?.record);
      return <p>{moment.utc(s1?.checkInTime).format('HH:mm')}</p>;
      // return userRole === 'admin' ?
      //   (
      //   <TimePicker
      //     showTime
      //     format="HH:mm"
      //     onChange={(time, timeString) => {
      //       if (
      //         s2?.checkInTime &&
      //         compareCheckInTimes(changeTime(s1?.checkInTime, timeString), s2?.checkInTime)
      //       ) {
      //         dispatchTimeModal(
      //           dispatch,
      //           'S1 check-in time cannot greater or equal to S2 check-in time.',
      //         );
      //       } else {
      //         dispatch({
      //           type: `${NAME_SPACE}/updateEmployeeAttendance`,
      //           payload: {
      //             id: s1.id,
      //             employeeId: id,
      //             data: {
      //               checkInTime: changeTime(s1?.checkInTime, timeString),
      //               checkInDeviceId: s1?.checkinDeviceId,
      //               checkInType: s1?.checkInType,
      //             },
      //           },
      //         });
      //       }
      //     }}
      //     value={moment.utc(moment.utc(s1?.checkInTime).format('HH:mm'), 'HH:mm')}
      //   />
      // ) : (
      //   <p>{moment.utc(s1?.checkInTime).format('HH:mm')}</p>
      // );
    },
  },
  {
    title: 'S1 Checkout Time',
    width: '12%',
    align: 'center',
    key: '4',
    render: (_, object) => {
      const s1 = getDateWiseObjects(object?.record)?.[0];
      return s1?.checkoutTime ? (
        <p>{moment.utc(s1?.checkoutTime).format('HH:mm')}</p>
      ) : (
        // userRole === 'admin' ? (
        //   <TimePicker
        //     showTime
        //     format="HH:mm"
        //     onChange={(time, timeString) => {
        //       if (compareCheckOutTimes(s1?.checkInTime, changeTime(s1?.checkoutTime, timeString))) {
        //         dispatchTimeModal(dispatch, 'Checkout time cannot less than from check-in time.');
        //       } else {
        //         dispatch({
        //           type: `${NAME_SPACE}/updateEmployeeAttendance`,
        //           payload: {
        //             id: s1.id,
        //             employeeId: id,
        //             data: {
        //               checkOutTime: changeTime(s1?.checkoutTime, timeString),
        //               checkOutDeviceId: s1?.checkoutDeviceId,
        //               checkOutType: s1?.checkOutType,
        //             },
        //           },
        //         });
        //       }
        //     }}
        //     value={moment.utc(moment.utc(s1?.checkoutTime).format('HH:mm'), 'HH:mm')}
        //   />
        // ) : (
        //   <p>{moment.utc(s1?.checkoutTime).format('HH:mm')}</p>
        // )
        '-'
      );
      //   userRole === 'admin' ? (
      //   <DatePicker
      //     disabledDate={(current) => disabledDate(current, moment(s1?.checkInTime, 'YYYY-MM-DD'))}
      //     showTime
      //     format="MM-DD-YYYY HH:mm"
      //     onOk={(time) => {
      //       if (compareCheckOutTimes(s1?.checkInTime, changeTimeToMoment(time))) {
      //         dispatchTimeModal(dispatch, 'Checkout time cannot less than from check-in time.');
      //       } else {
      //         dispatch({
      //           type: `${NAME_SPACE}/updateEmployeeAttendance`,
      //           payload: {
      //             id: s1.id,
      //             employeeId: id,
      //             data: {
      //               checkOutTime: changeTimeToMoment(time),
      //               checkOutDeviceId: 'admin',
      //               checkOutType: 'admin',
      //             },
      //           },
      //         });
      //       }
      //     }}
      //     value={moment.utc(
      //       moment
      //         .utc(s1?.checkoutTime ? s1?.checkoutTime : getZeroTime(s1?.checkInTime))
      //         .format('MM-DD-YYYY HH:mm'),
      //       'MM-DD-YYYY HH:mm',
      //     )}
      //   />
      // ) : (
      //   '-'
      // );
    },
  },
  {
    title: 'S2 Check-in Time',
    width: '12%',
    dataIndex: 'checkInTime',
    align: 'center',
    key: '5',
    render: (text, object) => {
      const [s1, s2] = getDateWiseObjects(object?.record);
      return s2 ? (
        <p>{moment.utc(s2?.checkInTime).format('HH:mm')}</p>
      ) : (
        // userRole === 'admin' ? (
        //   <TimePicker
        //     showTime
        //     format="HH:mm"
        //     onChange={(time, timeString) => {
        //       if (compareCheckInTimes(s1?.checkInTime, changeTime(s2?.checkInTime, timeString))) {
        //         dispatchTimeModal(
        //           dispatch,
        //           'S2 check-in time cannot be less than or equal to S1 check-in time.',
        //         );
        //       } else {
        //         dispatch({
        //           type: `${NAME_SPACE}/updateEmployeeAttendance`,
        //           payload: {
        //             id: s2.id,
        //             employeeId: id,
        //             data: {
        //               checkInTime: changeTime(s2?.checkInTime, timeString),
        //               checkInDeviceId: s2?.checkinDeviceId,
        //               checkInType: s2?.checkInType,
        //             },
        //           },
        //         });
        //       }
        //     }}
        //     value={moment.utc(moment.utc(s2?.checkInTime).format('HH:mm'), 'HH:mm')}
        //   />
        // ) : (
        //   <p>{moment.utc(s2?.checkInTime).format('HH:mm')}</p>
        // )
        '-'
      );
    },
  },
  {
    title: 'S2 Checkout Time',
    width: '12%',
    align: 'center',
    key: '6',
    render: (_, object) => {
      const s2 = getDateWiseObjects(object?.record)?.[1];
      return s2 && s2.checkoutTime ? (
        <p>{moment.utc(s2?.checkoutTime).format('HH:mm')}</p>
      ) : (
        // userRole === 'admin' ? (
        //   <TimePicker
        //     showTime
        //     format="HH:mm"
        //     onChange={(time, timeString) => {
        //       if (compareCheckOutTimes(s2?.checkInTime, changeTime(s2?.checkoutTime, timeString))) {
        //         dispatchTimeModal(dispatch, 'Checkout time cannot less than from check-in time.');
        //       } else {
        //         dispatch({
        //           type: `${NAME_SPACE}/updateEmployeeAttendance`,
        //           payload: {
        //             id: s2.id,
        //             employeeId: id,
        //             data: {
        //               checkOutTime: changeTime(s2?.checkoutTime, timeString),
        //               checkOutDeviceId: s2?.checkoutDeviceId,
        //               checkOutType: s2?.checkOutType,
        //             },
        //           },
        //         });
        //       }
        //     }}
        //     value={moment.utc(moment.utc(s2?.checkoutTime).format('HH:mm'), 'HH:mm')}
        //   />
        // ) : (
        //   <p>{moment.utc(s2?.checkoutTime).format('HH:mm')}</p>
        // )
        '-'
      );
      // s2 && s2?.checkInTime ? (
      // userRole === 'admin' ? (
      //   <DatePicker
      //     disabledDate={(current) =>
      //       disabledDate(moment(current), moment(s2?.checkInTime, 'YYYY-MM-DD'))
      //     }
      //     showTime
      //     format="MM-DD-YYYY HH:mm"
      //     onOk={(time) => {
      //       if (compareCheckOutTimes(s2?.checkInTime, changeTimeToMoment(time))) {
      //         dispatchTimeModal(dispatch, 'Checkout time cannot less than from check-in time.');
      //       } else {
      //         dispatch({
      //           type: `${NAME_SPACE}/updateEmployeeAttendance`,
      //           payload: {
      //             id: s2.id,
      //             employeeId: id,
      //             data: {
      //               checkOutTime: changeTimeToMoment(time),
      //               checkOutDeviceId: 'admin',
      //               checkOutType: 'admin',
      //             },
      //           },
      //         });
      //       }
      //     }}
      //     value={moment.utc(
      //       moment
      //         .utc(s2?.checkoutTime ? s2?.checkoutTime : getZeroTime(s2?.checkInTime))
      //         .format('MM-DD-YYYY HH:mm'),
      //       'MM-DD-YYYY HH:mm',
      //     )}
      //   />
      // ) : (
      //   '-'
      //   // )
      // ) : (
      //   '-'
      // );
    },
  },
  // {
  //   title: 'Total Working hours',
  //   width: '12%',
  //   render: (_, Object) =>
  //     `${
  //       employeeData?.almanaUser?.data.data
  //         ? employeeData?.almanaUser?.data.data.contractHours
  //         : 'N/A'
  //     }`,
  //   key: '6',
  // },
  // {
  //   title: 'Working hours Served',
  //   width: '12%',
  //   render: (_, object) => {
  //     let hours = '';
  //     if (object) {
  //       const startTime = moment(
  //         moment.utc(moment.utc(object.checkInTime).format('HH:mm:ss'), 'HH:mm:ss'),
  //         'HH:mm:ss a',
  //       );
  //       const endTime = moment(
  //         moment.utc(moment.utc(object.checkoutTime).format('HH:mm:ss'), 'HH:mm:ss'),
  //         'HH:mm:ss a',
  //       );
  //       const duration = moment.duration(endTime.diff(startTime));
  //       hours = parseInt(duration.asHours());
  //     }
  //     return `${hours} hrs`;
  //   },
  //   key: '7',
  // },
  // {
  //   title: 'Status',
  //   key: '6',
  //   width: '20%',
  //   align: 'center',
  //   render: (_, object) => {
  //     return (
  //       <div>
  //         {!object.authUser.active ? (
  //           <Button
  //             style={{ width: 80 }}
  //             type="primary"
  //             ghost
  //             size="small"
  //             onClick={() => {
  //               if (!object.authUser.active) {
  //                 dispatch({
  //                   type: `${NAME_SPACE}/showModal`,
  //                   payload: {
  //                     visible: true,
  //                     title: 'Set password for',
  //                     id: object.id,
  //                   },
  //                 });
  //               }
  //             }}
  //           >
  //             Approve
  //           </Button>
  //         ) : (
  //           <Tag style={{ width: 80, marginLeft: 6 }} color="green">
  //             {' '}
  //             Active{' '}
  //           </Tag>
  //         )}
  //       </div>
  //     );
  //   },
  // },
  userRole === 'admin'
    ? {
        title: 'Sync',
        key: '11',
        width: '20%',
        align: 'center',
        render: (_, object) => {
          const s2 = getDateWiseObjects(object?.record)?.[1];
          return s2 ? (
            <Tooltip title="Sync S2">
              <SyncOutlined
                style={{ cursor: 'pointer', color: defaultSettings.primaryColor }}
                spin={syncLoading}
                onClick={() => {
                  dispatch({
                    type: `${NAME_SPACE}/syncToEService`,
                    payload: {
                      data: {
                        employeeNo: employeeData?.user?.authUser?.username,
                        date: s2?.checkInTime,
                        S2TimeInLocation: s2?.location?.name,
                        S2TimeOutLocation: s2?.location?.name,
                        TimeIn: s2?.checkInTime,
                        TimeOut: s2?.checkoutTime,
                        attendanceId: s2?.id,
                      },
                    },
                  });
                }}
              />
            </Tooltip>
          ) : (
            '-'
          );
        },
      }
    : { key: '11', width: 0.1 },
];
