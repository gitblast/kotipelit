/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Answer,
  GameModel,
  GameStatus,
  Role,
  SocketWithToken,
  GameType,
} from '../../types';
import {
  filterGameForSpectator,
  filterGameForUser,
  getGameAsObject,
} from '../../utils/helpers';
import logger from '../../utils/logger';
import gameService from '../games';
import twilioService from '../twilio';
import urlService from '../urls';
import { shuffle } from 'lodash';
import { getTimer, initTimer, gamesThatUseTimer } from '../../utils/timer';
import { GameUpdate } from '../../types';
import { saveNextKotitonniState } from '../../utils/helpers';

const logRecievedEvent = (
  event: string,
  socket: SocketWithToken,
  additionalLog: string = ''
): void => {
  const { username, id, role } = socket.decodedToken;

  logger.log(
    `recieved '${event}' from [${role}] '${username}' (ID: ${id}, SOCKET: ${socket.id}) ${additionalLog}`
  );
};
export const socketDisconnected = (
  socket: SocketWithToken,
  reason: string
): void => {
  logRecievedEvent('disconnect', socket, `disconnect reason: ${reason}`);
};

export const startRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logRecievedEvent('start', socket);

  try {
    const { gameId } = socket.decodedToken;

    const game = await gameService.getGameById(gameId);

    if (game.status !== GameStatus.WAITING) {
      throw new Error(`game with id ${gameId} already started`);
    }

    game.status = GameStatus.RUNNING;

    await game.save();
  } catch (e) {
    logger.error(`error starting game: ${e.message}`);

    socket.emit('rtc-error', `error starting game: ${e.message}`);
  }
};

export const launchRTCGame = async (
  socket: SocketWithToken,
  setToken: (token: string) => void
): Promise<void> => {
  logRecievedEvent('launch', socket);

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

    if (gamesThatUseTimer.includes(game.type)) {
      await initTimer(game);
    }

    // only update state if game has not been launched
    if (game.status === GameStatus.UPCOMING) {
      // shuffle player order
      game.players = shuffle(game.players);

      game.status = GameStatus.WAITING;

      // set turn for correct player
      game.info = {
        ...game.info,
        turn: game.players[0].id,
      };

      await game.save();
    } else {
      logger.log(`game with id ${gameId} already launched`);
    }

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
  logRecievedEvent('get-twilio-token', socket);

  try {
    const { gameId, id } = socket.decodedToken;

    const token = twilioService.getVideoAccessToken(id, `kotipelit-${gameId}`);

    setToken(token);
  } catch (e) {
    logger.error(`error getting twilio token: ${e.message}`);

    socket.emit('rtc-error', e.message);
  }
};

export const updateRTCGame = async (
  socket: SocketWithToken,
  update: GameUpdate
): Promise<void> => {
  logRecievedEvent('update-game', socket);

  try {
    const { gameId } = socket.decodedToken;

    const game = await gameService.getGameById(gameId);

    if (update.gameType === GameType.KOTITONNI) {
      /** calculate and save next state */

      const updated = await saveNextKotitonniState(
        game,
        update.data,
        update.fromHistory
      );

      /** reset timer */
      const timer = await getTimer(gameId);

      timer.reset();

      /** This makes sure host's ui updates if there are no changes to current game state. only possible if update comes from history */
      socket.emit('game-updated', updated);
    }
  } catch (e) {
    logger.error();

    socket.emit('rtc-error', `error updating game: ${e.message}`);
  }
};

export const endRTCGame = async (socket: SocketWithToken): Promise<void> => {
  logRecievedEvent('end', socket);

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
  } catch (e) {
    logger.error(e.message);

    socket.emit('rtc-error', e.message);
  }
};

export const getGame = async (socket: SocketWithToken): Promise<void> => {
  logRecievedEvent('get-game', socket);

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
  logRecievedEvent('answer', socket);

  try {
    const { id, gameId } = socket.decodedToken;

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

    // emit to host
    socket
      .to(`${gameId}/${Role.HOST}`)
      .emit('game-updated', getGameAsObject(game));

    // emit to self
    emitUpdatedGameToOne(socket, game);
  } catch (e) {
    logger.error(`error answering: ${e.message}`);

    socket.emit('rtc-error', `error answering: ${e.message}`);
  }
};

export const handleTimer = async (
  socket: SocketWithToken,
  command: 'start' | 'stop' | 'reset'
) => {
  logRecievedEvent('handle-timer', socket);

  try {
    const { gameId } = socket.decodedToken;

    const timer = await getTimer(gameId);

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

export const handleMute = (
  socket: SocketWithToken,
  playerId: string,
  muted: boolean
) => {
  logRecievedEvent('set-player-muted', socket);

  try {
    socket.to(playerId).emit('set-audio-muted', playerId, muted);
  } catch (e) {
    logger.error(`Error trying to mute player: ${e.message}`);

    socket.emit('rtc-error', `Error trying to mute player: ${e.message}`);
  }
};

const emitUpdatedGameToOne = (socket: SocketWithToken, game: GameModel) => {
  const { role, id } = socket.decodedToken;

  const gameAsObject = getGameAsObject(game);

  if (role === Role.HOST) {
    socket.emit('game-updated', gameAsObject);
  } else if (role === Role.PLAYER) {
    socket.emit('game-updated', filterGameForUser(gameAsObject, id));
  } else {
    socket.emit('game-updated', filterGameForSpectator(gameAsObject));
  }
};
