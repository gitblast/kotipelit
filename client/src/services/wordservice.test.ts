import wordService from './words';
import userService from './users';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const response: AxiosResponse = {
  data: ['random', 'words', 'array'],
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

const token = 'test token';

const excludedWords = ['words', 'excluded'];

describe('word service', () => {
  beforeAll(() => {
    userService.setToken(token);
  });

  describe('get one', () => {
    it('should return a string', async () => {
      mockedAxios.post.mockResolvedValueOnce({ ...response, data: ['random'] });

      const word = await wordService.getOne();

      expect(typeof word).toBe('string');
    });

    it('should send post request to /api/games/words/1', async () => {
      mockedAxios.post.mockResolvedValueOnce({ ...response, data: ['random'] });

      await wordService.getOne(excludedWords);

      expect(mockedAxios.post).toHaveBeenLastCalledWith(
        '/api/games/words/1',
        { excludedWords },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    });

    it('should throw error if response is not an array', async () => {
      mockedAxios.post.mockResolvedValueOnce({ ...response, data: 'word' });

      try {
        await wordService.getOne();
      } catch (error) {
        expect(error.message).toBe(
          'Invalid response when fetching random words'
        );
      }
    });
  });

  describe('get many', () => {
    it('should return array of words with length given as parameter', async () => {
      mockedAxios.post.mockResolvedValueOnce(response);

      const words = await wordService.getMany(3);

      expect(words.length).toBe(3);

      words.forEach((word) => expect(typeof word).toBe('string'));
    });

    it('should send post request to /api/games/words/:amount', async () => {
      mockedAxios.post.mockResolvedValueOnce(response);

      const amount = 3;

      await wordService.getMany(amount, excludedWords);

      expect(mockedAxios.post).toHaveBeenLastCalledWith(
        `/api/games/words/${amount}`,
        { excludedWords },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    });

    it('should throw error if given parameter is non positive or response invalid', async () => {
      try {
        await wordService.getMany(0);
      } catch (error) {
        expect(error.message).toBe('Amount must be positive');
      }

      mockedAxios.post.mockResolvedValueOnce({ ...response, data: 'word' });

      try {
        await wordService.getMany(3);
      } catch (error) {
        expect(error.message).toBe(
          'Invalid response when fetching random words'
        );
      }
    });
  });
});
