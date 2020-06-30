/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import ioClient from 'socket.io-client';
import ioBack, { Server } from 'socket.io';
import http from 'http';
import testHelpers from '../utils/testHelpers';
import connection from '../utils/connection';
import config from '../utils/config';
import Game from '../models/game';

import { AddressInfo } from 'net';

import * as ioService from './socketio';
import {
  EmittedEvent,
  EventType,
  GameStatus,
  CreateRoomData,
  GameModel,
} from '../types';

let ioServer: Server;
let httpServer: http.Server;
let httpServerAddr: AddressInfo;

let socket: SocketIOClient.Socket;

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
    beforeAll(async () => {
      httpServer = http.createServer().listen();
      const addr = httpServer.address();
      if (!addr || typeof addr === 'string')
        throw new Error('incorrect address type');

      httpServerAddr = addr;

      ioServer = ioBack(httpServer);
      ioService.default(ioServer);

      await connection.connect(config.MONGODB_URI);
    });

    afterAll(() => {
      ioServer.close();
      httpServer.close();
    });

    beforeEach(() => {
      const { path, options } = testHelpers.getSocketIOParams(
        httpServerAddr.address,
        httpServerAddr.port.toString()
      );

      socket = ioClient(path, options);
    });

    afterEach(() => {
      if (socket.connected) socket.disconnect();
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

    describe('create room', () => {
      let game: GameModel;
      let dataToSend: CreateRoomData;

      beforeEach(async () => {
        const user = await testHelpers.addDummyUser();
        game = await testHelpers.addDummyGame(user);
        dataToSend = {
          gameId: game._id.toString(),
          hostName: 'TEST_HOSTNAME',
        };
      });

      it('should set game status to waiting and send back jitsi token', () => {
        expect(game.status).toBe(GameStatus.UPCOMING);

        socket.emit(EventType.CREATE_ROOM, dataToSend);

        socket.once(EventType.CREATE_SUCCESS, async (data: string) => {
          expect(data).toBeDefined();
          const gameNow = await Game.findById(game._id);
          expect(gameNow).not.toBe(null);
          expect(gameNow?.status).toBe(GameStatus.WAITING);
        });
      });

      it('should join socket to a room with hostname and game defined', (done) => {
        ioService.setRooms([]);

        const roomsBefore = ioService.getRooms().length;

        expect(roomsBefore).toBe(0);

        socket.emit(EventType.CREATE_ROOM, dataToSend);

        socket.once(EventType.CREATE_SUCCESS, () => {
          const roomsNow = ioService.getRooms();
          expect(roomsNow.length).toBe(roomsBefore + 1);
          const addedRoom = roomsNow.find(
            (room) => room.hostSocket === 'TEST_HOSTNAME'
          );

          expect(addedRoom).toBeDefined();
          expect(addedRoom).toHaveProperty('game');
          done();
        });
      });
    });
  });
});
