/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import {
  GameModel,
  GameStatus,
  GameType,
  KotitonniPlayer,
  RTCGame,
} from '../types';
import gameService from './games';
import Game from '../models/game';
import { getInitialInfo } from '../utils/helpers';
import { KotitonniInfo } from '../types';

jest.mock('../models/game', () => ({
  findById: jest.fn(),
  save: jest.fn(),
}));

const findById = Game.findById as jest.Mock;

describe('games service', () => {
  describe('getInitialInfo', () => {
    it('should throw error if game type invalid', () => {
      const mockGame = ({
        type: 'invalid',
      } as unknown) as GameModel;

      expect(() => getInitialInfo(mockGame)).toThrowError(
        `Invalid game type: ${mockGame.type}`
      );
    });

    describe('kotitonni', () => {
      it('should throw error if no players are set', () => {
        const mockGame = ({
          type: GameType.KOTITONNI,
        } as unknown) as GameModel;

        expect(() => getInitialInfo(mockGame)).toThrowError(
          'Game has no players set'
        );
        expect(() =>
          getInitialInfo(({
            ...mockGame,
            players: [],
          } as unknown) as GameModel)
        ).toThrowError('Game has no players set');
      });

      it('should return initial info object', () => {
        const mockPlayer = {
          id: 'mockPlayer ID',
        } as KotitonniPlayer;

        const mockGame = ({
          type: GameType.KOTITONNI,
          players: [mockPlayer],
        } as unknown) as GameModel;

        const expectedInfo: KotitonniInfo = {
          round: 1,
          turn: mockPlayer.id,
          timer: {
            value: 60,
            isRunning: false,
          },
        };

        expect(getInitialInfo(mockGame)).toEqual(expectedInfo);
      });
    });
  });

  describe('getGameById', () => {
    it('should call findById', async () => {
      findById.mockResolvedValueOnce({});

      await gameService.getGameById('id');

      expect(findById).toHaveBeenCalledWith('id');
    });

    it('should throw error if game not found', async () => {
      findById.mockImplementationOnce(() => null);

      const id = 'ID';

      try {
        await gameService.getGameById(id);
      } catch (e) {
        expect(e.message).toBe(`Invalid request: No game found with id ${id}`);
      }
    });

    it('should return game if found', async () => {
      const game = {} as GameModel;

      findById.mockResolvedValueOnce(game);

      const returnedGame = await gameService.getGameById('id');

      expect(returnedGame).toBe(game);
    });
  });

  describe('saveFinishedGame', () => {
    it('should throw error if game not found', async () => {
      findById.mockImplementationOnce(() => null);

      const id = 'ID';

      try {
        await gameService.getGameById(id);
      } catch (e) {
        expect(e.message).toBe(`Invalid request: No game found with id ${id}`);
      }
    });

    it('should replace players and status and call save', async () => {
      const initialPlayers = {};

      const mockReturn = {
        players: initialPlayers,
        save: jest.fn(),
        status: 'initial',
      };

      const origGame = {
        players: {},
      } as RTCGame;

      findById.mockImplementationOnce(() => mockReturn);

      await gameService.saveFinishedGame('id', origGame);

      expect(mockReturn.players).toBe(origGame.players);
      expect(mockReturn.status).toBe(GameStatus.FINISHED);
      expect(mockReturn.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('setGameStatus', () => {
    it('should throw error if game not found', async () => {
      findById.mockImplementationOnce(() => null);

      const id = 'ID';

      try {
        await gameService.getGameById(id);
      } catch (e) {
        expect(e.message).toBe(`Invalid request: No game found with id ${id}`);
      }
    });

    it('should set new status and call save', async () => {
      const mockReturn = {
        save: jest.fn(),
        status: 'initial',
      };

      findById.mockImplementationOnce(() => mockReturn);

      const expectedReturn = {};

      mockReturn.save.mockResolvedValueOnce(expectedReturn);

      const randomStatus = Date.now().toString() as GameStatus;

      const actualReturn = await gameService.setGameStatus('id', randomStatus);

      expect(mockReturn.status).toBe(randomStatus);
      expect(mockReturn.save).toHaveBeenCalledTimes(1);
      expect(actualReturn).toBe(expectedReturn);
    });
  });
});
