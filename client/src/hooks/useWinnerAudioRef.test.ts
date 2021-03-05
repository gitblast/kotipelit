import { renderHook } from '@testing-library/react-hooks';
import useWinnerAudioRef, { selector } from './useWinnerAudioRef';
import * as redux from 'react-redux';
import { GameStatus, State } from '../types';

jest.mock('react-redux');
const mockSelector = redux.useSelector as jest.Mock;

const mockRef = {
  current: {
    play: jest.fn(),
  },
};

const winnerRef = (mockRef as unknown) as React.MutableRefObject<HTMLAudioElement | null>;

describe('useWinnerAudioRef hook', () => {
  beforeEach(() => {
    mockRef.current.play.mockClear();
  });

  it('should return the passed ref', () => {
    const { result } = renderHook(() => useWinnerAudioRef(winnerRef));

    expect(result.current).toBe(mockRef);
  });

  it('should call play if selector returns true', () => {
    mockSelector.mockReturnValueOnce(false);

    const { rerender } = renderHook(() => useWinnerAudioRef(winnerRef));

    expect(mockRef.current.play).not.toHaveBeenCalled();

    mockSelector.mockReturnValueOnce(true);

    rerender();

    expect(mockRef.current.play).toHaveBeenCalledTimes(1);
  });

  it('should not call play if selector returns null or false', () => {
    mockSelector.mockReturnValueOnce(false);

    const { rerender } = renderHook(() => useWinnerAudioRef(winnerRef));

    expect(mockRef.current.play).not.toHaveBeenCalled();

    mockSelector.mockReturnValueOnce(null);

    rerender();

    expect(mockRef.current.play).not.toHaveBeenCalled();
  });

  describe('selector function', () => {
    it('should return true if player has most points, false if not', () => {
      const mockWinningState = {
        rtc: {
          self: { id: 'playerId' },
          game: {
            status: GameStatus.FINISHED,
            players: [
              { id: 'playerId', points: 100 },
              { id: 'other', points: 50 },
            ],
          },
        },
      } as State;

      expect(selector(mockWinningState)).toBe(true);

      const mockLosingState = {
        rtc: {
          self: { id: 'playerId' },
          game: {
            status: GameStatus.FINISHED,
            players: [
              { id: 'playerId', points: 50 },
              { id: 'other', points: 100 },
            ],
          },
        },
      } as State;

      expect(selector(mockLosingState)).toBe(false);
    });

    it('should return null if no self, game or player self is set or if game is not finished', () => {
      const mockStateWithoutSelf = ({
        rtc: {
          self: null,
          game: { status: GameStatus.FINISHED },
        },
      } as unknown) as State;

      expect(selector(mockStateWithoutSelf)).toBeNull();

      const mockStateWithoutGame = ({
        rtc: {
          self: { mock: true },
          game: null,
        },
      } as unknown) as State;

      expect(selector(mockStateWithoutGame)).toBeNull();

      const mockStateWithoutMatchingPlayer = {
        rtc: {
          self: { id: 'playerId' },
          game: {
            status: GameStatus.FINISHED,
            players: [{ id: 'not matching' }],
          },
        },
      } as State;

      expect(selector(mockStateWithoutMatchingPlayer)).toBeNull();

      const mockStateWithoutFinishedGame = {
        rtc: {
          self: { id: 'playerId' },
          game: { status: GameStatus.RUNNING, players: [{ id: 'playerId' }] },
        },
      } as State;

      expect(selector(mockStateWithoutFinishedGame)).toBeNull();
    });
  });
});
