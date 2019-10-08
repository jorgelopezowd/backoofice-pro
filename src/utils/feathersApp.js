import defaultSettings from './../../config/defaultSettings';
import auth from '@feathersjs/authentication-client';
const { apiUrl } = defaultSettings;
const io = require('socket.io-client');
const feathers = require('@feathersjs/feathers');
const socketio = require('@feathersjs/socketio-client');

const socket = io(apiUrl);
const app = feathers();

app.configure(socketio(socket)).configure(
  auth({
    storage: window.localStorage,
  }),
);

export default app;
