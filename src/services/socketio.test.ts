/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ioClient from 'socket.io-client';
import ioBack, { Server } from 'socket.io';
import http from 'http';
import testHelpers, { SocketIOParams } from '../utils/testHelpers';
import connection from '../utils/connection';
import config from '../utils/config';
import Game from '../models/game';
import roomService, { setRooms } from './rooms';
import jwt from 'jsonwebtoken';

import { AddressInfo } from 'net';

import * as ioService from './socketio';
import {
  EmittedEvent,
  EventType,
  GameStatus,
  CreateRoomData,
  GameModel,
  Role,
} from '../types';
import { UnauthorizedError } from 'socketio-jwt';

const hostToken = jwt.sign(
  { username: 'username', id: 'id', role: Role.HOST },
  config.SECRET
);

/** const playerToken = jwt.sign(
  { username: 'username', id: 'id', role: Role.PLAYER },
  config.SECRET
); */

let ioServer: Server;
let httpServer: http.Server;
let httpServerAddr: AddressInfo;

let socket: SocketIOClient.Socket;

let path: string;
let options: SocketIOParams['options'];

jest.setTimeout(10000);

describe('socket.io', () => {
  describe('event creators', () => {
    it('should create event for succesful room creation', () => {
      const expectedEvent: EmittedEvent = {
        event: EventType.CREATE_SUCCESS,
        data: 'token for jitsi',
      };

      expect(ioService.createSuccess('token for jitsi')).toEqual(expectedEvent);
    });

    it('should create event for failure of room creation', () => {
      const expectedEvent: EmittedEvent = {
        event: EventType.CREATE_FAILURE,
        data: {
          error: 'error message',
        },
      };

      expect(ioService.createFailure()).toEqual(expectedEvent);
    });
  });

  describe('handler', () => {
    const setupSocket = (token: string): void => {
      socket = ioClient(path, options);

      socket.once('connect', () => {
        socket
          .emit('authenticate', { token })
          .once('unauthorized', (error: UnauthorizedError) => {
            throw new Error(error.message);
          });
      });
    };

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

    it('test server and socket should work', () => {
      setupSocket(hostToken);

      ioServer.emit('test', 'hello');
      socket.once('test', (message: string) => {
        expect(message).toBe('hello');
      });

      ioServer.once('connection', (socket: SocketIOClient.Socket) => {
        expect(socket).toBeDefined();
      });
    });

    // times out if valid token is given
    it('should not connect without a valid token', (done) => {
      socket = ioClient(path, options);

      socket.once('connect', () => {
        socket
          .emit('authenticate', { token: 'INVALID_TOKEN' })
          .once('unauthorized', (error: UnauthorizedError) => {
            expect(error).toBeDefined();
            expect(error.data.type).toBe('UnauthorizedError');
            expect(error.data.code).toBe('invalid_token');
            done();
          });
      });
    });

    describe('with host token', () => {
      describe('create room', () => {
        let game: GameModel;
        let dataToSend: CreateRoomData;

        beforeEach(async () => {
          await Game.deleteMany({});
          const user = await testHelpers.addDummyUser();
          game = await testHelpers.addDummyGame(user);
          dataToSend = {
            gameId: game._id.toString(),
          };
        });

        it('should set game status to waiting and send back jitsi token', (done) => {
          setupSocket(hostToken);
          expect(game.status).toBe(GameStatus.UPCOMING);

          socket.emit(EventType.CREATE_ROOM, dataToSend);

          socket.once(EventType.CREATE_SUCCESS, async (data: string) => {
            expect(data).toBeDefined();
            expect(data).toBe(jwt.sign('TODO', 'TODO'));

            let gameNow = await Game.findById(game._id);
            expect(gameNow).not.toBe(null);

            gameNow = gameNow as GameModel;
            expect(gameNow.status).toBe(GameStatus.WAITING);
            done();
          });
        });

        it('should create a room with game and hostSocket defined', (done) => {
          setupSocket(hostToken);
          setRooms({});

          const roomsBefore = Object.keys(roomService.getRooms()).length;

          expect(roomsBefore).toBe(0);

          socket.emit(EventType.CREATE_ROOM, dataToSend);

          socket.once(EventType.CREATE_SUCCESS, () => {
            const roomsNow = roomService.getRooms();
            expect(Object.keys(roomsNow).length).toBe(roomsBefore + 1);
            const addedRoom = roomsNow[dataToSend.gameId];

            expect(addedRoom).toBeDefined();
            expect(addedRoom.game.id).toBe(dataToSend.gameId);
            expect(typeof addedRoom.hostSocket).toBe('string');
            done();
          });
        });

        it('should join socket to socket.io channel matching game id', (done) => {
          setupSocket(hostToken);
          setRooms({});
          socket.emit(EventType.CREATE_ROOM, dataToSend);

          socket.once(EventType.CREATE_SUCCESS, () => {
            ioServer
              .to(dataToSend.gameId)
              .emit('assert channel joined', 'passed message');
          });

          socket.once('assert channel joined', (data: string) => {
            expect(data).toBeDefined();
            expect(data).toBe('passed message');
            done();
          });
        });
      });
    });
  });
});
