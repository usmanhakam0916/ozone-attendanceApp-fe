import request from '@/utils/request';
import { NAME_SPACE } from '../constants';

const initialState = {
  deviceIdTracking: [],
  totalDeviceIdTracking: 0,
  employeeId: null,
  bankModalVisible: false,
};

const removedDeviceTrackingModel = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchDeviceIdTracking({ payload: { take, skip, employeeId } }, { put }) {
      const response = yield request.get(
        `deviceIdTracking/${take}/${skip}?${employeeId ? `employeeId=${employeeId}` : ''}`,
      );
      if (response?.totalDeviceIdTracking) {
        yield put({ type: 'fetchDeviceIdTrackingSuccess', payload: { ...response, employeeId } });
      } else {
        yield put({
          type: 'fetchDeviceIdTrackingSuccess',
          payload: { deviceIdTracking: [], totalDeviceIdTracking: 0, employeeId },
        });
      }
    },
  },
  reducers: {
    fetchDeviceIdTrackingSuccess(state, action) {
      state.deviceIdTracking = action.payload?.deviceIdTracking;
      state.totalDeviceIdTracking = action.payload?.totalDeviceIdTracking;
      state.employeeId = action?.payload?.employeeId;
    },
    reset: () => initialState,
  },
};

export default removedDeviceTrackingModel;
