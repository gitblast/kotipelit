import { renderHook } from '@testing-library/react-hooks';
import useWinnerAudioRef from './useWinnerAudioRef';

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
    const { result } = renderHook(() => useWinnerAudioRef(true, winnerRef));

    expect(result.current).toBe(mockRef);
  });

  it('should call play only if selector returns true', () => {
    let isWinner = false;

    const { rerender } = renderHook(() =>
      useWinnerAudioRef(isWinner, winnerRef)
    );

    expect(mockRef.current.play).not.toHaveBeenCalled();

    isWinner = true;

    rerender();

    expect(mockRef.current.play).toHaveBeenCalledTimes(1);
  });
});
