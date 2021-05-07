import http from 'http';
import { Server as socketIoServer } from 'socket.io';
import express from 'express';

import app from './app';
import socketIOhandler from './services/socketio';
import config from './utils/config';
import { setDebug } from './utils/logger';

console.log('setting logger debugging true in index');
setDebug(true);

const server = http.createServer(app);

const io = new socketIoServer(server, {
  pingTimeout: 20000,
  pingInterval: 25000,
  allowUpgrades: false,
  transports: ['websocket'],
});

socketIOhandler(io);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

app.use('/*', express.static('build'));
