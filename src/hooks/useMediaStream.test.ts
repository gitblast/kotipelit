import { renderHook } from '@testing-library/react-hooks';
import useMediaStream from './useMediaStream';

const CONSTRAINTS = { audio: true, video: true };

const getter = jest.fn();

Object.assign(navigator, {
  mediaDevices: {
    getUserMedia: getter,
  },
});

const mock = { getTracks: jest.fn().mockImplementation(() => []) };
const MockStream = (mock as unknown) as MediaStream;

describe('useMediaStream hook', () => {
  it('should have null stream and error at start', () => {
    const { result } = renderHook(
      ({ showVideo, constraints }) => useMediaStream(showVideo, constraints),
      {
        initialProps: {
          showVideo: false,
          constraints: CONSTRAINTS,
        },
      }
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0]).toBeNull();
    expect(result.current[1]).toBeNull();
  });

  it('should set stream when showVideo is true if given permission', async () => {
    getter.mockResolvedValueOnce(MockStream);

    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ showVideo, constraints }) => useMediaStream(showVideo, constraints),
      {
        initialProps: {
          showVideo: false,
          constraints: CONSTRAINTS,
        },
      }
    );

    expect(mock.getTracks).toHaveBeenCalledTimes(0);

    expect(result.current[0]).toBe(null);

    rerender({ showVideo: true, constraints: CONSTRAINTS });

    await waitForNextUpdate();

    expect(result.current[0]).toBe(MockStream);

    expect(mock.getTracks).toHaveBeenCalledTimes(0);
  });

  it('should set error if permission denied', async () => {
    getter.mockRejectedValueOnce({ message: 'error msg' });

    const { result, waitForNextUpdate, rerender } = renderHook(
      ({ showVideo, constraints }) => useMediaStream(showVideo, constraints),
      {
        initialProps: {
          showVideo: false,
          constraints: CONSTRAINTS,
        },
      }
    );

    expect(result.current[1]).toBe(null);

    rerender({ showVideo: true, constraints: CONSTRAINTS });

    await waitForNextUpdate();

    expect(result.current[0]).toBe(null);

    expect(result.current[1]).not.toBe(null);
  });

  it('should call stop for tracks when unmounting', async () => {
    mock.getTracks.mockClear();

    mock.getTracks.mockImplementation(() => [{ stop: jest.fn() }]);

    getter.mockResolvedValueOnce(MockStream);

    const { result, waitForNextUpdate, rerender, unmount } = renderHook(
      ({ showVideo, constraints }) => useMediaStream(showVideo, constraints),
      {
        initialProps: {
          showVideo: false,
          constraints: CONSTRAINTS,
        },
      }
    );

    expect(mock.getTracks).toHaveBeenCalledTimes(0);

    expect(result.current[0]).toBe(null);

    rerender({ showVideo: true, constraints: CONSTRAINTS });

    expect(mock.getTracks).toHaveBeenCalledTimes(0);

    await waitForNextUpdate();

    unmount();

    expect(mock.getTracks).toHaveBeenCalledTimes(1);
  });
});
