import http from 'http';
import socketIo from 'socket.io';
import express from 'express';
import { ExpressPeerServer } from 'peer';

import app from './app';
import socketIOhandler from './services/socketio';
import config from './utils/config';
import { log } from './utils/logger';

const server = http.createServer(app);
const io = socketIo(server);

socketIOhandler(io);

const listener = server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

const peerServer = ExpressPeerServer(listener, {
  proxied: true,
});

app.use('/api/peerjs', peerServer);

app.use('/*', express.static('build'));

peerServer.on('connection', (client) => {
  log(`peer connected ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  log(`peer disconnected ${client.getId()}`);
});
