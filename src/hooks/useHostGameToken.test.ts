import { renderHook } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import useHostGameToken from './useHostGameToken';
import gameService from '../services/games';

jest.mock('../services/games');
jest.mock('react-router-dom', () => ({
  useParams: () => ({ gameID: 'gameID' }),
}));

describe('useHostGameToken hook', () => {
  const GameServiceMock = mocked(gameService);

  beforeEach(() => {
    GameServiceMock.getHostTokenForGame.mockClear();
  });

  it('should have null token and error at start', () => {
    const { result } = renderHook(() => useHostGameToken());

    expect(result.current.length).toBe(2);
    expect(result.current[0]).toBeNull();
    expect(result.current[1]).toBeNull();
  });

  /** throws warning due to known error, https://github.com/testing-library/react-hooks-testing-library/issues/14 */
  it('should fetch token if not set', async () => {
    const token = 'test token';

    GameServiceMock.getHostTokenForGame.mockResolvedValueOnce(token);

    expect(GameServiceMock.getHostTokenForGame).toHaveBeenCalledTimes(0);

    const { result, waitForNextUpdate } = renderHook(() => useHostGameToken());

    expect(result.current[0]).toBeNull();

    await waitForNextUpdate();

    expect(result.current[0]).toBe(token);
    expect(result.current[1]).toBeNull();
    expect(GameServiceMock.getHostTokenForGame).toHaveBeenCalledTimes(1);
    expect(GameServiceMock.getHostTokenForGame).toHaveBeenCalledWith('gameID');
  });

  it('should set error if token rejected', async () => {
    GameServiceMock.getHostTokenForGame.mockRejectedValueOnce('error');

    const { result, waitForNextUpdate } = renderHook(() => useHostGameToken());

    expect(result.current[1]).toBeNull();

    await waitForNextUpdate();

    expect(result.current[0]).toBeNull();
    expect(result.current[1]).not.toBeNull();
  });
});
