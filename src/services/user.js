import request from '@/utils/request';
import app from '@/utils/feathersApp';
const userService = app.service('users');
const currentService = app.service('current');

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  console.log('current app.authentication.service', app.authentication);
  const current = app.service('current');
  //test code
  current
    .find()
    .then(data => console.log('current >> data', data))
    .catch(err => {
      console.log('current err >>', err);
    });
  // if(!app.authentication.authenticated){
  //   await app.reAuthenticate()
  // }

  return app.service('current').find();
}
export async function queryNotices() {
  return request('/api/notices');
}
