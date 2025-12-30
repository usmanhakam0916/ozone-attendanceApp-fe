import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request.post('auth/login', {
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
