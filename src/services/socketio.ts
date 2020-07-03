/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Game from '../models/game';

import { Server, Socket } from 'socket.io';
import socketioJwt from 'socketio-jwt';
import config from '../utils/config';
import jwt from 'jsonwebtoken';

import {
  GameStatus,
  ActiveGame,
  EmittedEvent,
  EventType,
  SocketWithToken,
  Role,
  JitsiReadyData,
  BroadcastedEvent,
  TestEventType,
  ActiveGameWithoutSockets,
  GameModel,
} from '../types';

import roomService from './rooms';

export const initRoom = async (
  socket: SocketWithToken,
  gameId: string
): Promise<string> => {
  if (socket.decoded_token.role !== Role.HOST)
    throw new Error('Not authorized');

  const game = await setGameStatus(gameId, GameStatus.WAITING);

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

const setGameStatus = async (
  gameId: string,
  newStatus: GameStatus
): Promise<GameModel> => {
  const game = await Game.findById(gameId);

  if (!game) throw new Error(`No game found with id ${gameId}`);

  game.status = newStatus;

  return await game.save();
};

export const createSuccess = (jitsiToken: string): EmittedEvent => ({
  event: EventType.CREATE_SUCCESS,
  data: jitsiToken,
});

export const createFailure = (message: string): EmittedEvent => ({
  event: EventType.CREATE_FAILURE,
  data: { error: message },
});

export const startSuccess = (): EmittedEvent => ({
  event: EventType.START_SUCCESS,
  data: null,
});

export const startFailure = (message: string): EmittedEvent => ({
  event: EventType.START_FAILURE,
  data: { error: message },
});

export const joinSuccess = (game: ActiveGameWithoutSockets): EmittedEvent => ({
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

export const playerJoined = (id: string): BroadcastedEvent => ({
  event: EventType.PLAYER_JOINED,
  data: id,
});

export const gameStarting = (): BroadcastedEvent => ({
  event: EventType.GAME_STARTING,
  data: null,
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
    const { gameId, id, role } = socket.decoded_token;

    // for testing
    if (process.env.NODE_ENV === 'test') attachTestListeners(socket);

    switch (role) {
      // host specific listeners
      case Role.HOST: {
        socket.on(EventType.JITSI_READY, (data: JitsiReadyData) => {
          broadcast(socket, data.gameId, gameReady(data.jitsiRoom));
        });

        socket.on(EventType.CREATE_ROOM, () => {
          initRoom(socket, gameId)
            .then((token: string) => {
              roomService.addSocketToRoom(gameId, socket);
              emit(socket, createSuccess(token));
            })
            .catch((error) => emit(socket, createFailure(error.message)));
        });

        socket.on(EventType.START_GAME, () => {
          setGameStatus(gameId, GameStatus.RUNNING)
            .then(() => {
              const game = roomService.getRoomGame(gameId);

              if (!game) throw new Error(`No game found for room '${gameId}'`);

              roomService.updateRoomGame(gameId, {
                ...game,
                status: GameStatus.RUNNING,
              });

              broadcast(socket, gameId, gameStarting());
              emit(socket, startSuccess());
            })
            .catch((error) => {
              emit(socket, startFailure(error.message));
            });
        });

        break;
      }
      // player specific listeners
      case Role.PLAYER: {
        socket.on(EventType.JOIN_GAME, () => {
          roomService.addSocketToRoom(gameId, socket);

          try {
            const game = roomService.joinRoom(gameId, id, socket);
            broadcast(socket, gameId, playerJoined(id));
            emit(socket, joinSuccess(game));
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
