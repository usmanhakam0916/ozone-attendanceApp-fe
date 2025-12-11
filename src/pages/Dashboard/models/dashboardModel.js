/* eslint-disable no-param-reassign */
import request from '@/utils/request';

import { NAME_SPACE } from '../constants';

const initialState = {
  date: new Date(),
  locationId: 'all',
  data: {
    iphoneCount: 0,
    androidCount: 0,
    checkInTimeCounts: 0,
    checkoutTimeCounts: 0,
    qrCodeCheckIns: 0,
    qrCodeCheckOuts: 0,
    faceCheckIns: 0,
    faceCheckOuts: 0,
    adminCheckIns: 0,
    adminCheckouts: 0,
    checkInTimes: [],
    checkoutTimes: [],
  },
  locations: [],
  isFirstTimeLoad: true,
};

const dashboard = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchDashboard({ payload: { locationId, date } }, { put }) {
      const response = yield request.get(`dashboard/${locationId}/date?date=${date}`);
      if (response?.androidUsers >= 0) {
        yield put({ type: 'fetchDashboardSuccess', payload: { response, date, locationId } });
      }
    },
    *fetchLocations({}, { put }) {
      let response = yield request.get('locations');
      if (response?.length) {
        response?.sort((a, b) => b.id - a.id);
        response.unshift({ id: 'all', name: 'All' });
        yield put({ type: 'fetchLocationsSuccess', payload: response });
      }
    },
  },

  reducers: {
    fetchDashboardSuccess(state, action) {
      state.data.iphoneCount = action.payload?.response?.iphoneUsers;
      state.data.androidCount = action.payload?.response?.androidUsers;
      state.data.checkInTimeCounts = action.payload?.response?.checkInTimeCounts;
      state.data.checkoutTimeCounts = action.payload?.response?.checkoutTimeCounts;
      state.data.checkInTimes = action.payload?.response?.checkInTimes;
      state.data.checkoutTimes = action.payload?.response?.checkoutTimes;
      state.data.qrCodeCheckIns = action.payload?.response?.qrCodeCheckIns;
      state.data.qrCodeCheckOuts = action.payload?.response?.qrCodeCheckOuts;
      state.data.faceCheckIns = action.payload?.response?.faceCheckIns;
      state.data.faceCheckOuts = action.payload?.response?.faceCheckOuts;
      state.data.adminCheckIns = action.payload?.response?.adminCheckIns;
      state.data.adminCheckouts = action.payload?.response?.adminCheckouts;
      state.date = action?.payload?.date;
      state.locationId = action?.payload?.locationId;
      state.isFirstTimeLoad = false;
    },
    fetchLocationsSuccess(state, action) {
      state.locations = action.payload;
    },
    setLocationId(state, action) {
      state.locationId = action.payload;
    },
    setDate(state, action) {
      state.date = action.payload;
    },
  },
};

export default dashboard;
