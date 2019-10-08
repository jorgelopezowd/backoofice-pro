import request from '@/utils/request';
import app from '@/utils/feathersApp';
import { FormDataType } from './index';

export async function accountLogin(params: FormDataType) {
  const { email, password } = params;

  return new Promise((resolve, reject) => {
    app
      .authenticate({
        strategy: 'local',
        email,
        password,
      })
      .then((e: any) => {
        resolve(e);
      })
      .catch((err: any) => {
        resolve(err);
      });
  });
}

export async function logout() {
  return Promise.resolve(app.logout());
}
export async function fakeAccountLogin(params: FormDataType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
