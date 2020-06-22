import http from 'http';
import socketIo from 'socket.io';

import app from './app';
import config from './utils/config';

const { PORT } = config;

const server = http.createServer(app);
const io = socketIo(server);

io.on('connect', () => console.log('someone connected'));

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
