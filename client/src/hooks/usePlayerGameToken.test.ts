import { act, renderHook } from '@testing-library/react-hooks';
import usePlayerGameToken from './usePlayerGameToken';
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

describe('usePlayerGameToken hook', () => {
  const GameServiceMock = gameService as jest.Mocked<typeof gameService>;
  const useParamsMock = routerDom.useParams as jest.Mock;

  beforeEach(() => {
    mockErrorSetter.mockClear();

    GameServiceMock.getPlayerTokenForGame.mockClear();

    useParamsMock.mockReturnValue({ username: null, inviteCode: null });
  });

  it('should have null token at start', () => {
    const { result } = renderHook(() => usePlayerGameToken());

    expect(result.current).toBeNull();
  });

  /** throws warning due to known error, https://github.com/testing-library/react-hooks-testing-library/issues/14 */
  it('should fetch token if not set', async () => {
    const token = 'test token';

    GameServiceMock.getPlayerTokenForGame.mockResolvedValueOnce(token);

    expect(GameServiceMock.getPlayerTokenForGame).toHaveBeenCalledTimes(0);

    const { result, waitForNextUpdate, rerender } = renderHook(() =>
      usePlayerGameToken()
    );

    expect(result.current).toBeNull();

    // this way the async effect doesn't fire on first render
    act(() => {
      useParamsMock.mockReturnValue({
        username: 'username',
        inviteCode: 'inviteCode',
      });

      rerender();
    });

    await waitForNextUpdate();

    expect(result.current).toBe(token);
    expect(GameServiceMock.getPlayerTokenForGame).toHaveBeenCalledTimes(1);
    expect(GameServiceMock.getPlayerTokenForGame).toHaveBeenCalledWith(
      'username',
      'inviteCode',
      true
    );
  });
});
