import { renderHook } from '@testing-library/react-hooks';
import useAudioOnIncreaseRef from './useAudioOnIncreaseRef';

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
    const { result } = renderHook(() => useAudioOnIncreaseRef(answerRef, 0));

    expect(result.current).toBe(mockRef);
  });

  it('should set current time to 0 and call play when count increases', () => {
    let count = 0;

    const { rerender } = renderHook(() =>
      useAudioOnIncreaseRef(answerRef, count)
    );

    expect(mockRef.current.currentTime).toBeNull();
    expect(mockRef.current.play).not.toHaveBeenCalled();

    count = 1;

    rerender();

    expect(mockRef.current.play).toHaveBeenCalled();
    expect(mockRef.current.currentTime).toBe(0);
  });

  it('should call not play when count stays the same or decreases', () => {
    let count = 0;

    const { rerender } = renderHook(() =>
      useAudioOnIncreaseRef(answerRef, count)
    );

    expect(mockRef.current.play).not.toHaveBeenCalled();

    rerender();

    expect(mockRef.current.play).not.toHaveBeenCalled();

    count = -1;

    rerender();

    expect(mockRef.current.play).not.toHaveBeenCalled();
  });
});
