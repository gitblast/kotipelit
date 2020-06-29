import userService from './users';
import gameService from './games';

import axios, { AxiosResponse } from 'axios';
import { GameType, SelectableGame, GameStatus } from '../types';

const newGame: SelectableGame = {
  startTime: new Date(),
  type: GameType.SANAKIERTO,
  status: GameStatus.UPCOMING,
  rounds: 3,
  id: '123',
  players: [
    {
      id: '1',
      name: 'Risto',
      words: ['jojo', 'kasvi', 'hattu'],
      points: 0,
    },
  ],
};

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const response: AxiosResponse = {
  data: null,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

describe('game service', () => {
  it('should throw error if token is not set', async () => {
    try {
      await gameService.getAll();
    } catch (error) {
      expect(error.message).toBe('Käyttäjän token puuttuu');
    }

    try {
      await gameService.addNew(newGame);
    } catch (error) {
      expect(error.message).toBe('Käyttäjän token puuttuu');
    }

    try {
      await gameService.deleteGame('id');
    } catch (error) {
      expect(error.message).toBe('Käyttäjän token puuttuu');
    }
  });

  describe('with token set', () => {
    let headers: {} | null = null;

    beforeAll(() => {
      userService.setToken('token');
      headers = { Authorization: userService.getAuthHeader() };
    });

    it('should return all games with a get request', async () => {
      const getAllResponse = { ...response, data: ['all games'] };

      mockedAxios.get.mockImplementationOnce(() =>
        Promise.resolve(getAllResponse)
      );

      const games = await gameService.getAll();
      expect(games).toBe(getAllResponse.data);

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/games', { headers });
    });

    it('should add new game with post request', async () => {
      const addNewResponse = { ...response, data: newGame };

      mockedAxios.post.mockImplementationOnce(() =>
        Promise.resolve(addNewResponse)
      );

      const addedGame = await gameService.addNew(newGame);
      expect(addedGame).toBe(addNewResponse.data);

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/games', newGame, {
        headers,
      });
    });

    it('should delete game with delete request and game id as parameter', async () => {
      mockedAxios.post.mockImplementationOnce(() => Promise.resolve(null));

      const response = await gameService.deleteGame('deleteID');
      expect(response).toBe(undefined);
      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/games/deleteID', {
        headers,
      });
    });
  });
});
