/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  JitsiReadyData,
  EventType,
  SocketWithToken,
  GameStatus,
  ActiveGame,
} from '../types';
import { log } from '../utils/logger';
import * as events from './socketio.events';
import { initRoom, emit, broadcast } from './socketio';
import roomService from './rooms';
import Url from '../models/url';
import gameService from '../services/games';
import { Server } from 'socket.io';

export const handleDisconnect = (io: Server, socket: SocketWithToken): void => {
  log(`Recieved ${EventType.DISCONNECT}`);

  try {
    const gameId = socket.decoded_token.gameId;

    const room = roomService.getRooms()[gameId];

    if (!room) throw new Error(`No room found with id '${gameId}'`);

    if (socket.id === room.hostSocket) {
      log(`emitting host disconnected to room ${gameId}`);

      room.game.hostOnline = false;

      io.to(gameId).emit(EventType.HOST_DISCONNECTED);
    } else {
      const player = roomService.leaveRoom(gameId, socket.id);

      log(`emitting player '${player.id}' disconnected to room ${gameId}`);

      io.to(gameId).emit(EventType.PLAYER_DISCONNECTED, player.id);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(error.message);
    }
  }
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

export const createRoom = async (
  socket: SocketWithToken,
  roomId: string
): Promise<void> => {
  log(`Recieved ${EventType.CREATE_ROOM}`);

  try {
    // check if room already exists
    let data = roomService.getRoomData(socket.decoded_token.username, roomId);

    if (!data) {
      log('creating a new room');
      data = await initRoom(socket, roomId);
    } else {
      log('existing room found. joining');
    }

    roomService.addSocketToRoom(roomId, socket);
    emit(
      socket,
      events.createSuccess(data.game, data.jitsiToken, data.jitsiRoom)
    );
  } catch (error) {
    emit(socket, events.createFailure(error.message));
  }
};

export const startGame = async (
  socket: SocketWithToken,
  gameId: string
): Promise<void> => {
  log(`Recieved ${EventType.START_GAME}`);

  try {
    await gameService.setGameStatus(gameId, GameStatus.RUNNING);

    const game = roomService.getRoomGame(gameId);

    if (game.status === GameStatus.RUNNING)
      console.error(`Game with id '${gameId}' already running!`);

    const startedGame = roomService.updateRoomGame(gameId, {
      ...game,
      status: GameStatus.RUNNING,
      info: gameService.getInitialInfo(game),
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

    // save results to db
    await gameService.saveFinishedGame(gameId, game);

    roomService.deleteRoom(gameId);
    emit(socket, events.endSuccess(gameId));
    broadcast(socket, gameId, events.gameEnded());
  } catch (error) {
    emit(socket, events.endFailure(error.message));
  }
};
