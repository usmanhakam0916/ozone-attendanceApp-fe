import request from '@/utils/request';
import { message } from 'antd';

import { NAME_SPACE } from '../constants';

const initialState = {
  departments: [],
  totalDepartments: 0,
  bankModalVisible: false,
  isSearch: false,
  isSearch: false,
};

const departmentModal = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchDepartments({ payload: { take, skip } }, { put }) {
      const response = yield request.get(`departments/${take}/${skip}`);
      if (response?.totalDepartments) {
        yield put({ type: 'fetchDepartmentsSuccess', payload: response });
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
  },
  reducers: {
    fetchDepartmentsSuccess(state, action) {
      state.departments = action.payload?.departments;
      state.totalDepartments = action.payload?.totalDepartments;
    },
    setIsSearch(state, { payload }) {
      state.isSearch = payload;
    },
    reset: () => initialState,
  },
};

export default departmentModal;
