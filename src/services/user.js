import request from '@/utils/request';
import app from '@/utils/feathersApp';
const userService = app.service('users');
const currentService = app.service('current');

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return currentService.find();
}
export async function queryNotices() {
  return request('/api/notices');
}
