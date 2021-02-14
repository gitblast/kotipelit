/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  SocketWithToken,
  GameStatus,
  Role,
  RTCGame,
  GameType,
  Answer,
} from '../../types';
import logger from '../../utils/logger';
import gameService from '../../services/games';
import rtcrooms from '../rtc/rtcrooms';

// RTC

export const joinRTCRoom = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'join-gameroom' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const existingRoom = rtcrooms.getRoomGame(gameId);

    if (!existingRoom) {
      const game = await gameService.getGameById(gameId);

      if (game.status === GameStatus.FINISHED) {
        throw new Error('cannot join, game status is finished!');
      }

      const rtcGame = gameService.convertToRTCGame(game);

      rtcrooms.createRoom(rtcGame);
    }

    const joinedRoom = rtcrooms.joinRoom(socket);

    socket.emit('room-joined', joinedRoom);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const socketDisconnected = (
  socket: SocketWithToken,
  reason: string
): void => {
  logger.log(
    `recieved disconnect from ${socket.decodedToken.username}. reason: ${reason}`
  );

  const { id, gameId } = socket.decodedToken;

  if (reason !== 'Ping timeout') {
    // emit user-left?host
  }

  socket.to(gameId).emit('user-socket-disconnected', id);
};

export const leaveRTCRoom = (socket: SocketWithToken): void => {
  logger.log(`recieved leave-room from ${socket.decodedToken.username}`);

  const { id, gameId } = socket.decodedToken;

  rtcrooms.leaveRoom(gameId, id);

  socket.to(gameId).emit('user-left', id);
};

export const startRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'start' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const game = rtcrooms.getRoomGame(gameId);

    if (!game) {
      throw new Error(`no game set when starting, id ${gameId}`);
    }

    if (game.status !== GameStatus.WAITING) {
      throw new Error(`game with id ${gameId} already started`);
    }

    await gameService.setGameStatus(gameId, GameStatus.RUNNING);

    const updatedGame = rtcrooms.updateRoom(gameId, {
      ...game,
      status: GameStatus.RUNNING,
    });

    emitUpdatedGame(socket, updatedGame);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const launchRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'launch' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const game = rtcrooms.getRoomGame(gameId);

    if (!game) {
      throw new Error(`no game set when launching, id ${gameId}`);
    }

    if (game.status !== GameStatus.UPCOMING) {
      throw new Error(`game with id ${gameId} already launched`);
    }

    const updatedGameInDB = await gameService.setGameStatus(
      gameId,
      GameStatus.WAITING
    );

    // update player display names and game status
    const updatedGame = {
      ...game,
      status: GameStatus.WAITING,
      players: game.players.map((player) => {
        const matching = updatedGameInDB.players.find(
          (p) => p.id === player.id
        );

        if (!matching || player.name === matching.name) {
          return player;
        }

        logger.log(`updating name for player '${matching.name}'`);

        return {
          ...player,
          name: matching.name,
        };
      }),
    };

    rtcrooms.updateRoom(gameId, updatedGame);

    emitUpdatedGame(socket, updatedGame);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const updateRTCGame = (
  socket: SocketWithToken,
  newGame: RTCGame
): void => {
  logger.log(`recieved 'update-game' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const game = rtcrooms.getRoomGame(gameId);

    if (!game) {
      throw new Error(`no game set when updating, id ${gameId}`);
    }

    const updatedGame = rtcrooms.updateRoom(gameId, newGame);

    emitUpdatedGame(socket, updatedGame);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const endRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'end' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const game = rtcrooms.getRoomGame(gameId);

    if (!game) {
      throw new Error(`no game set when ending, id ${gameId}`);
    }

    logger.log('saving finished game to db');

    // save to db
    await gameService.saveFinishedGame(gameId, game);

    logger.log(`deleting room... `);

    const success = rtcrooms.deleteRoom(gameId);

    logger.log(success ? 'delete succesful' : 'delete failed');

    socket.to(gameId).emit('game-ended');
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

export const handleTimerChange = (
  socket: SocketWithToken,
  value: number
): void => {
  // log(`recieved 'timer' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    socket.to(gameId).emit('timer-changed', value);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

const logRecievedMsg = (event: string, socket: SocketWithToken): void => {
  logger.log(`recieved '${event}' from ${socket.decodedToken.username}`);
};

export const getRoomGame = (socket: SocketWithToken): void => {
  logRecievedMsg('get-room-game', socket);

  try {
    const { gameId, id } = socket.decodedToken;

    const game = rtcrooms.getRoomGame(gameId);

    if (!game) {
      throw new Error(`no game set when trying to get room id ${gameId}`);
    }

    const filteredGame = gameService.filterGameForUser(game, id);

    socket.emit('game updated', filteredGame);
  } catch (e) {
    logger.error(e.message);
    socket.emit('rtc_error', e.message);
  }
};

export const handleAnswer = (socket: SocketWithToken, answer: Answer): void => {
  logger.log(`recieved 'answer' from ${socket.decodedToken.username}`);

  try {
    const { id, gameId } = socket.decodedToken;

    const game = rtcrooms.getRoomGame(gameId);

    if (!game) {
      throw new Error(`no game set when trying to answer, game id ${gameId}`);
    }

    const newGame = {
      ...game,
      players: game.players.map((player) => {
        return player.id === id
          ? {
              ...player,
              privateData: {
                ...player.privateData,
                answers: {
                  ...player.privateData.answers,
                  [answer.info.turn]: {
                    ...player.privateData.answers[answer.info.turn],
                    [answer.info.round]: answer.answer,
                  },
                },
              },
            }
          : player;
      }),
    };

    const updatedGame = rtcrooms.updateRoom(gameId, newGame);

    const hostSocketId = game.host.socketId;

    if (hostSocketId) {
      socket.to(hostSocketId).emit('game updated', updatedGame);
    }

    socket.emit('game updated', gameService.filterGameForUser(updatedGame, id));
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc_error', e.message);
  }
};

const emitUpdatedGame = (socket: SocketWithToken, newGame: RTCGame): void => {
  const { id, role } = socket.decodedToken;
  logger.log(`emitting game updated`);

  // handle game types here
  if (newGame.type === GameType.KOTITONNI) {
    if (role === Role.HOST) {
      socket.emit('game updated', newGame);

      // doesn't send other players' words, also dont send them to self
      newGame.players.forEach((player) => {
        if (player.id !== id && player.privateData.socketId) {
          socket
            .to(player.privateData.socketId)
            .emit(
              'game updated',
              gameService.filterGameForUser(newGame, player.id)
            );
        }
      });
    }
  }
};
