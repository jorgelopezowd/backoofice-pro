import request from '@/utils/request';

const apiUrl = 'http://localhost:3030';

const io = require('socket.io-client');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');

const socket = io(apiUrl);
const client = feathers();

client.configure(socketio(socket));


const messageService = client.service('stats-orders');
// messageService.on('created', message => console.log('Created a message', message));

// Use the messages service from the server
// console.log('messageService.find() ')
// messageService.find({}).then(data => console.log('data>',data))

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}
export async function salesByPayment(params = {}) {
   return messageService.find(params)
  // return request(`${apiUrl}/stats-orders`);
}
