import { initializePlayers } from '../../helpers/games';
import wordService from '../../services/words';

jest.mock('../../services/words');

describe('new game form', () => {
  describe('initialize players function', () => {
    const getMany = wordService.getMany as jest.Mock;

    it('should call wordService.getMany with player count times words per player', async () => {
      for (let i = 1; i < 10; i += 2) {
        for (let j = 10; j > 0; j -= 2) {
          getMany.mockResolvedValueOnce(new Array(i * j).fill('word'));
          await initializePlayers(i, j);
          expect(getMany).toHaveBeenLastCalledWith(i * j);
        }
      }
    });

    it('should return array of player objects', async () => {
      getMany.mockResolvedValueOnce(['word']);
      const players = await initializePlayers(1, 1);

      expect(Array.isArray(players)).toBe(true);

      const player = players[0];

      expect(typeof player.id).toBe('string');
      expect(typeof player.name).toBe('string');
      expect(Array.isArray(player.privateData.words)).toBe(true);
      expect(player.points).toBe(0);
    });

    it('should return correct amount of player objects', async () => {
      for (let i = 1; i < 5; i++) {
        getMany.mockResolvedValueOnce(new Array(i * 1).fill('word'));
        const players = await initializePlayers(i, 1);

        expect(players.length).toBe(i);
      }
    });

    it('should return player objects with correct amount of words set', async () => {
      for (let i = 1; i < 5; i++) {
        getMany.mockResolvedValueOnce(new Array(1 * i).fill('word'));
        const players = await initializePlayers(1, i);

        expect(players[0].privateData.words.length).toBe(i);
      }
    });
  });
});
