/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ioClient from 'socket.io-client';
import ioBack, { Server } from 'socket.io';
import http from 'http';
import testHelpers, { SocketIOParams } from '../../utils/testHelpers';
import connection from '../../utils/connection';
import config from '../../utils/config';
import jwt from 'jsonwebtoken';

import { AddressInfo } from 'net';

import * as ioService from '.';
import { EventType, Role, TestEventType } from '../../types';
import { UnauthorizedError } from 'socketio-jwt';

const hostToken = jwt.sign(
  { username: 'host', id: 'hostid', gameId: 'hostgameID', role: Role.HOST },
  config.SECRET
);

let ioServer: Server;
let httpServer: http.Server;
let httpServerAddr: AddressInfo;

let socket: SocketIOClient.Socket;

let path: string;
let options: SocketIOParams['options'];

const setupSocket = (token: string): SocketIOClient.Socket => {
  const newSocket = ioClient(path, options);

  newSocket.once('connect', () => {
    newSocket
      .emit(EventType.AUTH, { token })
      .once(EventType.UNAUTHORIZED, (error: UnauthorizedError) => {
        throw new Error(error.message);
      });
  });

  return newSocket;
};

describe('socket.io', () => {
  beforeAll(async () => {
    httpServer = http.createServer().listen();
    const addr = httpServer.address();
    if (!addr || typeof addr === 'string')
      throw new Error('incorrect address type');

    httpServerAddr = addr;

    const optionsObj = testHelpers.getSocketIOParams(
      httpServerAddr.address,
      httpServerAddr.port.toString()
    );

    path = optionsObj.path;
    options = optionsObj.options;

    ioServer = ioBack(httpServer);
    ioService.default(ioServer);

    await connection.connect(config.MONGODB_URI);
  });

  afterAll(async (done) => {
    ioServer.close();
    httpServer.close();
    socket.close();
    await connection.close();

    // wait for all handles to close
    setTimeout(() => {
      done();
    }, 1000);
  });

  describe('handler', () => {
    describe('test listeners', () => {
      beforeEach(() => {
        socket = setupSocket(hostToken);
      });

      afterEach(() => {
        if (socket.connected) socket.disconnect();

        socket.removeAllListeners();
      });

      it('test server and socket should work', () => {
        ioServer.emit('test', 'hello');
        socket.once('test', (message: string) => {
          expect(message).toBe('hello');
        });

        ioServer.once('connection', (socket: SocketIOClient.Socket) => {
          expect(socket).toBeDefined();
        });
      });

      it('should return the backend socket rooms with "get socket rooms"', (done) => {
        socket.emit(TestEventType.GET_ROOMS);
        socket.once(TestEventType.ROOMS_RECEIVED, (data: string[]) => {
          expect(data).toBeDefined();
          expect(Array.isArray(data)).toBe(true);
          done();
        });
      });

      it('should join room with "join room"', (done) => {
        socket.emit(TestEventType.JOIN_ROOM, 'testroom');

        socket.once(TestEventType.ROOM_JOINED, (room: string) => {
          expect(room).toBe('testroom');
          socket.emit(TestEventType.GET_ROOMS);
        });

        socket.once(TestEventType.ROOMS_RECEIVED, (rooms: string[]) => {
          expect(rooms).toContain('testroom');

          done();
        });
      });

      it('should broadcast to room with "broadcast to"', (done) => {
        const other = setupSocket(hostToken);
        other.emit(TestEventType.JOIN_ROOM, 'testroom');

        other.once(TestEventType.ROOM_JOINED, (room: string) => {
          socket.emit(TestEventType.BROADCAST_TO, {
            room,
            event: 'testing',
            message: 'hello hello',
          });
        });

        other.once('testing', (message: string) => {
          expect(message).toBe('hello hello');
          done();
        });
      });
    });

    it('should not connect without a valid token', (done) => {
      socket = ioClient(path, options);

      socket.once(EventType.AUTHENTICATED, () => {
        fail('expected auth to fail');
      });

      socket.once('connect', () => {
        socket
          .emit(EventType.AUTH, { token: 'INVALID_TOKEN' })
          .once(EventType.UNAUTHORIZED, (error: UnauthorizedError) => {
            expect(error).toBeDefined();
            expect(error.data.type).toBe('UnauthorizedError');
            expect(error.data.code).toBe('invalid_token');
            done();
          });
      });
    });
  });
});
