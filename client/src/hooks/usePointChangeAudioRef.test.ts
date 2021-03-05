import { renderHook, cleanup } from '@testing-library/react-hooks';
import usePointChangeAudioRef, { selector } from './usePointChangeAudioRef';
import * as redux from 'react-redux';
import { State } from '../types';

jest.mock('react-redux');
const mockSelector = redux.useSelector as jest.Mock;

const mockRef = {
  current: {
    play: jest.fn(),
  },
};

const pointChangeRef = (mockRef as unknown) as React.MutableRefObject<HTMLAudioElement | null>;

describe('usePointChangeAudioRef hook', () => {
  beforeEach(() => {
    mockSelector.mockClear();
    mockRef.current.play.mockClear();
  });

  it('should return the passed ref', () => {
    const { result } = renderHook(() =>
      usePointChangeAudioRef(pointChangeRef, 100)
    );

    expect(result.current).toBe(mockRef);
  });

  it('should only call play if own points increase by amount given as parameter', () => {
    for (let delta = 0; delta <= 100; delta += 10) {
      for (let oldValue = 0; oldValue <= 100; oldValue += 10) {
        for (let newValue = 0; newValue <= 100; newValue += 10) {
          mockSelector.mockReturnValueOnce(oldValue);

          const { rerender } = renderHook(() =>
            usePointChangeAudioRef(pointChangeRef, delta)
          );

          expect(mockRef.current.play).not.toHaveBeenCalled();

          mockSelector.mockReturnValueOnce(newValue);

          rerender();

          if (newValue !== oldValue && newValue - oldValue === delta) {
            expect(mockRef.current.play).toHaveBeenCalled();
          } else {
            expect(mockRef.current.play).not.toHaveBeenCalled();
          }

          cleanup();

          mockRef.current.play.mockClear();
        }
      }
    }
  });

  describe('selector function', () => {
    it('should return null if no self, game or player self is set', () => {
      const mockStateWithoutSelf = ({
        rtc: {
          self: null,
          game: { mock: true },
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
          game: { players: [{ id: 'not matching' }] },
        },
      } as State;

      expect(selector(mockStateWithoutMatchingPlayer)).toBeNull();
    });

    it('should return own points if all set', () => {
      const POINTS = Date.now();

      const mockState = {
        rtc: {
          self: { id: 'playerId' },
          game: {
            players: [
              { id: 'playerId', points: POINTS },
              { id: 'not matching', points: -100 },
            ],
          },
        },
      } as State;

      expect(selector(mockState)).toBe(POINTS);
    });
  });
});
