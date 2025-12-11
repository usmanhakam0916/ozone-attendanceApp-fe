/* eslint-disable no-param-reassign */
import { GLOBAL_NAME_SPACE } from '@/models/constants';
import { clearStorage, getUserData } from '@/utils/localStorage';
import request from '@/utils/request';
import { message } from 'antd';
import { history } from 'umi';

import { NAME_SPACE } from '../constants';

const initialState = {
  data: [],
  modalVisible: false,
  adminId: '',
  index: '',
  filter: {
    name: '',
    email: '',
  },
};

const adminListing = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchAdminList(_, { put }) {
      let response = yield request.get('admins');
      response = response.sort((a, b) => b.id - a.id);
      yield put({ type: 'fetchAdminListSuccess', payload: response });
    },
    *deleteAdmin({ payload: { id, index } }, { put }) {
      yield request.delete(`admins/${id}`);
      message.success('Admin deleted successfully.');
      yield put({ type: 'deleteAdminSuccess', payload: index });
      // yield put({ type: 'fetchAdminList' });
    },
    *createAdmin({ payload: { data } }, { put }) {
      // todo change admin url
      try {
        const response = yield request.post('admins/management/pikessoft', {
          data,
        });
        if (response.status === 400) {
          message.error('Account with this username already exists.');
        } else {
          message.success('Role created successfully');
          yield put({ type: 'createAdminSuccess', payload: response });
        }
      } catch (e) {
        console.log(e);
      }
    },
    *updateAdmin({ payload: { data, id, index, userId } }, { put }) {
      const response = yield request.patch(`admins/${id}`, {
        data,
      });
      if (response.status !== 401) {
        message.success('Role updated successfully');
        yield put({ type: 'updateAdminSuccess', payload: { data: response, index } });
      }
      if (getUserData()?.id === userId) {
        clearStorage();
        yield put({ type: `${GLOBAL_NAME_SPACE}/setRedirect`, payload: null });
        history.push('/user/login');
      }
    },
  },
  reducers: {
    fetchAdminListSuccess(state, action) {
      state.data = action.payload;
    },
    createAdminSuccess(state, action) {
      state.modalVisible = false;
      state.adminId = null;
      state.data.push(action.payload);
    },
    deleteAdminSuccess(state, action) {
      state.modalVisible = false;
      state.adminId = null;
      state.data.splice(action.payload, 1);
    },
    updateAdminSuccess(state, action) {
      state.modalVisible = false;
      state.adminId = null;
      state.index = null;
      state.data[action.payload.index] = action.payload.data;
    },
    setFilter(state, { payload }) {
      // Support both { filter, value } and { name: value } formats
      if (payload.filter !== undefined) {
        state.filter[payload.filter] = payload.value;
      } else {
        // Direct object merge for { name: value } format
        state.filter = { ...state.filter, ...payload };
      }
    },
    resetFilters(state) {
      state.filter = initialState.filter;
    },
    setModalVisible(state, { payload: { visible, id, index } }) {
      state.modalVisible = visible;
      state.adminId = id;
      state.index = index;
    },
    reSet: () => initialState,
  },
};

export default adminListing;
