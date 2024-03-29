/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import http from 'http';
import jwt from 'jsonwebtoken';
import { AddressInfo } from 'net';
import { Server } from 'socket.io';
import { io as ioClient, Socket, SocketOptions } from 'socket.io-client';
import * as ioService from '.';
import config from '../../utils/config';
import testHelpers, { SocketIOParams } from '../../utils/testHelpers';

let ioServer: Server;
let httpServer: http.Server;
let httpServerAddr: AddressInfo;

let socket: Socket;

let path: string;
let options: SocketIOParams['options'];

describe('socket.io', () => {
  beforeAll(() => {
    httpServer = http.createServer().listen();
    const addr = httpServer.address();
    if (!addr || typeof addr === 'string')
      throw new Error('incorrect address type');

    httpServerAddr = addr;

    const optionsObj = testHelpers.getSocketIOParams(
      httpServerAddr.address,
      httpServerAddr.port.toString()
    );

    path = optionsObj.path + '/games';
    options = optionsObj.options;

    ioServer = new Server(httpServer);
    ioService.default(ioServer);
  });

  afterAll(() => {
    ioServer.close();
    httpServer.close();
    socket.close();
  });

  describe('authenticateSocket', () => {
    it('should not connect without a valid token', (done) => {
      socket = ioClient(path, {
        ...options,
        auth: {
          token: 'Bearer INVALID_TOKEN',
        },
      } as SocketOptions);

      socket.once('connect', () => {
        fail('expect to not connect');
      });

      socket.on('connect_error', (error: { data: { type: string } }) => {
        expect(error.data.type).toBe('UnauthorizedError');

        done();
      });
    });
  });

  it('should connect with a valid token', (done) => {
    const token = jwt.sign({ id: 'test' }, config.SECRET);

    socket = ioClient(path, {
      ...options,
      auth: {
        token: `Bearer ${token}`,
      },
    } as SocketOptions);

    socket.once('connect_error', (error: Error) => {
      console.log('connection error:', error.message);

      fail('expected to succeed');
    });

    socket.once('connect', () => {
      done();
    });
  });
});
