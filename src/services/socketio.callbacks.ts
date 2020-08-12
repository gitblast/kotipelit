/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  JitsiReadyData,
  EventType,
  SocketWithToken,
  GameStatus,
  GameType,
  GameInfo,
  ActiveGame,
} from '../types';
import { log } from '../utils/logger';
import * as events from './socketio.events';
import { initRoom, setGameStatus, emit, broadcast } from './socketio';
import roomService from './rooms';
import Url from '../models/url';

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

export const createRoom = async (
  socket: SocketWithToken,
  roomId: string
): Promise<void> => {
  log(`Recieved ${EventType.CREATE_ROOM}`);

  try {
    const data = await initRoom(socket, roomId);

    roomService.addSocketToRoom(roomId, socket);
    emit(
      socket,
      events.createSuccess(data.game, data.jitsiToken, data.jitsiRoom)
    );
  } catch (error) {
    emit(socket, events.createFailure(error.message));
  }
};

export const getInitialInfo = (game: ActiveGame): GameInfo => {
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

export const startGame = async (
  socket: SocketWithToken,
  gameId: string
): Promise<void> => {
  log(`Recieved ${EventType.START_GAME}`);

  try {
    await setGameStatus(gameId, GameStatus.RUNNING);

    const game = roomService.getRoomGame(gameId);

    if (game.status === GameStatus.RUNNING)
      console.error(`Game with id '${gameId}' already running!`);

    const startedGame = roomService.updateRoomGame(gameId, {
      ...game,
      status: GameStatus.RUNNING,
      info: getInitialInfo(game),
    });

    broadcast(socket, gameId, events.gameStarting(startedGame));
    emit(socket, events.startSuccess(startedGame));
  } catch (error) {
    emit(socket, events.startFailure(error.message));
  }
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

export const endGame = async (
  socket: SocketWithToken,
  gameId: string
): Promise<void> => {
  log(`Recieved ${EventType.END_GAME}`);

  try {
    const game = roomService.getRoomGame(gameId);

    for (const player of game.players) {
      await Url.deleteOne({ playerId: player.id, gameId: gameId });
    }

    roomService.deleteRoom(gameId);
    emit(socket, events.deleteSuccess());
    broadcast(socket, gameId, events.gameEnded());
  } catch (error) {
    emit(socket, events.deleteFailure(error.message));
  }
};
