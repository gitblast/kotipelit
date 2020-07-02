/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Game from '../models/game';

import { Server, Socket } from 'socket.io';
import socketioJwt from 'socketio-jwt';
import config from '../utils/config';
import jwt from 'jsonwebtoken';

import {
  CreateRoomData,
  GameStatus,
  ActiveGame,
  EmittedEvent,
  EventType,
  SocketWithToken,
  Role,
  JitsiReadyData,
  BroadcastedEvent,
  TestEventType,
} from '../types';

import roomService from './rooms';

export const initRoom = async (
  socket: SocketWithToken,
  gameId: string
): Promise<string> => {
  if (socket.decoded_token.role !== Role.HOST)
    throw new Error('Not authorized');

  const game = await Game.findById(gameId);

  if (!game) throw new Error(`No game found with id ${gameId}`);

  game.status = GameStatus.WAITING;

  await game.save();

  const roomGame: ActiveGame = {
    id: game._id.toString(),
    status: GameStatus.WAITING,
    type: game.type,
    startTime: game.startTime,
    players: game.players.map((player) => ({
      ...player,
      socket: null,
    })),
  };

  roomService.createRoom(gameId, socket.id, roomGame);

  return jwt.sign('TODO', 'TODO');
};

export const createSuccess = (jitsiToken: string): EmittedEvent => ({
  event: EventType.CREATE_SUCCESS,
  data: jitsiToken,
});

export const createFailure = (message: string): EmittedEvent => ({
  event: EventType.CREATE_FAILURE,
  data: { error: message },
});

export const joinSuccess = (game: ActiveGame): EmittedEvent => ({
  event: EventType.JOIN_SUCCESS,
  data: game,
});

export const joinFailure = (message: string): EmittedEvent => ({
  event: EventType.JOIN_FAILURE,
  data: { error: message },
});

export const gameReady = (jitsiRoom: string): BroadcastedEvent => ({
  event: EventType.GAME_READY,
  data: jitsiRoom,
});

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

const emit = (socket: Socket, eventObj: EmittedEvent): void => {
  const { event, data } = eventObj;

  socket.emit(event, data);
};

const broadcast = (
  socket: Socket,
  room: string,
  eventObj: BroadcastedEvent
): void => {
  const { event, data } = eventObj;
  socket.to(room).emit(event, data);
};

const handler = (io: Server): void => {
  io.on(
    'connection',
    socketioJwt.authorize({
      secret: config.SECRET,
      timeout: 10000,
    })
  ).on('authenticated', (socket: SocketWithToken) => {
    const decodedToken = socket.decoded_token;

    // for testing
    if (process.env.NODE_ENV === 'test') attachTestListeners(socket);

    switch (decodedToken.role) {
      // host specific listeners
      case Role.HOST: {
        socket.on(EventType.JITSI_READY, (data: JitsiReadyData) => {
          broadcast(socket, data.gameId, gameReady(data.jitsiRoom));
        });

        socket.on(EventType.CREATE_ROOM, (data: CreateRoomData) => {
          initRoom(socket, data.gameId)
            .then((token: string) => {
              roomService.addSocketToRoom(data.gameId, socket);
              emit(socket, createSuccess(token));
            })
            .catch((error) => emit(socket, createFailure(error.message)));
        });

        break;
      }
      // player specific listeners
      case Role.PLAYER: {
        socket.on(EventType.JOIN_GAME, () => {
          const { gameId, id } = decodedToken;

          roomService.addSocketToRoom(gameId, socket);

          try {
            const game = roomService.joinRoom(gameId, id, socket);
            console.log(game);
            emit(socket, joinSuccess({} as ActiveGame));
          } catch (error) {
            emit(socket, joinFailure(error.message));
          }
        });

        break;
      }
      default:
        throw new Error('Token role invalid or missing');
    }

    // common listeners
  });
};

export default handler;
