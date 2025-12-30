/* eslint-disable no-param-reassign */
import request from '@/utils/request';
import { message } from 'antd';
import moment from 'moment';

import { NAME_SPACE } from '../constants';

const initialState = {
  employeeAttendances: [],
  attendances: [],
  data: [],
  total: 0,
  bankModalVisible: false,
  employeeData: {},
  editModal: false,
  isShowModal: false,
  isShowCheckInOutModal: false,
  timeModal: { visible: false, body: '' },
  title: '',
  employeeId: '',
  filters: {
    date: '',
    dateType: '',
    departmentId: '',
  },
  macAddress: { isMac: false, address: '', macAddress: '' },
  groupPolicies: [],
  imageModal: { visible: false, title: '', imageUrl: '' },
  faceModal: { visible: false, title: 'Register Employee Face', imageUrl: '', employeeId: '' },
  departments: [],
};

const employeeListing = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchDepartments(_, { put }) {
      const response = yield request.get(`departments`);
      if (response?.length) {
        yield put({ type: 'fetchDepartmentsSuccess', payload: response });
      }
    },
    *createEmployee({ payload: { data } }, { put }) {
      const response = yield request.post('employees', {
        data,
      });
      if (response.id) {
        message.success('Employee created successfully');
        // history.push({
        //   pathname: `/employee/${data.authUser.username}`,
        //   query: {
        //     tab: '2',
        //   },
        // });
      }
      else if (response?.message){
        message.error(response?.message)
      }
      yield put({
        type: 'showModal',
        payload: {
          visible: false,
        },
      });
      yield put({
        type: 'setMacAddress',
        payload: { isMac: false, address: '', macAddress: '' },
      });
    },
    *registerEmployeeFace({ payload: { data } }, { put }) {
      let formData = new FormData();
      formData.append('file', data.file);
      formData.append('employeeId', data.employeeId);
      const response = yield request.post(
        'files/upload',
        {
          data: formData,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response) {
        message.success('Employee face register successfully');
        yield put({
          type: 'setFaceModal',
          payload: {
            visible: false,
          },
        });
      }
    },
    *fetchEmployeeList({ payload: { take, skip, deviceType, departmentId } }, { put }) {
      const response = yield request.get(
        `employees/${take}/${skip}?deviceType=${deviceType}${
          departmentId ? `&departmentId=${departmentId}` : ''
        }`,
      );
     // debugger;
      const data = response.result.map((item) => {
        const newItem = { ...item, employee: JSON.parse(item.authUser.initialData) };
        return newItem;
      });
      yield put({ type: 'fetchEmployeeListSuccess', payload: data.reverse() });
      yield put({ type: 'setTotal', payload: response.total });
    },
    *fetchEmployeeAttendances({ payload: { id } }, { put }) {
      const response = yield request.get(`attendances/employees/${id}`);
      // response = response.sort((a, b) => b.id - a.id);
      let newResponse = {};
      response.forEach((item) => {
        const date = moment(item.checkInTime).format('MM-DD-YYYY');
        if (newResponse[date]) {
          newResponse[date].push(item);
        } else {
          newResponse[date] = [item];
        }
      });
      const sortedList = {};
      newResponse = Object.keys(newResponse)
        .sort((a, b) => new Date(b) - new Date(a))
        .forEach((key, index) => {
          sortedList[key] = { key: index, record: newResponse[key].sort((a, b) => b.id - a.id) };
        });

      yield put({
        type: 'setAttendances',
        payload: sortedList,
      });
      yield put({ type: 'fetchEmployeeAttendancesSuccess', payload: Object.values(sortedList) });
    },
    *syncToEService({ payload: { data } }) {
      const response = yield request.patch('attendances/sync/attendance/eService', { data });
      if (response?.message) {
        message.success(response.message);
      } else if (response?.error) {
        message.error(response.error);
      }
    },
    *getEmployee(
      {
        payload: {
          data: { id, deviceType, departmentId },
        },
      },
      { put },
    ) {
      try {
        const url = `employees/20/0?deviceType=${deviceType}${id ? `&name=${id}` : ''}${
          departmentId ? `&departmentId=${departmentId}` : ''
        }`;
        //debugger;
        const response = yield request.get(url);
        if (response.status !== 404) {
          const data = response.result.map((item) => {
            const newItem = { ...item, employee: JSON.parse(item.authUser.initialData) };
            return newItem;
          });
          yield put({ type: 'fetchEmployeeListSuccess', payload: data.reverse() });
          yield put({ type: 'setTotal', payload: response.total });

          if (id && response?.total) {
            message.success('Employee found successfully');
          }
        }
      } catch (e) {
        console.log(e, 'error');
      }
    },
    *createEmployeeAttendance({ payload: { data, employeeId } }, { put }) {
      const response = yield request.post('attendances/create_attendance', { data });
      if (response) {
        yield put({ type: 'setIsShowCheckInOutModal', payload: false });
        yield put({
          type: 'getEmployeeData',
          payload: {
            id: employeeId,
          },
        });
      }
    },
    *getEmployeeData({ payload: { id } }, { put }) {
      const response = yield request.get(`employees/${id}`);
      if (response) {
        yield put({
          type: 'setMacAddress',
          payload: {
            isMac: response.user.isMac,
            address: response.user.macAddress,
            macAddress: response.user.macAddress,
          },
        });
        yield put({
          type: `fetchEmployeeAttendances`,
          payload: {
            id: response.user.id,
          },
        });
        yield put({ type: 'fetchEmployeeDataSuccess', payload: response });
      }
    },
    *updateEmployeeAttendance({ payload: { data, id, employeeId } }, { put }) {
      const response = yield request.patch(`attendances/time/${id}`, {
        data,
      });
      if (response) {
        yield put({
          type: 'getEmployeeData',
          payload: {
            id: employeeId,
          },
        });
      }
    },
    *updateEmployee({ payload: { data, id, title } }, { put }) {
      const response = yield request.patch(`employees/${id}`, {
        data,
      });
      if (response) {
        message.success(
          `${
            title === 'Change password for'
              ? 'Employee password updated successfully'
              : 'Employee updated successfully'
          }`,
        );
        yield put({
          type: `showModal`,
          payload: {
            visible: false,
            title: '',
            employeeId: null,
          },
        });
      }
    },
    *approveEmployee({ payload: { data } }, { put }) {
      yield request.post(`employees/approve`, {
        data,
      });
      message.success('Employee approved successfully');
      yield put({
        type: 'showModal',
        payload: {
          visible: false,
        },
      });
      yield put({ type: 'fetchEmployeeList' });
    },
    *fetchGroupPolicies({}, { put }) {
      const response = yield request.get(`groupPolicies`);
      if (response) {
        yield put({ type: 'fetchGroupPoliciesSuccess', payload: response });
      }
    },
    *removeDevices({ payload: { id } }, { put }) {
      try {
        const response = yield request.delete(`employees/user/remove_device/${id}`);
        yield put({ type: `removeDevicesSuccess`, payload: response });
      } catch (error) {
        console.log(error);
      }
    },
    *removeFaceId({ payload: { employeeId } }, { put }) {
      try {
        const response = yield request.delete(`employees/user/remove_face_id/${employeeId}`);
        if (response?.id) {
          yield put({ type: `removeFaceIdSuccess`, payload: response });
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  reducers: {
    fetchDepartmentsSuccess(state, action) {
      state.departments = action.payload;
    },
    setTotal(state, action) {
      state.total = action.payload;
      // state.editModal = false;
    },
    fetchGroupPoliciesSuccess(state, action) {
      state.groupPolicies = action.payload;
    },
    fetchEmployeeListSuccess(state, action) {
      state.data = action.payload;
    },
    fetchEmployeeAttendancesSuccess(state, action) {
      state.employeeAttendances = action.payload;
    },
    fetchEmployeeDataSuccess(state, action) {
      state.employeeData = action.payload;
    },
    showModal(state, { payload: { visible, title, id } }) {
      state.isShowModal = visible;
      state.title = title;
      state.employeeId = id;
    },
    setIsShowCheckInOutModal(state, action) {
      state.isShowCheckInOutModal = action.payload;
    },
    setTimeModal(state, action) {
      state.timeModal = action.payload;
    },
    setAttendances(state, action) {
      state.attendances = action.payload;
    },
    setFilter(state, { payload: { filter, value } }) {
      state.filters[filter] = value;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setBankModalVisible(state, { payload: { visible, id } }) {
      state.bankModalVisible = visible;
      state.employeeId = id;
    },
    setEditModalVisible(state, { payload: { visible, id } }) {
      state.editModal = visible;
      state.employeeId = id;
    },
    setMacAddress(state, { payload }) {
      state.macAddress = payload;
    },
    removeDevicesSuccess(state, action) {
      const index = state.data.findIndex((item) => item.authUser?.id === action.payload.id);
      if (index !== -1) {
        state.data[index].authUser.deviceId = null;
        state.data[index].authUser.deviceType = null;
        message.success('Device removed successfully');
      }
    },
    removeFaceIdSuccess(state, action) {
      const index = state.data.findIndex((item) => item?.id === action.payload.id);
      if (index !== -1) {
        state.data[index].avatar = null;
        message.success('Face removed successfully');
      }
    },
    setImageModal(state, action) {
      state.imageModal.visible = action.payload.visible;
      state.imageModal.title = action.payload.title || '';
      state.imageModal.imageUrl = action.payload.imageUrl || '';
    },
    setFaceModal(state, action) {
      state.faceModal.visible = action.payload.visible;
      state.faceModal.employeeId = action.payload.employeeId ?? state.faceModal.employeeId;
      state.faceModal.imageUrl = action.payload.imageUrl || '';
      if (!action.payload.visible) state.faceModal.employeeId = '';
    },
    reset: () => initialState,
  },
};

export default employeeListing;
