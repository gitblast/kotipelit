/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  JitsiReadyData,
  EventType,
  SocketWithToken,
  GameStatus,
  ActiveGame,
  Role,
  RTCGame,
  GameType,
  RTCPlayer,
  Answer,
} from '../../types';
import logger from '../../utils/logger';
import * as events from './socketio.events';
import { initRoom, emit, broadcast } from '.';
import roomService from '../rooms';
import Url from '../../models/url';
import gameService from '../../services/games';
import { Server, Socket } from 'socket.io';
import rtcrooms from '../rtc/rtcrooms';

export const handleHostDisconnect = (io: Server, socket: Socket): void => {
  logger.log(`Recieved ${EventType.DISCONNECT}`);

  try {
    const rooms = roomService.getRooms();

    const room = Object.values(rooms).find(
      (room) => room.hostSocket === socket.id
    );

    if (!room) {
      throw new Error(
        `No room found with host socket id '${socket.id}. If game has already ended, this is expected'`
      );
    }

    logger.log(
      `host disconnected, emitting update game to room ${room.game.id}`
    );
    room.game.hostOnline = false;

    const { event, data } = events.gameUpdated(room.game);

    io.to(room.game.id).emit(event, data);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(error.message);
    }
  }
};

export const handlePlayerDisconnect = (
  io: Server,
  socket: SocketWithToken
): void => {
  logger.log(`Recieved ${EventType.DISCONNECT}`);

  try {
    const gameId = socket.decoded_token.gameId;

    const room = roomService.getRooms()[gameId];

    if (!room) throw new Error(`No room found with id '${gameId}'`);

    const player = roomService.leaveRoom(gameId, socket.id);

    logger.log(
      `player '${player.id}' disconnected, emitting update game to room ${gameId}`
    );

    const { event, data } = events.gameUpdated(room.game);

    io.to(gameId).emit(event, data);
  } catch (error) {
    if (process.env.NODE_ENV !== 'test') {
      logger.error(error.message);
    }
  }
};

export const jitsiReady = (
  socket: SocketWithToken,
  data: JitsiReadyData
): void => {
  logger.log(`Recieved ${EventType.JITSI_READY}`);

  try {
    broadcast(socket, data.gameId, events.gameReady(data.jitsiRoom));
  } catch (error) {
    logger.error(error.message);
  }
};

export const createRoom = async (
  socket: SocketWithToken,
  roomId: string
): Promise<void> => {
  logger.log(`Recieved ${EventType.CREATE_ROOM}`);

  try {
    // check if room already exists
    let data = roomService.getRoomData(socket.decoded_token.username, roomId);

    if (!data) {
      logger.log('creating a new room');
      data = await initRoom(socket, roomId);
    } else {
      logger.log('existing room found. joining');

      // update host socket and status
      roomService.setHostOnline(roomId, true);
      roomService.setHostSocket(roomId, socket.id);
    }

    roomService.addSocketToRoom(roomId, socket);
    emit(
      socket,
      events.createSuccess(data.game, data.jitsiToken, data.jitsiRoom)
    );

    broadcast(socket, roomId, events.gameUpdated(data.game));
  } catch (error) {
    emit(socket, events.createFailure(error.message));
  }
};

