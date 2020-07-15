/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  JitsiReadyData,
  EventType,
  EmittedEvent,
  BroadcastedEvent,
  SocketWithToken,
  GameStatus,
  CreateRoomResponse,
  GameType,
  GameInfo,
  ActiveGame,
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
      emit(
        socket,
        events.createSuccess(data.game, data.jitsiToken, data.jitsiRoom)
      );
    })
    .catch((error: Error) => emit(socket, events.createFailure(error.message)));
};

const getInitialInfo = (game: ActiveGame): GameInfo => {
  /** handle different game types here */
  switch (game.type) {
    case GameType.SANAKIERTO: {
      if (!game.players || !game.players.length)
        throw new Error('Game has no players set');

      const playerWithTurn = game.players[0];

      return {
        round: 1,
        turn: playerWithTurn.id,
      };
    }
    default: {
      const gameType: string = game.type;
      throw new Error(`Invalid game type: ${gameType}`);
    }
  }
};

export const startGame = (socket: SocketWithToken, gameId: string): void => {
  log(`Recieved ${EventType.START_GAME}`);
  setGameStatus(gameId, GameStatus.RUNNING)
    .then(() => {
      const game = roomService.getRoomGame(gameId);

      if (!game) throw new Error(`No game found for room '${gameId}'`);
      if (game.status === GameStatus.RUNNING)
        console.error(`Game with id '${gameId}' already running!`);

      const startedGame = roomService.updateRoomGame(gameId, {
        ...game,
        status: GameStatus.RUNNING,
        info: getInitialInfo(game),
      });

      broadcast(socket, gameId, events.gameStarting(startedGame));
      emit(socket, events.startSuccess(startedGame));
    })
    .catch((error: Error) => {
      emit(socket, events.startFailure(error.message));
    });
};

export const updateGame = (socket: SocketWithToken, game: ActiveGame): void => {
  log(`Recieved ${EventType.UPDATE_GAME}`);

  try {
    const updated = roomService.updateRoomGame(game.id, game);
    broadcast(socket, game.id, events.gameUpdated(game));
    emit(socket, events.updateSuccess(updated));
  } catch (error) {
    emit(socket, events.updateFailure(error.message));
  }
};

export const joinGame = (
  socket: SocketWithToken,
  gameId: string,
  playerId: string
): void => {
  log(`Recieved ${EventType.JOIN_GAME}`);

  try {
    roomService.addSocketToRoom(gameId, socket);
    const game = roomService.joinRoom(gameId, playerId, socket.id);
    const jitsiRoom = roomService.getJitsiRoomByRoomId(gameId);
    emit(socket, events.joinSuccess(game, jitsiRoom));
    broadcast(socket, gameId, events.playerJoined(playerId));
  } catch (error) {
    emit(socket, events.joinFailure(error.message));
  }
};
