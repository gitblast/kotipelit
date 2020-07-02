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
  JitsiReadyData,
  TestEventType,
  // ActiveGame,
  // ActiveGamePlayer,
} from '../types';
import { UnauthorizedError } from 'socketio-jwt';

const hostToken = jwt.sign(
  { username: 'host', id: 'hostid', gameId: 'hostgameID', role: Role.HOST },
  config.SECRET
);

const playerToken = jwt.sign(
  {
    username: 'player',
    id: 'playerid',
    gameId: 'playergameID',
    role: Role.PLAYER,
  },
  config.SECRET
);

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

      expect(ioService.createFailure('error message')).toEqual(expectedEvent);
    });
  });

  describe('handler', () => {
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

    describe('test listeners', () => {
      beforeEach(() => {
        socket = setupSocket(hostToken);
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

    // times out if valid token is given
    it('should not connect without a valid token', (done) => {
      socket = ioClient(path, options);

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

    describe('with player token', () => {
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

        /**describe('on success', () => {
          it('should return the active game', (done) => {
            const mockGame = ({
              testGame: true,
              players: [
                {
                  id: 'playerid',
                  socket: null,
                },
              ] as ActiveGamePlayer[],
            } as unknown) as ActiveGame;

            roomService.createRoom('playergameID', 'hostID', mockGame);

            socket.emit(EventType.JOIN_GAME);

            socket.once(EventType.JOIN_SUCCESS, (game: ActiveGame) => {
              expect(game).toEqual(mockGame);
              done();
            });

            socket.once(EventType.JOIN_FAILURE, (data: { error: string }) => {
              fail(`expected join success, got join fail: ${data.error}`);
            });
          });
        }); */

        // describe('on failure', () => {});
      });
    });

    describe('with host token', () => {
      beforeEach(() => {
        // set socket to auth with host token
        socket = setupSocket(hostToken);
      });

      describe('jitsi ready', () => {
        it('should broadcast "game ready" to room', (done) => {
          const data: JitsiReadyData = {
            gameId: 'gameID',
            jitsiRoom: 'jitsi room name',
          };

          const anotherSocket = setupSocket(hostToken);

          socket.emit('join room', 'gameID');

          socket.once('room joined', () => {
            anotherSocket.emit('join room', 'gameID');
            anotherSocket.once('room joined', () => {
              socket.emit(EventType.JITSI_READY, data);
            });

            anotherSocket.once(EventType.GAME_READY, (data: string) => {
              expect(data).toBe('jitsi room name');
              done();
            });
          });
        });
      });

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
