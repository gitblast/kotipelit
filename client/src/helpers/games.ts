import shortid from 'shortid';
import wordService from '../services/words';
import { GameStatus, RTCGame, RTCKotitonniPlayer } from '../types';
import logger from '../utils/logger';

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
        twilioToken: null,
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

export const getNextKotitonniState = (
  game: RTCGame,
  clickMap: Record<string, boolean>
) => {
  const playerInTurn = game.players.find((player) => player.hasTurn);

  if (!playerInTurn) {
    logger.error('no player with turn set when trying to update');

    return;
  }

  const newPlayers = game.players.map((player) => {
    return {
      ...player,
      points:
        player.points +
        getPointAddition(game, clickMap, player.id, !!player.hasTurn),
    };
  });

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
