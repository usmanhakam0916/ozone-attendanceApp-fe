/* eslint-disable no-param-reassign */
import { GLOBAL_NAME_SPACE } from '@/models/constants';
import request from '@/utils/request';
import { message } from 'antd';

import { NAME_SPACE } from '../constants';

const initialState = {
  data: [],
  bankModalVisible: false,
  bankId: '',
  filter: {
    name: '',
    createdByName: '',
  },
};

const bankListing = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *deleteBank({ payload: { id } }, { put }) {
      yield request.delete(`locations/${id}`);
      message.success('Location deleted successfully.');
      yield put({ type: `${GLOBAL_NAME_SPACE}/fetchLocations` });
    },
    *createBank({ payload: { data } }, { put }) {
      yield request.post('locations', {
        data,
      });
      message.success('Location created successfully');
      yield put({
        type: `setBankModalVisible`,
        payload: {
          visible: false,
        },
      });
      yield put({ type: `${GLOBAL_NAME_SPACE}/fetchLocations` });
    },
    *updateBank({ payload: { data, id } }, { put }) {
      yield request.patch(`locations/${id}`, {
        data,
      });
      message.success('Location updated successfully');
      yield put({
        type: `setBankModalVisible`,
        payload: {
          visible: false,
        },
      });
      yield put({ type: `${GLOBAL_NAME_SPACE}/fetchLocations` });
    },
  },
  reducers: {
    // fetchBankListSuccess(state, action) {
    //   state.data = action.payload;
    //   state.bankModalVisible = false;
    //   state.bankId = null;
    // },
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
    setBankModalVisible(state, { payload: { visible, id } }) {
      state.bankModalVisible = visible;
      state.bankId = id;
    },
    reset: () => initialState,
  },
};

export default bankListing;
