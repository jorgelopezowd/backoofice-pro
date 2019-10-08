import request from '@/utils/request';
import app from '@/utils/feathersApp'


const orerStatsService = app.service('stats-orders');
const cartStatsService = app.service('stats-carts');
// statsService.on('created', message => console.log('Created a message', message));
// socket.on('order-stats patched',order => {
//   console.log('order created',order)
// })

// socket.emit('patch','order-stats','5d483da249079419e90442ee',{currency : 'COP'},{},(err,callback)=>{
//   console.log('order > ',err,callback)
// })
// Use the messages service from the server
// console.log('statsService.find() ')
// statsService.find({}).then(data => console.log('data>',data))

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
export async function salesByPayment(params = {}) {
  // console.log('params',params)
  return orerStatsService.find(params);
  // return request(`${apiUrl}/stats-orders`);
}
export async function cartStats(params = {}) {
  // console.log('params',params)
  return cartStatsService.find(params);
  // return request(`${apiUrl}/stats-orders`);
}
