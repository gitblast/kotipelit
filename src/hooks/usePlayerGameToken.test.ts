import { act, renderHook } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import usePlayerGameToken from './usePlayerGameToken';
import gameService from '../services/games';
import * as routerDom from 'react-router-dom';

jest.mock('../services/games');
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}));

/**
, () => ({
  useParams: () => ({ username: 'username', playerId: 'playerId' }),
}) */

describe('usePlayerGameToken hook', () => {
  const GameServiceMock = mocked(gameService);
  const useParamsMock = mocked(routerDom.useParams);

  beforeEach(() => {
    GameServiceMock.getPlayerTokenForGame.mockClear();

    useParamsMock.mockReturnValue({ username: null, playerId: null });
  });

  it('should have null token and error at start', () => {
    const { result } = renderHook(() => usePlayerGameToken());

    expect(result.current.length).toBe(2);
    expect(result.current[0]).toBeNull();
    expect(result.current[1]).toBeNull();
  });

  /** throws warning due to known error, https://github.com/testing-library/react-hooks-testing-library/issues/14 */
  it('should fetch token if not set', async () => {
    const token = 'test token';

    GameServiceMock.getPlayerTokenForGame.mockResolvedValueOnce(token);

    expect(GameServiceMock.getPlayerTokenForGame).toHaveBeenCalledTimes(0);

    const { result, waitForNextUpdate, rerender } = renderHook(() =>
      usePlayerGameToken()
    );

    expect(result.current[0]).toBeNull();

    // this way the async effect doesn't fire on first render
    act(() => {
      useParamsMock.mockReturnValue({
        username: 'username',
        playerId: 'playerId',
      });

      rerender();
    });

    await waitForNextUpdate();

    expect(result.current[0]).toBe(token);
    expect(result.current[1]).toBeNull();
    expect(GameServiceMock.getPlayerTokenForGame).toHaveBeenCalledTimes(1);
    expect(GameServiceMock.getPlayerTokenForGame).toHaveBeenCalledWith(
      'username',
      'playerId',
      true
    );
  });

  it('should set error if token rejected', async () => {
    GameServiceMock.getPlayerTokenForGame.mockRejectedValueOnce('error');

    const { result, waitForNextUpdate, rerender } = renderHook(() =>
      usePlayerGameToken()
    );

    expect(result.current[1]).toBeNull();

    // this way the async effect doesn't fire on first render
    act(() => {
      useParamsMock.mockReturnValue({
        username: 'username',
        playerId: 'playerId',
      });

      rerender();
    });

    await waitForNextUpdate();

    expect(result.current[0]).toBeNull();
    expect(result.current[1]).not.toBeNull();
  });
});