export const startGame = async (
  socket: SocketWithToken,
  gameId: string
): Promise<void> => {
  logger.log(`Recieved ${EventType.START_GAME}`);

  try {
    await gameService.setGameStatus(gameId, GameStatus.RUNNING);

    const game = roomService.getRoomGame(gameId);

    if (game.status === GameStatus.RUNNING)
      logger.error(`Game with id '${gameId}' already running!`);

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
  logger.log(`Recieved ${EventType.UPDATE_GAME}`);

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
  logger.log(`Recieved ${EventType.JOIN_GAME}`);

  try {
    roomService.addSocketToRoom(gameId, socket);
    const game = roomService.joinRoom(gameId, playerId, socket.id);
    const jitsiRoom = roomService.getJitsiRoomByRoomId(gameId);
    emit(socket, events.joinSuccess(game, jitsiRoom));
    broadcast(socket, gameId, events.gameUpdated(game));
  } catch (error) {
    emit(socket, events.joinFailure(error.message));
  }
};

export const endGame = async (
  socket: SocketWithToken,
  gameId: string
): Promise<void> => {
  logger.log(`Recieved ${EventType.END_GAME}`);

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

// RTC

export const joinRTCRoom = async (
  socket: SocketWithToken,
  peerId: string
): Promise<void> => {
  logger.log(`recieved 'join-gameroom' from ${socket.decoded_token.username}`);

  try {
    const { gameId, id, role } = socket.decoded_token;

    const existingRoom = rtcrooms.getRoom(gameId);

    if (!existingRoom) {
      const game = await gameService.getGameById(gameId);

      const rtcGame = gameService.convertToRTCGame(game);

      rtcrooms.createRoom(rtcGame);
    }

    const joinedRoom = rtcrooms.joinRoom(socket, peerId);

    let self;

    if (role === Role.HOST) {
      self = joinedRoom.host;
    } else {
      self = joinedRoom.players.find((player) => player.id === id);
    }

    // hide invite codes if not host
    const returnedRoom =
      role === Role.HOST
        ? joinedRoom
        : {
            ...joinedRoom,
            game: {
              ...joinedRoom.game,
              players: joinedRoom.game.players.map((player) => ({
                ...player,
                inviteCode: undefined,
              })),
            },
          };

    socket.emit('room-joined', returnedRoom);
    socket.to(gameId).emit('user-joined', self);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const leaveRTCRoom = (socket: SocketWithToken): void => {
  logger.log(`recieved disconnect from ${socket.decoded_token.username}`);

  const { id, gameId } = socket.decoded_token;

  rtcrooms.leaveRoom(gameId, id);

  socket.to(gameId).emit('user-left', id);
};

export const startRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'start' from ${socket.decoded_token.username}`);

  try {
    const { gameId } = socket.decoded_token;

    const room = rtcrooms.getRoom(gameId);

    if (!room) {
      throw new Error(`no room set when starting game, id ${gameId}`);
    }

    if (room.game.status !== GameStatus.WAITING) {
      throw new Error(`game with id ${gameId} already started`);
    }

    await gameService.setGameStatus(gameId, GameStatus.RUNNING);

    const updatedGame = rtcrooms.updateRoomGame(gameId, {
      ...room.game,
      status: GameStatus.RUNNING,
    });

    emitUpdatedGame(socket, updatedGame, room.players);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const launchRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'launch' from ${socket.decoded_token.username}`);

  try {
    const { gameId } = socket.decoded_token;

    const room = rtcrooms.getRoom(gameId);

    if (!room) {
      throw new Error(`no room set when starting game, id ${gameId}`);
    }

    if (room.game.status !== GameStatus.UPCOMING) {
      throw new Error(`game with id ${gameId} already launched`);
    }

    await gameService.setGameStatus(gameId, GameStatus.WAITING);

    const updatedGame = rtcrooms.updateRoomGame(gameId, {
      ...room.game,
      status: GameStatus.WAITING,
    });

    emitUpdatedGame(socket, updatedGame, room.players);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const updateRTCGame = (socket: SocketWithToken, game: RTCGame): void => {
  logger.log(`recieved 'update-game' from ${socket.decoded_token.username}`);

  try {
    const { gameId } = socket.decoded_token;

    const room = rtcrooms.getRoom(gameId);

    if (!room) {
      throw new Error(`no room set when updating game, id ${gameId}`);
    }

    const updatedGame = rtcrooms.updateRoomGame(gameId, game);

    emitUpdatedGame(socket, updatedGame, room.players);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const handleTimerChange = (
  socket: SocketWithToken,
  value: number
): void => {
  // log(`recieved 'timer' from ${socket.decoded_token.username}`);

  try {
    const { gameId } = socket.decoded_token;

    socket.to(gameId).emit('timer-changed', value);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const handleAnswer = (socket: SocketWithToken, answer: Answer): void => {
  logger.log(`recieved 'answer' from ${socket.decoded_token.username}`);

  try {
    const { id, gameId } = socket.decoded_token;

    const room = rtcrooms.getRoom(gameId);

    if (!room) {
      throw new Error(`no room set when trying to answer, game id ${gameId}`);
    }

    const newGame = {
      ...room.game,
      players: room.game.players.map((player) => {
        return player.id === id
          ? {
              ...player,
              answers: {
                ...player.answers,
                [answer.info.turn]: {
                  ...player.answers[answer.info.turn],
                  [answer.info.round]: answer.answer,
                },
              },
            }
          : player;
      }),
    };

    const updatedGame = rtcrooms.updateRoomGame(gameId, newGame);

    const hostSocketId = room.host.socketId;

    if (hostSocketId) {
      socket.to(hostSocketId).emit(EventType.GAME_UPDATED, updatedGame);
    }

    socket.emit(
      EventType.GAME_UPDATED,
      rtcrooms.filterGameForPlayer(updatedGame, id)
    );
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

const emitUpdatedGame = (
  socket: SocketWithToken,
  newGame: RTCGame,
  peers: RTCPlayer[]
): void => {
  const { id, role } = socket.decoded_token;
  logger.log(`emitting game updated`);

  // handle game types here
  if (newGame.type === GameType.KOTITONNI) {
    if (role === Role.HOST) {
      socket.emit(EventType.GAME_UPDATED, newGame);

      // doesn't send other players' words, also dont send them to self
      peers.forEach((peer) => {
        if (peer.id !== id && peer.socketId) {
          socket
            .to(peer.socketId)
            .emit(
              EventType.GAME_UPDATED,
              rtcrooms.filterGameForPlayer(newGame, peer.id)
            );
        }
      });
    }
  }
};
