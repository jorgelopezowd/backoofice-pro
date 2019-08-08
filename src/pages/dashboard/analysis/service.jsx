import request from '@/utils/request';

const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3030' : 'https://api-stats.luckywoman.com.co/';

const io = require('socket.io-client');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');

const socket = io(apiUrl);
const client = feathers();

client.configure(socketio(socket));


const statsService = client.service('stats-orders');
// statsService.on('created', message => console.log('Created a message', message));

// Use the messages service from the server
// console.log('statsService.find() ')
// statsService.find({}).then(data => console.log('data>',data))

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
export async function salesByPayment(params = {}) {
  // console.log('params',params)
   return statsService.find(params)
  // return request(`${apiUrl}/stats-orders`);
}
