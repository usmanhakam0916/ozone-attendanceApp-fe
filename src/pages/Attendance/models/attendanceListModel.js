/* eslint-disable no-param-reassign */
import request from '@/utils/request';
import { message } from 'antd';
import { BASE_URL } from '../../../utils/constants';
import { NAME_SPACE } from '../constants';

const initialState = {
  data: [],
  total: 0,
  isModalVisible: false,
  filters: {
    dateType: 'checkInTime',
    date: '',
    checkInLocation: '',
    checkoutLocation: '',
    name: '',
  },
  departments: [],
  updatingRequestId: null,
};

const adminListing = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchDepartments(_, { put }) {
      const response = yield request.get(`departments`);
      if (response?.length) {
        yield put({ type: 'fetchDepartmentsSuccess', payload: response });
      }
    },
    *fetchAttendanceList({ payload: { take, skip, badgeNo, departmentId } }, { put }) {
      const response = yield request.get(
        `attendances/with-data/${take}/${skip}?${badgeNo ? `&badgeNo=${badgeNo}` : ''}${
          departmentId ? `&departmentId=${departmentId}` : ''
        }`,
      );
      const data = response.result.map((item) => {
        const newItem = {
          ...item,
          employee: {
            ...item.employee,
            authUser: {
              ...item.employee.authUser,
              initialData: JSON.parse(item.employee.authUser.initialData),
            },
          },
        };
        return newItem;
      });

      yield put({ type: 'setTotal', payload: response.total });
      yield put({
        type: 'fetchAttendanceListSuccess',
        payload: data,
      });
    },
    *fetchEmployee(
      {
        payload: {
          data: { id },
        },
      },
      { put },
    ) {
      try {
        let response = yield request.get(`employees/get-by-batch-number/${id}/get/by/batch`);
        if (response && response.data) {
          response = response.data[0].user;
          if (response.attendances.length) {
            message.success('Attendance found successfully');
          } else {
            message.error('Not Found');
          }
          response = response.attendances.map((attendanceItem) => {
            return {
              ...attendanceItem,
              employee: {
                authUser: {
                  ...response.authUser,
                  initialData: JSON.parse(response.authUser.initialData),
                },
              },
              location: attendanceItem.location,
            };
          });

          yield put({ type: 'setTotal', payload: response.length });
          yield put({
            type: 'fetchAttendanceListSuccess',
            payload: response,
          });
        }
      } catch (e) {
        console.log(e, 'error');
      }
    },
    *downloadCSV({ payload: { badgeNo, departmentId } }) {
      const response = yield request.get(
        `attendances/generate_csv?${badgeNo ? `&badgeNo=${badgeNo}` : ''}${
          departmentId ? `&departmentId=${departmentId}` : ''
        }`,
      );
      if (response.includes('.csv')) {
        const windowRef = window.open(`${BASE_URL}${response}`, '_blank');
        if (!windowRef) {
          alert('A popup blocker was detected. Please turn it off to use this application.');
        }
      }
    },
    *updateRequestStatus(
      { payload: { attendanceId, status, take, skip, badgeNo, departmentId } },
      { put },
    ) {
      yield put({ type: 'setUpdatingRequestId', payload: attendanceId });
      try {
        const response = yield request.patch(`attendances/update/attendence/request/status`, {
          data: {
            attendanceId,
            status,
          },
        });
        if (response) {
          message.success(`Request ${status.toLowerCase()} successfully`);
          // Refresh the attendance list after updating
          yield put({
            type: 'fetchAttendanceList',
            payload: { take, skip, badgeNo, departmentId },
          });
        }
      } catch (error) {
        message.error('Failed to update request status');
      } finally {
        yield put({ type: 'setUpdatingRequestId', payload: null });
      }
    },
  },
  reducers: {
    fetchDepartmentsSuccess(state, action) {
      state.departments = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
    },
    fetchAttendanceListSuccess(state, action) {
      state.data = action.payload;
      state.isModalVisible = false;
      state.bankId = null;
    },
    setFilter(state, { payload }) {
      // Support both { filter, value } and { name: value } formats
      if (payload.filter !== undefined) {
        state.filters[payload.filter] = payload.value;
      } else {
        // Direct object merge for { name: value } format
        state.filters = { ...state.filters, ...payload };
      }
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setModalVisible(state, { payload: { visible } }) {
      state.isModalVisible = visible;
    },
    setUpdatingRequestId(state, { payload }) {
      state.updatingRequestId = payload;
    },
    reset: () => initialState,
  },
};

export default adminListing;
