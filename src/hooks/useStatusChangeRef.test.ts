import { renderHook, cleanup } from '@testing-library/react-hooks';
import useStatusChangeRef from './useStatusChangeRef';
import * as redux from 'react-redux';
import { GameStatus } from '../types';

jest.mock('react-redux');
const mockSelector = redux.useSelector as jest.Mock;

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
      useStatusChangeRef(statusChangeRef, '' as GameStatus, '' as GameStatus)
    );

    expect(result.current).toBe(mockRef);
  });

  it('should call play if status changes from oldStatus to newStatus', () => {
    const oldStatus = GameStatus.WAITING;
    const newStatus = GameStatus.RUNNING;

    mockSelector.mockReturnValueOnce(oldStatus);

    const { rerender } = renderHook(() =>
      useStatusChangeRef(statusChangeRef, oldStatus, newStatus)
    );

    expect(mockRef.current.play).not.toHaveBeenCalled();

    mockSelector.mockReturnValueOnce(newStatus);

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

            mockSelector.mockReturnValueOnce(first);

            const { rerender } = renderHook(() =>
              useStatusChangeRef(statusChangeRef, oldValue, newValue)
            );

            expect(mockRef.current.play).not.toHaveBeenCalled();

            mockSelector.mockReturnValueOnce(second);

            rerender();

            expect(mockRef.current.play).not.toHaveBeenCalled();

            cleanup();
          }
        }
      }
    }
  });
});
