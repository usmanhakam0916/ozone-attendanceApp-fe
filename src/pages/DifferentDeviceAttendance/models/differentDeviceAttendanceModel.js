import request from '@/utils/request';

import { NAME_SPACE } from '../constants';

const initialState = {
  differentDeviceAttendances: [],
  totalDifferentDeviceAttendances: 0,
  bankModalVisible: false,
  employeeId: null,
};

const differentDeviceAttendanceModel = {
  namespace: NAME_SPACE,
  state: initialState,
  effects: {
    *fetchDifferentDeviceAttendances({ payload: { take, skip, employeeId } }, { put }) {
      const response = yield request.get(
        `attendances/get/all/of/different/device/ids/${take}/${skip}?${
          employeeId ? `employeeId=${employeeId}` : ''
        }`,
      );
      if (response?.totalAttendances) {
        yield put({
          type: 'fetchDifferentDeviceAttendancesSuccess',
          payload: { ...response, employeeId },
        });
      } else {
        yield put({
          type: 'fetchDifferentDeviceAttendancesSuccess',
          payload: {
            differentDeviceAttendances: [],
            totalDifferentDeviceAttendances: 0,
            employeeId,
          },
        });
      }
    },
  },
  reducers: {
    fetchDifferentDeviceAttendancesSuccess(state, action) {
      state.differentDeviceAttendances = action.payload?.attendances;
      state.totalDifferentDeviceAttendances = action.payload?.totalAttendances;
      state.employeeId = action?.payload?.employeeId;
    },
    reset: () => initialState,
  },
};

export default differentDeviceAttendanceModel;
