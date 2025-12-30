/* eslint-disable no-param-reassign */
import request from '@/utils/request';

import { NAME_SPACE } from '../constants';

const initialState = {
  data: null,
};

const getLink = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *getLink({ payload: { data } }, { put }) {
      const response = yield request.post(`coupons`, { data });
      yield put({ type: 'fetchLinkSuccess', payload: response });
    },
  },
  reducers: {
    fetchLinkSuccess(state, action) {
      state.data = action.payload;
    },
  },
};

export default getLink;
