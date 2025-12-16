import request from '@/utils/request';
import { message } from 'antd';

import { NAME_SPACE } from '../constants';

const initialState = {
  departments: [],
  totalDepartments: 0,
  bankModalVisible: false,
  isSearch: false,
  currentPageSize: 50,
  currentSkip: 0,
};

const departmentModal = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchDepartments({ payload: { take, skip } }, { put }) {
      const response = yield request.get(`departments/${take}/${skip}`);
      if (response?.totalDepartments) {
        yield put({ type: 'fetchDepartmentsSuccess', payload: response });
        yield put({ type: 'setPagination', payload: { take, skip } });
      }
    },
    *searchDepartments({ payload: { departmentName } }, { put }) {
      const response = yield request.get(`departments/search/${departmentName}`);
      if (response?.length) {
        yield put({
          type: 'fetchDepartmentsSuccess',
          payload: { departments: response, totalDepartments: response?.length },
        });
      } else {
        message.error('No record found');
        yield put({
          type: 'fetchDepartmentsSuccess',
          payload: { departments: [], totalDepartments: 0 },
        });
      }
    },
    *createDepartment({ payload: { data, take, skip } }, { put }) {
      const response = yield request.post('departments', { data });
      if (response?.id) {
        message.success('Department has been added successfully');
        yield put({ type: 'setBankModalVisible', payload: { visible: false } });
        yield put({ type: 'fetchDepartments', payload: { take, skip } });
      } else if (response?.message) {
        message.error(response?.message);
      }
    },
    *updateDepartmentStatus({ payload: { id, isActive, take, skip } }, { put }) {
      // isActive is the NEW desired state from the switch toggle
      const response = yield request.patch(`departments/${id}`, {
        data: { isActive },
      });
      if (response) {
        message.success(`Department status updated successfully`);
        yield put({ type: 'fetchDepartments', payload: { take, skip } });
      } else if (response?.message) {
        message.error(response?.message);
      }
    },
    *deleteDepartment({ payload: { id, take, skip } }, { put }) {
      const response = yield request.delete(`departments/${id}`);
      if (response) {
        message.success('Department deleted successfully');
        yield put({ type: 'fetchDepartments', payload: { take, skip } });
      } else if (response?.message) {
        message.error(response?.message);
      }
    },
  },
  reducers: {
    fetchDepartmentsSuccess(state, action) {
      state.departments = action.payload?.departments;
      state.totalDepartments = action.payload?.totalDepartments;
    },
    setIsSearch(state, { payload }) {
      state.isSearch = payload;
    },
    setBankModalVisible(state, { payload: { visible } }) {
      state.bankModalVisible = visible;
    },
    setPagination(state, { payload: { take, skip } }) {
      state.currentPageSize = take;
      state.currentSkip = skip;
    },
    reset: () => initialState,
  },
};

export default departmentModal;
