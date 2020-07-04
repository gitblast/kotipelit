/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Game from '../models/game';

import { Server } from 'socket.io';
import socketioJwt from 'socketio-jwt';
import config from '../utils/config';
import { log } from '../utils/logger';
import jwt from 'jsonwebtoken';
import * as callbacks from './socketio.callbacks';

import {
  GameStatus,
  ActiveGame,
  EventType,
  SocketWithToken,
  Role,
  JitsiReadyData,
  TestEventType,
  GameModel,
} from '../types';

import roomService from './rooms';

export const initRoom = async (
  socket: SocketWithToken,
  gameId: string
): Promise<string> => {
  if (socket.decoded_token.role !== Role.HOST)
    throw new Error('Not authorized');

  console.log('todo: check if room is already created');

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

export const setGameStatus = async (
  gameId: string,
  newStatus: GameStatus
): Promise<GameModel> => {
  const game = await Game.findById(gameId);

  if (!game) throw new Error(`No game found with id ${gameId}`);

  game.status = newStatus;

  return await game.save();
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

const handler = (io: Server): void => {
  io.on(
    EventType.CONNECTION,
    socketioJwt.authorize({
      secret: config.SECRET,
      timeout: 10000,
    })
  ).on(EventType.AUTHENTICATED, (socket: SocketWithToken) => {
    log('user connected');

    const { id, role } = socket.decoded_token;

    if (!id || !role) {
      console.error(`PlayerID and Role must be defined, got ${id}, ${role}`);
    }

    // for testing
    if (process.env.NODE_ENV === 'test') attachTestListeners(socket);

    switch (role) {
      // host specific listeners
      case Role.HOST: {
        socket.on(EventType.JITSI_READY, (data: JitsiReadyData) =>
          callbacks.jitsiReady(socket, data)
        );

        socket.on(EventType.CREATE_ROOM, (data: string) =>
          callbacks.createRoom(socket, data)
        );

        socket.on(EventType.START_GAME, (gameId: string) =>
          callbacks.startGame(socket, gameId)
        );

        break;
      }
      // player specific listeners
      case Role.PLAYER: {
        const { gameId } = socket.decoded_token;

        if (!gameId) console.error('Token gameId not defined');

        socket.on(EventType.JOIN_GAME, () =>
          callbacks.joinGame(socket, gameId, id)
        );

        break;
      }
      default:
        console.error('Token role invalid or missing');
    }

    // common listeners
  });
};

export default handler;
