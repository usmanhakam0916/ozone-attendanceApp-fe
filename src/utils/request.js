import { extend } from 'umi-request';
import { message } from 'antd';
import { history } from 'umi';
import { BASE_URL } from './constants';
import { clearStorage } from './localStorage';

const errorHandler = async (error) => {
  let { response } = error;

  // todo: throw server errors (low priority)

  if (response && response.status) {
    const { status, url, statusText } = response;
    if (status === 401) {
      // message.error(`Authentication failed!`);
      clearStorage();
      setTimeout(() => {
        if (!window.location.href.includes('login')) {
          history.replace({
            pathname: '/user/login',
          });
        }
      }, 1000);
    }
    response = await response?.json();

    message.error(`${statusText || response?.message}`);
  } else if (!response) {
    message.error('Your network is abnormal and cannot connect to the server');
  }

  return response;
};

const request = extend({
  // todo: pull out this baseurl in .env file.
  prefix: `${BASE_URL}`,
  errorHandler,
  // credentials: 'include',
});

request.use(async (ctx, next) => {
  const idleTime = localStorage.getItem('idleTime');
  if (idleTime) {
    const timeDifferenceInMinutes =
      (new Date().getTime() - new Date(idleTime).getTime()) / 1000 / 60;
    if (
      sessionStorage.getItem('access_token') &&
      Math.abs(Math.round(timeDifferenceInMinutes)) > 60
    ) {
      message.error('Session Expired');
      clearStorage();
      history.push('/user/login');
    } else {
      localStorage.setItem('idleTime', new Date());
      await next();
    }
  } else {
    localStorage.setItem('idleTime', new Date());
    await next();
  }
});
export default request;
