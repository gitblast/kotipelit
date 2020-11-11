import { renderHook } from '@testing-library/react-hooks';
import useAudioOnIncreaseRef, {
  answerCountSelector,
  clickCountSelector,
} from './useAudioOnIncreaseRef';
import * as redux from 'react-redux';
import { State } from '../types';

jest.mock('react-redux');
const useSelectMock = redux.useSelector as jest.Mock;
const mockSelector = {} as (state: State) => number;

const mockRef = {
  current: {
    play: jest.fn(),
    currentTime: null,
  },
};

const answerRef = (mockRef as unknown) as React.MutableRefObject<HTMLAudioElement | null>;

describe('useAnswerAudioRef hook', () => {
  beforeEach(() => {
    mockRef.current.play.mockClear();
    mockRef.current.currentTime = null;
  });

  it('should return the passed ref', () => {
    const { result } = renderHook(() =>
      useAudioOnIncreaseRef(answerRef, mockSelector)
    );

    expect(result.current).toBe(mockRef);
  });

  it('should set current time to 0 and call play when count increases', () => {
    useSelectMock.mockReturnValueOnce(0);

    const { rerender } = renderHook(() =>
      useAudioOnIncreaseRef(answerRef, mockSelector)
    );

    expect(mockRef.current.currentTime).toBeNull();
    expect(mockRef.current.play).not.toHaveBeenCalled();

    useSelectMock.mockReturnValueOnce(1);

    rerender();

    expect(mockRef.current.play).toHaveBeenCalled();
    expect(mockRef.current.currentTime).toBe(0);
  });

  it('should call not play when count stays the same or decreases', () => {
    useSelectMock.mockReturnValueOnce(0);

    const { rerender } = renderHook(() =>
      useAudioOnIncreaseRef(answerRef, mockSelector)
    );

    expect(mockRef.current.play).not.toHaveBeenCalled();

    useSelectMock.mockReturnValueOnce(0);

    rerender();

    expect(mockRef.current.play).not.toHaveBeenCalled();

    useSelectMock.mockReturnValueOnce(-1);

    rerender();

    expect(mockRef.current.play).not.toHaveBeenCalled();
  });

  describe('clickCountSelector function', () => {
    it('should return null if localData or clickMap does not exist', () => {
      const mockStateWithoutLocalData = ({
        rtc: {
          localData: null,
        },
      } as unknown) as State;

      expect(clickCountSelector(mockStateWithoutLocalData)).toBeNull();

      const mockStateWithoutClickMap = ({
        rtc: {
          localData: {
            clickedMap: null,
          },
        },
      } as unknown) as State;

      expect(clickCountSelector(mockStateWithoutClickMap)).toBeNull();
    });

    it('should return amount of answers marked correct', () => {
      const mockState = ({
        rtc: {
          localData: {
            clickedMap: {
              player1: true, // 1.
              player2: true, // 2.
              player3: false,
              player4: undefined,
              player5: null,
            },
          },
        },
      } as unknown) as State;

      expect(clickCountSelector(mockState)).toBe(2);
    });
  });

  describe('answerCountSelector function', () => {
    it('should return null if no game is set', () => {
      const mockStateWithoutGame = ({
        rtc: {
          self: { mock: true },
          game: null,
        },
      } as unknown) as State;

      expect(answerCountSelector(mockStateWithoutGame)).toBeNull();
    });

    it('should return total number of answers', () => {
      const mockState = ({
        rtc: {
          self: { mock: true },
          game: {
            players: [
              {
                answers: {
                  player1: {
                    '1': 'answer1', // 1. answer,
                    '2': 'answer2', // 2. answer, and so on
                  },
                  player2: {
                    '1': 'answer1',
                    '2': 'answer2',
                  },
                },
              },
              {
                answers: {
                  player3: {
                    '1': 'answer1',
                    '2': 'answer2',
                  },
                  player4: {
                    '1': 'answer1',
                    '2': 'answer2',
                  },
                },
              },
            ],
          },
        },
      } as unknown) as State;

      expect(answerCountSelector(mockState)).toBe(8);
    });
  });
});
