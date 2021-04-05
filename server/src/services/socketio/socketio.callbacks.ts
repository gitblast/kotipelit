/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Answer,
  GameModel,
  GameStatus,
  GameType,
  Role,
  RTCGame,
  SocketWithToken,
} from '../../types';
import { filterGameForSpectator, filterGameForUser } from '../../utils/helpers';
import logger from '../../utils/logger';
import { TimerData } from '../../utils/timer';
import gameService from '../games';
import roomService from '../rooms';
import twilioService from '../twilio';
import urlService from '../urls';

// RTC

export const joinRTCRoom = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'join-gameroom' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const game = await gameService.getGameById(gameId);

    const existingRoom = roomService.getRooms().get(gameId);

    if (!existingRoom) {
      if (game.status === GameStatus.FINISHED) {
        throw new Error('cannot join, game status is finished!');
      }

      roomService.createRoom(game);
    }

    roomService.joinRoom(socket);

    emitUpdatedGameToOne(socket, game);
  } catch (e) {
    logger.error(`Error joining room: ${e.message}`);

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

  const { id, gameId, role } = socket.decodedToken;

  if (role === Role.SPECTATOR) {
    logger.log('removing spectator socket from room');

    roomService.leaveRoom(socket);

    socket.to(gameId).emit('user-left', id);
  }

  socket.to(gameId).emit('user-socket-disconnected', id);
};

export const leaveRTCRoom = (socket: SocketWithToken): void => {
  logger.log(`recieved leave-room from ${socket.decodedToken.username}`);

  const { id, gameId } = socket.decodedToken;

  roomService.leaveRoom(socket);

  socket.to(gameId).emit('user-left', id);
};

export const startRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'start' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const game = await gameService.getGameById(gameId);

    if (game.status !== GameStatus.WAITING) {
      throw new Error(`game with id ${gameId} already started`);
    }

    game.status = GameStatus.RUNNING;

    await game.save();

    emitUpdatedGame(socket, game);
  } catch (e) {
    logger.error(`error starting game: ${e.message}`);

    socket.emit('rtc-error', `error starting game: ${e.message}`);
  }
};

export const launchRTCGame = async (
  socket: SocketWithToken,
  setToken: (token: string) => void
): Promise<void> => {
  logger.log(`recieved 'launch' from ${socket.decodedToken.username}`);

  try {
    const { gameId, id } = socket.decodedToken;

    const game = await gameService.getGameById(gameId);

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
    if (game.status === GameStatus.UPCOMING) {
      game.status = GameStatus.WAITING;

      // set turn for correct player
      game.info = {
        ...game.info,
        turn: game.players[0].id,
      };

      logger.log(
        `setting turn to player '${game.players[0].name}' (id: ${game.players[0].id})`
      );

      await game.save();
    } else {
      logger.log(`game with id ${gameId} already launched`);
    }

    emitUpdatedGame(socket, game);

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
    const { gameId, id, role } = socket.decodedToken;

    if (role === Role.SPECTATOR) {
      const room = roomService.getRoom(gameId);

      if (!room.spectatorSockets.includes(socket.id)) {
        throw new Error('socket id not in allowed spectators');
      }
    }

    const token = twilioService.getVideoAccessToken(id, `kotipelit-${gameId}`);

    setToken(token);
  } catch (e) {
    logger.error(`error getting twilio token: ${e.message}`);

    socket.emit('rtc-error', e.message);
  }
};

