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
import gameService from '../games';
import rtcrooms from '../rtc/rtcrooms';
import twilioService from '../twilio';

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

    const joinedRoomGame = rtcrooms.joinRoom(socket);

    socket.emit('game-updated', joinedRoomGame);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

export const socketDisconnected = (
  socket: SocketWithToken,
  reason: string
): void => {
  logger.log(
    `recieved disconnect from ${socket.decodedToken.username}. reason: ${reason}. socket id: ${socket.id}`
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

  rtcrooms.leaveRoom(socket);

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

    const updatedGame = rtcrooms.updateRoomGame(gameId, {
      ...game,
      status: GameStatus.RUNNING,
    });

    emitUpdatedGame(socket, updatedGame);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

export const launchRTCGame = async (
  socket: SocketWithToken,
  setToken: (token: string) => void
): Promise<void> => {
  logger.log(`recieved 'launch' from ${socket.decodedToken.username}`);

  try {
    const { gameId, id } = socket.decodedToken;

    const game = rtcrooms.getRoomGame(gameId);

    if (!game) {
      throw new Error(`no game set when launching, id ${gameId}`);
    }

    let alreadyLaunched = false; // for dev purposes

    if (game.status !== GameStatus.UPCOMING) {
      logger.error(`game with id ${gameId} already launched`);

      alreadyLaunched = true;
    }

    const timeDifference = new Date(game.startTime).getTime() - Date.now();

    // check if difference is greater than 30 minutes
    if (timeDifference > 30 * 60 * 1000) {
      throw new Error(
        `game start time is over 30 minutes away! time until start: ${Math.round(
          timeDifference / 1000 / 60
        )} minutes`
      );
    }

    // do not update state if game has already been launched
    const updatedGameInDB = alreadyLaunched
      ? game
      : await gameService.setGameStatus(gameId, GameStatus.WAITING);

    // update player display names and game status
    const updatedGame = {
      ...game,
      status: updatedGameInDB.status,
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

    rtcrooms.updateRoomGame(gameId, updatedGame);

    emitUpdatedGame(socket, updatedGame);

    // access token for host
    const hostToken = twilioService.getVideoAccessToken(
      id,
      `kotipelit-${gameId}`
    );

    setToken(hostToken);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

export const getTwilioToken = (
  socket: SocketWithToken,
  setToken: (token: string) => void
): void => {
  logger.log(
    `recieved 'get-twilio-token' from ${socket.decodedToken.username}`
  );

  try {
    const { gameId, id } = socket.decodedToken;

    const token = twilioService.getVideoAccessToken(id, `kotipelit-${gameId}`);

    setToken(token);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
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

    const updatedPlayers = newGame.players.map((player) => {
      const matching = game.players.find(
        (oldPlayer) => oldPlayer.id === player.id
      );

      if (!matching) {
        logger.error(
          `unexpected: no matching player found for id '${player.id}' when updating game`
        );

        return player;
      }

      return {
        ...player,
        // do not update player privatedata (server has fresher socket id:s)
        privateData: matching.privateData,
      };
    });

    const updatedGame = {
      ...newGame,
      players: updatedPlayers,
    };

    rtcrooms.updateRoomGame(gameId, newGame);

    emitUpdatedGame(socket, updatedGame);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
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

    socket.emit('rtc-error', e.message);
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

    socket.emit('rtc-error', e.message);
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

    socket.emit('game-updated', filteredGame);
  } catch (e) {
    logger.error(e.message);
    socket.emit('rtc-error', e.message);
  }
};

export const handleAnswer = (socket: SocketWithToken, answer: Answer): void => {
  logger.log(`recieved 'answer' from ${socket.decodedToken.username}`);

  try {
    const { id, gameId } = socket.decodedToken;

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

    const updatedGame = rtcrooms.updateRoomGame(gameId, newGame);

    const hostSocketId = room.socketMap.get(room.game.host.id);

    if (hostSocketId) {
      socket.to(hostSocketId).emit('game-updated', updatedGame);
    }

    socket.emit('game-updated', gameService.filterGameForUser(updatedGame, id));
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

export const handleTimer = (
  socket: SocketWithToken,
  command: 'start' | 'stop' | 'reset'
): void => {
  try {
    const { gameId } = socket.decodedToken;

    const { timer } = rtcrooms.getRoomState(gameId);

    switch (command) {
      case 'start':
        timer.start();

        break;
      case 'stop':
        timer.stop();

        break;
      case 'reset':
        timer.reset();

        break;
    }
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

const emitUpdatedGame = (socket: SocketWithToken, newGame: RTCGame): void => {
  const room = rtcrooms.getRoom(newGame.id);

  if (!room) {
    throw new Error(
      `no room set when trying to emit updated game, game id ${newGame.id}`
    );
  }

  const { role } = socket.decodedToken;
  logger.log(`emitting game-updated`);

  // handle game types here
  if (newGame.type === GameType.KOTITONNI) {
    const emittedTo: string[] = []; // for debugging
    const didNotEmit: string[] = [];

    if (role === Role.HOST) {
      socket.emit('game-updated', newGame);

      // doesn't send other players' words
      newGame.players.forEach((player) => {
        const socketId = room.socketMap.get(player.id);

        if (socketId) {
          emittedTo.push(`${player.name} (${socketId})`);

          socket
            .to(socketId)
            .emit(
              'game-updated',
              gameService.filterGameForUser(newGame, player.id)
            );
        } else {
          didNotEmit.push(player.name);
        }
      });

      room.spectatorSockets.forEach((socketId) =>
        socket
          .to(socketId)
          .emit('game-updated', gameService.filterGameForSpectator(newGame))
      );
    }

    if (emittedTo.length) {
      logger.log(`emitted update to: ${emittedTo.join(' / ')}`);
    }

    if (didNotEmit.length) {
      logger.log(`players who had no socket set: ${didNotEmit.join(' / ')}`);
    }
  }
};
