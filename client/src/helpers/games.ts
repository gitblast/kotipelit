import shortid from 'shortid';
import wordService from '../services/words';
import { GameStatus, RTCGame, RTCKotitonniPlayer, RTCSelf } from '../types';
import logger from '../utils/logger';

export const getSpectatorUrl = (gameId: string, hostName: string) => {
  const baseUrl =
    process && process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://www.kotipelit.com';

  return `${baseUrl}/${hostName}/live/${gameId}`;
};

/**
 * Generates initial player objects to be used in state
 * @param playerCount - number of players
 * @param wordsPerPlayer - words per player
 * @return {Promise} - Array of player objects with unique, randow words each
 */
export const initializePlayers = async (
  playerCount: number,
  wordsPerPlayer: number
): Promise<RTCKotitonniPlayer[]> => {
  const players = [];

  const randomWords = await wordService.getMany(playerCount * wordsPerPlayer);
  for (let i = 1; i <= playerCount; i++) {
    const words: string[] = [];

    for (let j = 0; j < wordsPerPlayer; j++) {
      const word = randomWords.pop();

      if (word) words.push(word);
    }

    players.push({
      id: shortid.generate(),
      name: 'Avoinna', // `Pelaaja ${i}`,
      points: 0,
      privateData: {
        words,
        answers: {},
        inviteCode: '',
      },
    });
  }

  return players;
};

export const getPointAddition = (
  game: RTCGame,
  clickMap: Record<string, boolean>,
  playerId: string,
  hasTurn: boolean
): number => {
  const playerCount = game.players.length;
  const correctAnswers = game.players.reduce((sum, next) => {
    return clickMap[next.id] ? sum + 1 : sum;
  }, 0);

  switch (correctAnswers) {
    case playerCount - 1:
      return hasTurn ? -50 : 0;
    case 0:
      return hasTurn ? -50 : 0;
    case 1:
      return clickMap[playerId] || hasTurn ? 100 : 0;
    case 2:
      return clickMap[playerId] || hasTurn ? 30 : 0;
    case 3:
      return clickMap[playerId] || hasTurn ? 10 : 0;
  }

  return correctAnswers;
};

export const getNextRoundAndTurn = (game: RTCGame) => {
  const playerInTurn = game.players.find((player) => player.hasTurn);

  if (!playerInTurn) {
    logger.error('no player with turn set when trying to update');

    throw new Error('no player with turn set when trying to update');
  }

  const playerInTurnIndex = game.players.indexOf(playerInTurn);
  let round: number;
  let turn: string;

  if (playerInTurnIndex === game.players.length - 1) {
    round = game.info.round + 1;
    turn = game.players[0].id;
  } else {
    round = game.info.round;
    turn = game.players[playerInTurnIndex + 1].id;
  }

  return { round, turn };
};

export const getNextKotitonniState = (
  game: RTCGame,
  clickMap: Record<string, boolean>
) => {
  const newPlayers = game.players.map((player) => {
    return {
      ...player,
      points:
        player.points +
        getPointAddition(game, clickMap, player.id, !!player.hasTurn),
    };
  });

  const { round, turn } = getNextRoundAndTurn(game);

  const updatedGame: RTCGame = {
    ...game,
    status: round > 3 ? GameStatus.FINISHED : game.status,
    players: newPlayers,
    info: {
      ...game.info,
      round,
      turn,
    },
  };

  return updatedGame;
};

export const getAnswerCount = (game: RTCGame) => {
  let answerCount = 0;

  game.players.forEach((player) => {
    if (!player.privateData) {
      return;
    }

    Object.values(player.privateData.answers).forEach((answerMap) => {
      answerCount += Object.values(answerMap).length;
    });
  });

  return answerCount;
};

export const selfIsWinner = (game: RTCGame, self: RTCSelf) => {
  if (game.status !== GameStatus.FINISHED) {
    return false;
  }

  const playerSelf = game.players.find((player) => player.id === self.id);

  if (!playerSelf) {
    return false;
  }

  const playersSortedByPoints = game.players
    .concat()
    .sort((a, b) => b.points - a.points);

  return playersSortedByPoints[0].points === playerSelf.points;
};
