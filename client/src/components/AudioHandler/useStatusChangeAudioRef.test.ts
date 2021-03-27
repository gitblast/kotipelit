import { renderHook, cleanup } from '@testing-library/react-hooks';
import useStatusChangeAudioRef from './useStatusChangeAudioRef';
import { GameStatus } from '../../types';

const mockRef = {
  current: {
    play: jest.fn(),
  },
};

const statusChangeRef = (mockRef as unknown) as React.MutableRefObject<HTMLAudioElement | null>;

describe('useIntroRef hook', () => {
  beforeEach(() => {
    mockRef.current.play.mockClear();
  });

  it('should return the passed ref', () => {
    const { result } = renderHook(() =>
      useStatusChangeAudioRef(
        statusChangeRef,
        '' as GameStatus,
        '' as GameStatus,
        '' as GameStatus
      )
    );

    expect(result.current).toBe(mockRef);
  });

  it('should call play if status changes from oldStatus to newStatus', () => {
    const oldStatus = GameStatus.WAITING;
    const newStatus = GameStatus.RUNNING;

    let currentStatus = oldStatus;

    const { rerender } = renderHook(() =>
      useStatusChangeAudioRef(
        statusChangeRef,
        currentStatus,
        oldStatus,
        newStatus
      )
    );

    expect(mockRef.current.play).not.toHaveBeenCalled();

    currentStatus = newStatus;

    rerender();

    expect(mockRef.current.play).toHaveBeenCalled();
  });

  it('should not call play unless status changes from waiting to running', () => {
    for (const oldValue of Object.values(GameStatus)) {
      for (const newValue of Object.values(GameStatus)) {
        for (const first of Object.values(GameStatus)) {
          for (const second of Object.values(GameStatus)) {
            if (first === oldValue && second === newValue) {
              continue;
            }

            let currentStatus = first;

            const { rerender } = renderHook(() =>
              useStatusChangeAudioRef(
                statusChangeRef,
                currentStatus,
                oldValue,
                newValue
              )
            );

            expect(mockRef.current.play).not.toHaveBeenCalled();

            currentStatus = second;

            rerender();

            expect(mockRef.current.play).not.toHaveBeenCalled();

            cleanup();
          }
        }
      }
    }
  });
});
