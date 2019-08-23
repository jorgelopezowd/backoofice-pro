import request from '@/utils/request';

const apiUrl =
  process.env.NODE_ENV === 'development-'
    ? 'http://localhost:3030'
    : 'https://api-stats.luckywoman.com.co/';

const io = require('socket.io-client');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');

const socket = io(apiUrl);
const app = feathers();

app.configure(socketio(socket));

const orerStatsService = app.service('stats-orders');
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
