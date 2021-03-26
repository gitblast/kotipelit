import { renderHook, cleanup } from '@testing-library/react-hooks';
import usePointChangeAudioRef from './usePointChangeAudioRef';

const mockRef = {
  current: {
    play: jest.fn(),
  },
};

const pointChangeRef = (mockRef as unknown) as React.MutableRefObject<HTMLAudioElement | null>;

describe('usePointChangeAudioRef hook', () => {
  beforeEach(() => {
    mockRef.current.play.mockClear();
  });

  it('should return the passed ref', () => {
    const { result } = renderHook(() =>
      usePointChangeAudioRef(0, pointChangeRef, 100)
    );

    expect(result.current).toBe(mockRef);
  });

  it('should only call play if own points increase by amount given as parameter', () => {
    for (let delta = 0; delta <= 100; delta += 10) {
      for (let oldValue = 0; oldValue <= 100; oldValue += 10) {
        for (let newValue = 0; newValue <= 100; newValue += 10) {
          let ownPoints = oldValue;

          const { rerender } = renderHook(() =>
            usePointChangeAudioRef(ownPoints, pointChangeRef, delta)
          );

          expect(mockRef.current.play).not.toHaveBeenCalled();

          ownPoints = newValue;

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
});
