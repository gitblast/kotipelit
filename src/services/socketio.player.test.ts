/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import ioClient from 'socket.io-client';
import ioBack, { Server } from 'socket.io';
import http from 'http';
import {
  EventType,
  Role,
  TestEventType,
  ActiveGame,
  ActiveGamePlayer,
  ReturnedGame,
} from '../types';

import { AddressInfo } from 'net';
import { UnauthorizedError } from 'socketio-jwt';
import testHelpers, { SocketIOParams } from '../utils/testHelpers';
import config from '../utils/config';
import roomService, { setRooms } from './rooms';
import * as ioService from './socketio';

import jwt from 'jsonwebtoken';
import connection from '../utils/connection';

const tokenPayload = {
  username: 'player',
  id: 'playerid',
  gameId: 'playergameID',
  role: Role.PLAYER,
};

const playerToken = jwt.sign(tokenPayload, config.SECRET);

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

jest.setTimeout(10000);

describe('socket.io with player token', () => {
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

  afterEach(() => {
    if (socket.connected) socket.disconnect();

    socket.removeAllListeners();
  });

  beforeEach(() => {
    // set socket to auth with player token
    socket = setupSocket(playerToken);
  });

  describe('join room', () => {
    it('should join socket to socket.io channel from token', (done) => {
      socket.emit(EventType.JOIN_GAME);

      socket.once(TestEventType.ROOMS_RECEIVED, (rooms: string[]) => {
        expect(rooms).toContain('playergameID');
        done();
      });

      socket.once(EventType.JOIN_FAILURE, () => {
        socket.emit(TestEventType.GET_ROOMS);
      });

      socket.once(EventType.JOIN_SUCCESS, () => {
        socket.emit(TestEventType.GET_ROOMS);
      });
    });

    describe('on success', () => {
      const mockGame = ({
        testGame: true,
        players: [
          {
            id: 'playerid',
            name: 'playername',
            socket: null,
          },
        ] as ActiveGamePlayer[],
      } as unknown) as ActiveGame;

      beforeEach(() => {
        setRooms({});
        roomService.createRoom(tokenPayload.gameId, 'hostID', mockGame);
        roomService.setJitsiRoom(tokenPayload.gameId, 'TEST_ROOM!');
        socket.once(EventType.JOIN_FAILURE, (data: { error: string }) => {
          fail(`expected join success, got join fail: ${data.error}`);
        });
      });

      it('should return the active game', (done) => {
        const expectedGame = {
          ...mockGame,
          players: mockGame.players.map((p) => ({
            id: p.id,
            name: p.name,
            online: true,
          })),
        };

        socket.emit(EventType.JOIN_GAME);

        socket.once(
          EventType.JOIN_SUCCESS,
          (data: { game: ReturnedGame; jitsiRoom: string }) => {
            expect(data.game).toEqual(expectedGame);
            expect(data.jitsiRoom).toBe('TEST_ROOM!');
            done();
          }
        );
      });

      it('should broadcast "player joined" to room', (done) => {
        const payload = { ...tokenPayload, id: 'otherid' };
        const token = jwt.sign(payload, config.SECRET);
        const other = setupSocket(token);

        other.emit(TestEventType.JOIN_ROOM, tokenPayload.gameId);

        other.once(TestEventType.ROOM_JOINED, (room: string) => {
          expect(room).toBe(tokenPayload.gameId);

          socket.emit(EventType.JOIN_GAME);
        });

        other.once(EventType.PLAYER_JOINED, (id: string) => {
          expect(id).toBe(tokenPayload.id);
          done();
        });
      });
    });

    // describe('on failure', () => {});
  });
});
