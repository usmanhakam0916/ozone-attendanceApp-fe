import { setAuthority } from '@/utils/authority';
import * as local from '@/utils/localStorage';
import request from '@/utils/request';
import { message } from 'antd';
import { history } from 'umi';
import { GLOBAL_NAME_SPACE } from './constants';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { put }) {
      let response = null;

      if (payload.access_token) {
        response = payload;
      } else {
        response = yield request.post('auth/login', {
          data: { email: payload.username, password: payload.password, deviceType: 'web' },
        });
        if (response && response.access_token) {
          response.rememberMe = payload.rememberMe;
          message.success('Login successfully!');
        } else {
          localStorage.removeItem('idleTime');
        }
      }
      let me = null;
      if (response && response.access_token) {
        // todo: clean the following code
        request.interceptors.request.use(async (url, options) => {
          const token = response.access_token;
          if (token !== undefined) {
            // eslint-disable-next-line no-param-reassign
            options.headers.Authorization = `Bearer ${token}`;
            return {
              url,
              options,
              headers: { ...options.headers },
            };
          }
          return {
            url,
            options,
            headers: { ...options.headers },
          };
        });
        me = yield request.get('me/me/me');
        if (
          me &&
          (me?.authUser?.type === 'admin' ||
            me?.authUser?.type === 'manager' ||
            me?.authUser?.type === 'hr-manager' ||
            me?.authUser?.type === 'supervisor' ||
            me?.authUser?.type === 'employee')
        ) {
          //debugger;
          const data = { access_token: response.access_token, role: response.role };
          local.insertIntoStorage(data, response.rememberMe);
          local.checkStorage();

          yield put({ type: `${GLOBAL_NAME_SPACE}/setAuth`, payload: data });
          // todo: change the expected data as it's being duplicated
          yield put({
            type: 'user/saveCurrentUser',
            payload: {
              ...me,
              name: me.authUser.username,
              avatar: me.avatar
                ? me.avatar.url
                : 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
              userid: me.id,
              email: me.authUser.email,
              signature: me.displayName,
              title: me.displayName,
              group: me.authUser.type,
            },
          });
        } else {
          message.error('Please sign in as admin/manager user.');
        }
      } else {
        // message.error('Maybe invalid credentials.');
      }

      if (
        me?.id &&
        (me?.authUser?.type === 'admin' ||
          me?.authUser?.type === 'manager' ||
          me?.authUser?.type === 'hr-manager' ||
          me?.authUser?.type === 'supervisor' ||
          me?.authUser?.type === 'employee')
      ) {
        local.setUserData(me?.authUser);
        yield put({
          type: 'changeLoginStatus',
          payload: me,
        }); // Login successfully

        if (me?.authUser?.type === 'employee') {
          history.replace('/deleteAccount');
        } else {
          history.replace(response.redirect || '/');
        }
      }
    },

    *logout({}, { put }) {
      local.clearStorage();
      if (window.location.pathname !== '/user/login') {
        yield put({ type: `${GLOBAL_NAME_SPACE}/setRedirect`, payload: null });
        history.push('/user/login');
      }
    },
    *deleteAccount({}, { put }) {
      const response = yield request.patch('auth/deactivate-user');
      if (response?.message) {
        message.success(response?.message);
        yield put({ type: 'user/setUserModalVisibility', payload: false });
        yield put({ type: 'login/logout' });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
