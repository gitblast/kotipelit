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

  roomService.createRoom(gameId, socket, roomGame);

  return jwt.sign('TODO', 'TODO');
};

export const createSuccess = (jitsiToken: string): EmittedEvent => ({
  event: EventType.CREATE_SUCCESS,
  data: jitsiToken,
});

export const createFailure = (): EmittedEvent => ({
  event: EventType.CREATE_FAILURE,
  data: { error: 'error message' },
});

const emit = (socket: Socket, eventObj: EmittedEvent): void => {
  const { event, data } = eventObj;
  socket.emit(event, data);
};

const handler = (io: Server): void => {
  io.on(
    'connection',
    socketioJwt.authorize({
      secret: config.SECRET,
      timeout: 10000,
    })
  ).on('authenticated', (socket: SocketWithToken) => {
    switch (socket.decoded_token.role) {
      // host specific listeners
      case Role.HOST: {
        socket.on(EventType.CREATE_ROOM, (data: CreateRoomData) => {
          initRoom(socket, data.gameId)
            .then((token: string) => {
              roomService.addSocketToRoom(data.gameId, socket);
              emit(socket, createSuccess(token));
            })
            .catch(() => emit(socket, createFailure()));
        });

        break;
      }
      // player specific listeners
      case Role.PLAYER: {
        console.log('a player connected');
        break;
      }
      default:
        throw new Error('Token role invalid or missing');
    }

    // common listeners
  });
};

export default handler;
