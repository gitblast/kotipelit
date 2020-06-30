import http from 'http';
import socketIo from 'socket.io';

import app from './app';
import socketIOhandler from './services/socketio';
import config from './utils/config';

const server = http.createServer(app);
const io = socketIo(server);
socketIOhandler(io);

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
