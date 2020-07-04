/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  EventType,
  Role,
  JitsiReadyData,
  GameModel,
  GameStatus,
  TestEventType,
  ActiveGame,
  GameRoom,
} from '../types';

import { AddressInfo } from 'net';
import ioClient from 'socket.io-client';
import * as ioService from './socketio';
import http from 'http';
import ioBack, { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import testHelpers, { SocketIOParams } from '../utils/testHelpers';
import { setRooms } from './rooms';
import config from '../utils/config';
import { UnauthorizedError } from 'socketio-jwt';
import connection from '../utils/connection';
import Game from '../models/game';
import roomService from './rooms';

const tokenPayload = {
  username: 'host',
  id: 'hostid',
  role: Role.HOST,
};

const hostToken = jwt.sign(tokenPayload, config.SECRET);

let ioServer: Server;
let httpServer: http.Server;
let httpServerAddr: AddressInfo;

let socket: SocketIOClient.Socket;

let path: string;
let options: SocketIOParams['options'];

jest.setTimeout(10000);

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

describe('socket.io with host token', () => {
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
    // set socket to auth with host token
    socket = setupSocket(hostToken);
  });

  describe('jitsi ready', () => {
    it('should broadcast "game ready" with jitsi roomname to room', (done) => {
      const data: JitsiReadyData = {
        gameId: 'gameID',
        jitsiRoom: 'jitsi room name',
      };

      const anotherSocket = setupSocket(hostToken);

      socket.emit(TestEventType.JOIN_ROOM, 'gameID');

      socket.once(TestEventType.ROOM_JOINED, () => {
        anotherSocket.emit(TestEventType.JOIN_ROOM, 'gameID');
        anotherSocket.once(TestEventType.ROOM_JOINED, () => {
          socket.emit(EventType.JITSI_READY, data);
        });

        anotherSocket.once(EventType.GAME_READY, (data: string) => {
          expect(data).toBe('jitsi room name');
          done();
        });
      });
    });
  });

  describe('start game', () => {
    describe('on success', () => {
      let game: GameModel;
      let room: GameRoom;
      let gameId: string;
      const mockGame = { status: GameStatus.WAITING };

      beforeAll(async () => {
        const user = await testHelpers.addDummyUser();
        game = await testHelpers.addDummyGame(user);
        gameId = game._id.toString();
      });

      beforeEach(() => {
        setRooms({});

        room = roomService.createRoom(gameId, 'hostID', mockGame as ActiveGame);

        socket.once(EventType.START_FAILURE, (data: { error: string }) => {
          fail(`expected start success, got start fail: ${data.error}`);
        });
      });

      it('should broadcast "game starting" to room', (done) => {
        const other = setupSocket(hostToken);

        other.emit(TestEventType.JOIN_ROOM, gameId);

        other.once(TestEventType.ROOM_JOINED, (room: string) => {
          expect(room).toBe(gameId);
          socket.emit(EventType.START_GAME, gameId);
        });

        other.once(EventType.GAME_STARTING, () => {
          done();
        });
      });

      it('should set game status to "STARTED" in room and db', (done) => {
        socket.emit(EventType.START_GAME, gameId);

        socket.once(EventType.START_SUCCESS, async () => {
          const gameNow = (await Game.findById(game._id)) as GameModel;

          expect(gameNow.status).toBe(GameStatus.RUNNING);

          expect(room.game.status).toBe(GameStatus.RUNNING);
          done();
        });
      });
    });
  });

  describe('create room', () => {
    let game: GameModel;
    let gameId: string;

    beforeEach(async () => {
      await Game.deleteMany({});
      const user = await testHelpers.addDummyUser();
      game = await testHelpers.addDummyGame(user);
      gameId = game._id.toString();

      socket.once(EventType.CREATE_FAILURE, (data: { error: string }) => {
        fail(`Expected success, got fail with error: ${data.error}`);
      });
    });

    it('should set game status to waiting and send back jitsi token', (done) => {
      expect(game.status).toBe(GameStatus.UPCOMING);

      socket.emit(EventType.CREATE_ROOM, gameId);

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
      setRooms({});

      const roomsBefore = Object.keys(roomService.getRooms()).length;

      expect(roomsBefore).toBe(0);

      socket.emit(EventType.CREATE_ROOM, gameId);

      socket.once(EventType.CREATE_SUCCESS, () => {
        const roomsNow = roomService.getRooms();
        expect(Object.keys(roomsNow).length).toBe(roomsBefore + 1);
        const addedRoom = roomsNow[game._id.toString()];

        expect(addedRoom).toBeDefined();
        expect(addedRoom.game.id).toBe(game._id.toString());
        expect(typeof addedRoom.hostSocket).toBe('string');
        done();
      });
    });

    it('should join socket to socket.io channel matching game id', (done) => {
      setRooms({});
      socket.emit(EventType.CREATE_ROOM, gameId);

      socket.once(EventType.CREATE_SUCCESS, () => {
        ioServer
          .to(game._id.toString())
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