export const updateRTCGame = async (
  socket: SocketWithToken,
  newGame: RTCGame
): Promise<void> => {
  logger.log(`recieved 'update-game' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const game = await gameService.getGameById(gameId);

    // update only players' points
    game.players = game.players.map((player) => {
      const matching = newGame.players.find(
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
        points: matching.points,
      };
    });

    // update status
    game.status = newGame.status;

    // update info
    game.info = newGame.info;

    await game.save();

    emitUpdatedGame(socket, game);
  } catch (e) {
    logger.error();

    socket.emit('rtc-error', `error updating game: ${e.message}`);
  }
};

export const endRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logger.log(`recieved 'end' from ${socket.decodedToken.username}`);

  try {
    const { gameId } = socket.decodedToken;

    const game = await gameService.getGameById(gameId);

    logger.log('emitting game-ended');

    // emit to self and room
    socket.to(gameId).emit('game-ended');
    socket.emit('game-ended');

    if (game.status !== GameStatus.FINISHED) {
      game.status = GameStatus.FINISHED;

      await game.save();
    }

    // delete game urls
    await urlService.deleteGameUrls(gameId);

    logger.log(`deleting room... `);

    const success = roomService.deleteRoom(gameId);

    logger.log(success ? 'delete succesful' : 'delete failed');
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

export const getRoomState = (socket: SocketWithToken) => {
  try {
    const { gameId } = socket.decodedToken;

    const state = roomService.getRoomState(gameId);

    socket.emit('room-state', state);
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

const logRecievedMsg = (event: string, socket: SocketWithToken): void => {
  logger.log(`recieved '${event}' from ${socket.decodedToken.username}`);
};

export const getRoomGame = async (socket: SocketWithToken): Promise<void> => {
  logRecievedMsg('get-room-game', socket);

  try {
    const { gameId } = socket.decodedToken;

    const game = await gameService.getGameById(gameId);

    emitUpdatedGameToOne(socket, game);
  } catch (e) {
    logger.error(`error getting game: ${e.message}`);

    socket.emit('rtc-error', `error getting game: ${e.message}`);
  }
};

export const handleAnswer = async (
  socket: SocketWithToken,
  answer: Answer
): Promise<void> => {
  logger.log(`recieved 'answer' from ${socket.decodedToken.username}`);

  try {
    const { id, gameId } = socket.decodedToken;

    const room = roomService.getRoom(gameId);

    const game = await gameService.getGameById(gameId);

    const updatedPlayers = game.players.map((player) => {
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
    });

    game.players = updatedPlayers;

    await game.save();

    const hostSocketId = room.socketMap.get(game.host.id);

    if (hostSocketId) {
      socket
        .to(hostSocketId)
        .emit('game-updated', gameService.getGameAsObject(game));
    }

    emitUpdatedGameToOne(socket, game);
  } catch (e) {
    logger.error(`error answering: ${e.message}`);

    socket.emit('rtc-error', `error answering: ${e.message}`);
  }
};

export const handleTimer = (
  socket: SocketWithToken,
  command: 'start' | 'stop' | 'reset'
): void => {
  logRecievedMsg('handle-timer', socket);

  try {
    const { gameId } = socket.decodedToken;

    const { timer } = roomService.getRoomState(gameId);

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

export const getTimerState = (
  socket: SocketWithToken,
  callback: (data: TimerData) => void
): void => {
  logRecievedMsg('get-timer-state', socket);

  try {
    const { gameId } = socket.decodedToken;

    const state = roomService.getRoomState(gameId);

    if (!state.timer) {
      throw new Error('no timer set, check game type');
    }

    callback(state.timer.getState());
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

export const handleMute = (
  socket: SocketWithToken,
  playerId: string,
  muted: boolean
) => {
  logRecievedMsg('set-player-muted', socket);

  try {
    const { gameId } = socket.decodedToken;

    const room = roomService.getRoom(gameId);

    const socketId = room.socketMap.get(playerId);

    if (!socketId) {
      throw new Error(`No socket found for player id '${playerId}'`);
    }

    socket.to(socketId).emit('set-audio-muted', playerId, muted);
  } catch (e) {
    logger.error(`Error trying to mute player: ${e.message}`);

    socket.emit('rtc-error', `Error trying to mute player: ${e.message}`);
  }
};

const emitUpdatedGame = (socket: SocketWithToken, game: GameModel): void => {
  const gameAsObject = gameService.getGameAsObject(game);

  const room = roomService.getRoom(gameAsObject.id);

  const { role } = socket.decodedToken;
  logger.log(`emitting game-updated`);

  // handle game types here
  if (gameAsObject.type === GameType.KOTITONNI) {
    const emittedTo: string[] = []; // for debugging
    const didNotEmit: string[] = [];

    if (role === Role.HOST) {
      socket.emit('game-updated', gameAsObject);

      // doesn't send other players' words
      gameAsObject.players.forEach((player) => {
        const socketId = room.socketMap.get(player.id);

        if (socketId) {
          emittedTo.push(`${player.name} (${socketId})`);

          socket
            .to(socketId)
            .emit('game-updated', filterGameForUser(gameAsObject, player.id));
        } else {
          didNotEmit.push(player.name);
        }
      });

      room.spectatorSockets.forEach((socketId) =>
        socket
          .to(socketId)
          .emit('game-updated', filterGameForSpectator(gameAsObject))
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

const emitUpdatedGameToOne = (socket: SocketWithToken, game: GameModel) => {
  const { role, id } = socket.decodedToken;

  const gameAsObject = gameService.getGameAsObject(game);

  if (role === Role.HOST) {
    socket.emit('game-updated', gameAsObject);
  } else if (role === Role.PLAYER) {
    socket.emit('game-updated', filterGameForUser(gameAsObject, id));
  } else {
    socket.emit('game-updated', filterGameForSpectator(gameAsObject));
  }
};
