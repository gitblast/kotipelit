import shortid from 'shortid';
import wordService from '../services/words';
import { KotitonniPlayer } from '../types';

/**
 * Generates initial player objects to be used in state
 * @param playerCount - number of players
 * @param wordsPerPlayer - words per player
 * @return {Promise} - Array of player objects with unique, randow words each
 */
export const initializePlayers = async (
  playerCount: number,
  wordsPerPlayer: number
): Promise<KotitonniPlayer[]> => {
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
      name: `Pelaaja ${i}`,
      words,
      points: 0,
      online: false,
    });
  }

  return players;
};
