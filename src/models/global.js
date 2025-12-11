import { queryNotices } from '@/services/user';

import request from '@/utils/request';
import { GLOBAL_NAME_SPACE } from './constants';

const initialState = {
  collapsed: false,
  notices: [],
  locations: [],
  auth: { role: '', accessToken: '' },
  redirect: null,
  employeeFilter: {
    deviceType: 'all',
    badgeNo: null,
    departmentId: null,
  },
};

const GlobalModel = {
  namespace: `${GLOBAL_NAME_SPACE}`,
  state: initialState,
  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        (state) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *fetchLocations(_, { put }) {
      let response = yield request.get('locations');
      response = response.sort((a, b) => b.id - a.id);
      yield put({ type: 'fetchBankListSuccess', payload: response.reverse() });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select((state) => state.global.notices.length);
      const unreadCount = yield select(
        (state) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select((state) =>
        state.global.notices.map((item) => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },

    *deleteFile({ payload: { id } }) {
      yield request.delete(`files/remove/${id}`);
    },
  },
  reducers: {
    setAuth(state, action) {
      state.auth = action.payload;
    },
    setRedirect(state, action) {
      state.redirect = action.payload;
    },
    getRedirect(state, action) {
      return state.redirect;
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },
    fetchBankListSuccess(state, action) {
      state.locations = action.payload;
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    setEmployeeFilter(state, action) {
      state.employeeFilter.deviceType = action.payload?.deviceType;
      state.employeeFilter.badgeNo = action.payload?.badgeNo;
      state.employeeFilter.departmentId = action.payload?.departmentId;
    },
    reSet: () => initialState,

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item) => item.type !== payload),
      };
    },
  },
};
export default GlobalModel;
