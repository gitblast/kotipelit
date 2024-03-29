import { act, renderHook } from '@testing-library/react-hooks';
import useHostGameToken from './useHostGameToken';
import gameService from '../services/games';
import * as routerDom from 'react-router-dom';

jest.mock('../services/games');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

const mockErrorSetter = jest.fn();

jest.mock('../context', () => ({
  useGameErrorState: () => ({ setError: mockErrorSetter }),
}));

describe('useHostGameToken hook', () => {
  const GameServiceMock = gameService as jest.Mocked<typeof gameService>;
  const useParamsMock = routerDom.useParams as jest.Mock;

  beforeEach(() => {
    mockErrorSetter.mockClear();

    GameServiceMock.getHostTokenForGame.mockClear();

    useParamsMock.mockReturnValue({ gameID: null });
  });

  it('should have null token and error at start', () => {
    const { result } = renderHook(() => useHostGameToken());

    expect(result.current).toBeNull();
  });

  /** throws warning due to known error, https://github.com/testing-library/react-hooks-testing-library/issues/14 */
  it('should fetch token if not set', async () => {
    const token = 'test token';

    GameServiceMock.getHostTokenForGame.mockResolvedValueOnce(token);

    expect(GameServiceMock.getHostTokenForGame).toHaveBeenCalledTimes(0);

    const { result, waitForNextUpdate, rerender } = renderHook(() =>
      useHostGameToken()
    );

    expect(result.current).toBeNull();

    act(() => {
      useParamsMock.mockReturnValue({
        gameID: 'gameID',
      });

      rerender();
    });

    await waitForNextUpdate();

    expect(result.current).toBe(token);
    expect(GameServiceMock.getHostTokenForGame).toHaveBeenCalledTimes(1);
    expect(GameServiceMock.getHostTokenForGame).toHaveBeenCalledWith('gameID');
  });
});
