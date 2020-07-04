/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  JitsiReadyData,
  EventType,
  EmittedEvent,
  BroadcastedEvent,
  SocketWithToken,
  GameStatus,
  CreateRoomResponse,
} from '../types';
import { log } from '../utils/logger';
import { Socket } from 'socket.io';
import * as events from './socketio.events';
import { initRoom, setGameStatus } from './socketio';
import roomService from './rooms';

const emit = (socket: Socket, eventObj: EmittedEvent): void => {
  const { event, data } = eventObj;

  log(`Emitting ${event}`);

  socket.emit(event, data);
};

const broadcast = (
  socket: Socket,
  room: string,
  eventObj: BroadcastedEvent
): void => {
  const { event, data } = eventObj;

  log(`Broadcasting ${event}`);

  socket.to(room).emit(event, data);
};

export const jitsiReady = (
  socket: SocketWithToken,
  data: JitsiReadyData
): void => {
  log(`Recieved ${EventType.JITSI_READY}`);
  try {
    roomService.setJitsiRoom(data.gameId, data.jitsiRoom);
    broadcast(socket, data.gameId, events.gameReady(data.jitsiRoom));
  } catch (error) {
    console.error(error.message);
  }
};

export const createRoom = (socket: SocketWithToken, roomId: string): void => {
  log(`Recieved ${EventType.CREATE_ROOM}`);
  initRoom(socket, roomId)
    .then((data: CreateRoomResponse) => {
      roomService.addSocketToRoom(roomId, socket);
      emit(socket, events.createSuccess(data.game, data.jitsiToken));
    })
    .catch((error: Error) => emit(socket, events.createFailure(error.message)));
};

export const startGame = (socket: SocketWithToken, gameId: string): void => {
  log(`Recieved ${EventType.START_GAME}`);
  setGameStatus(gameId, GameStatus.RUNNING)
    .then(() => {
      const game = roomService.getRoomGame(gameId);

      if (!game) throw new Error(`No game found for room '${gameId}'`);
      if (game.status === GameStatus.RUNNING)
        throw new Error(`Game with id '${gameId}' already running!`);

      roomService.updateRoomGame(gameId, {
        ...game,
        status: GameStatus.RUNNING,
      });

      broadcast(socket, gameId, events.gameStarting());
      emit(socket, events.startSuccess());
    })
    .catch((error: Error) => {
      emit(socket, events.startFailure(error.message));
    });
};

export const joinGame = (
  socket: SocketWithToken,
  gameId: string,
  playerId: string
): void => {
  log(`Recieved ${EventType.JOIN_GAME}`);

  console.log('TODO: check for duplicate joins');

  roomService.addSocketToRoom(gameId, socket);

  try {
    const game = roomService.joinRoom(gameId, playerId, socket);
    const jitsiRoom = roomService.getJitsiRoomByRoomId(gameId);
    broadcast(socket, gameId, events.playerJoined(playerId));
    emit(socket, events.joinSuccess(game, jitsiRoom));
  } catch (error) {
    emit(socket, events.joinFailure(error.message));
  }
};
