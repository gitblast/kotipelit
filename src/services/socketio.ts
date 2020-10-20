/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Server } from 'socket.io';
import socketioJwt from 'socketio-jwt';
import config from '../utils/config';
import { log } from '../utils/logger';
import jwt from 'jsonwebtoken';
import * as callbacks from './socketio.callbacks';
import { v4 as uuidv4 } from 'uuid';

import {
  GameStatus,
  ActiveGame,
  EventType,
  SocketWithToken,
  Role,
  CreateRoomResponse,
  JitsiReadyData,
  TestEventType,
  EmittedEvent,
  BroadcastedEvent,
  RTCGame,
  Answer,
} from '../types';

import { Socket } from 'socket.io';

import roomService from './rooms';
import gameService from './games';

export const emit = (socket: Socket, eventObj: EmittedEvent): void => {
  const { event, data } = eventObj;

  log(`Emitting ${event}`);

  socket.emit(event, data);
};

export const broadcast = (
  socket: Socket,
  room: string,
  eventObj: BroadcastedEvent
): void => {
  const { event, data } = eventObj;

  log(`Broadcasting ${event}`);

  socket.to(room).emit(event, data);
};

export const initRoom = async (
  socket: SocketWithToken,
  gameId: string
): Promise<CreateRoomResponse> => {
  const token = socket.decoded_token;

  if (token.role !== Role.HOST) throw new Error('Not authorized');

  const game = await gameService.setGameStatus(gameId, GameStatus.WAITING);

  const roomGame: ActiveGame = {
    id: game._id.toString(),
    status: GameStatus.WAITING,
    type: game.type,
    price: game.price,
    startTime: game.startTime,
    players: game.players.map((player) => ({
      ...player,
      socket: null,
      online: false,
      answers: {} as Record<string, Record<string, string>>,
    })),
    info: null, // different game types will have different info objects
    rounds: game.rounds,
    hostOnline: true,
  };

  const jitsiRoom = uuidv4();

  roomService.createRoom(gameId, socket.id, roomGame, jitsiRoom);

  return {
    jitsiToken: getJitsiToken(token.username, jitsiRoom),
    game: roomGame,
    jitsiRoom,
  };
};

export const getJitsiToken = (username: string, jitsiRoom: string): string => {
  const tokenPayload = {
    context: {
      user: {
        name: username,
      },
    },
    aud: 'kotipelit.com',
    iss: 'kotipelit.com',
    sub: 'meet.kotipelit.com',
    room: jitsiRoom,
  };

  return jwt.sign(tokenPayload, config.JITSI_SECRET);
};

const attachTestListeners = (socket: SocketWithToken): void => {
  socket.on(TestEventType.JOIN_ROOM, (room: string) => {
    socket.join(room);
    socket.emit(TestEventType.ROOM_JOINED, room);
  });

  socket.on(TestEventType.GET_ROOMS, () => {
    socket.emit(TestEventType.ROOMS_RECEIVED, Object.keys(socket.rooms));
  });

  socket.on(
    TestEventType.BROADCAST_TO,
    (data: { room: string; event: string; message: string }) => {
      socket.to(data.room).emit(data.event, data.message);
    }
  );
};

export const attachListeners = (socket: SocketWithToken): void => {
  const { id, role } = socket.decoded_token;

  if (!id || !role) {
    console.error(`ID and Role must be defined, got ${id}, ${role}`);
  }

  // for testing
  if (process.env.NODE_ENV === 'test') attachTestListeners(socket);

  switch (role) {
    // host specific listeners
    case Role.HOST: {
      socket.on(EventType.JITSI_READY, (data: JitsiReadyData) =>
        callbacks.jitsiReady(socket, data)
      );

      socket.on(EventType.CREATE_ROOM, (gameId: string) => {
        void callbacks.createRoom(socket, gameId);
      });

      socket.on(EventType.START_GAME, (gameId: string) => {
        void callbacks.startGame(socket, gameId);
      });

      socket.on(EventType.UPDATE_GAME, (game: ActiveGame) => {
        callbacks.updateGame(socket, game);
      });

      socket.on(EventType.END_GAME, (gameId: string) => {
        void callbacks.endGame(socket, gameId);
      });

      break;
    }
    // player specific listeners
    case Role.PLAYER: {
      const { gameId } = socket.decoded_token;

      if (!gameId) console.error('Warning: token gameId not defined');

      socket.on(EventType.JOIN_GAME, () =>
        callbacks.joinGame(socket, gameId, id)
      );

      break;
    }
    default:
      console.error('Token role invalid or missing');
  }
};

const attachRTCListeners = (socket: SocketWithToken) => {
  log('attaching listeners');

  // can handle game types here

  socket.on('join-gameroom', (peerId: string) => {
    void callbacks.joinRTCRoom(socket, peerId);
  });

  socket.on('answer', (answerObj: Answer) => {
    void callbacks.handleAnswer(socket, answerObj);
  });

  socket.on(EventType.DISCONNECT, () => {
    void callbacks.leaveRTCRoom(socket);
  });

  if (socket.decoded_token.role === Role.HOST) {
    socket.on('launch', () => {
      void callbacks.launchRTCGame(socket);
    });

    socket.on('start', () => {
      void callbacks.startRTCGame(socket);
    });

    socket.on('update-game', (game: RTCGame) => {
      void callbacks.updateRTCGame(socket, game);
    });

    socket.on('timer', (value: number) => {
      void callbacks.handleTimerChange(socket, value);
    });
  }
};

const handleRTCConnection = (socket: SocketWithToken) => {
  const { gameId } = socket.decoded_token;

  log(`joining channel ${gameId}`);

  socket.join(gameId);

  attachRTCListeners(socket);
};

/**
 * Authenticates connection and attaches listeners to socket on success
 * @param io - socket.io server
 */
const handler = (io: Server): void => {
  io.of('/lobby').on(EventType.CONNECTION, (socket: SocketIOClient.Socket) => {
    console.log("socket connected to namespace '/'");

    socket.on('authenticate', () => {
      console.log('auth on public namespace!');
    });

    // use for lobby socket!

    socket.on('disconnect', () => {
      console.log('disconnected, nsp:', io.nsps);
    });
  });

  io.of('/')
    .on(
      EventType.CONNECTION,
      socketioJwt.authorize({
        secret: config.SECRET,
        timeout: 10000,
      })
    )
    .on(EventType.AUTHENTICATED, (socket: SocketWithToken) => {
      log(`user connected ${socket.decoded_token.username}`);

      if (socket.decoded_token.type === 'rtc') {
        log('using rtc');

        handleRTCConnection(socket);
      } else {
        attachListeners(socket);

        socket.on(EventType.DISCONNECT, () => {
          if (socket.decoded_token.role === Role.HOST) {
            callbacks.handleHostDisconnect(io, socket);
          } else {
            callbacks.handlePlayerDisconnect(io, socket);
          }
        });
      }
    });
};

export default handler;
