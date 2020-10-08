import { act, renderHook } from '@testing-library/react-hooks';
import usePeer from './usePeer';
import Peer from 'peerjs';

// mock peerjs
jest.mock('peerjs');

interface MockedPeer {
  listeners: Record<string, Function>;
  on: () => this;
  destroy: () => void;
}

const getPeerMock = () => {
  const newMock: MockedPeer = {
    listeners: {},
    on: jest.fn().mockImplementation(
      // saves the attached listeners in the listeners -object so they can be called later
      function (this: MockedPeer, event: string, callback: Function) {
        this.listeners[event] = callback;
        return this;
      }
    ),
    destroy: jest.fn(),
  };

  return (newMock as unknown) as Peer;
};

describe('usePeer hook', () => {
  const PeerMock = Peer as jest.Mock;

  let mock: Peer;

  beforeEach(() => {
    PeerMock.mockClear();

    mock = getPeerMock();

    PeerMock.mockImplementation(() => mock);
  });

  it('should init with peer and error as null', () => {
    const { result } = renderHook(() => usePeer());

    expect(result.current).toEqual([null, null]);
  });

  it('should init peer after first render', () => {
    const { result } = renderHook(() => usePeer());

    expect(result.current[0]).toBeNull();

    expect(PeerMock).toHaveBeenCalledTimes(1);
  });

  it('should call peer with correct params', () => {
    const expectedParams = {
      host: '/',
      port: 443, // in development will be 3333
      debug: 1,
      path: '/api/peerjs',
    };

    renderHook(() => usePeer());
    expect(PeerMock).toHaveBeenCalledWith(expectedParams);
  });

  it('shouldnt init peer if already exists', () => {
    const { rerender } = renderHook(() => usePeer());

    expect(PeerMock).toHaveBeenCalledTimes(1);

    rerender();

    expect(PeerMock).toHaveBeenCalledTimes(1);
  });

  it('should set event listeners', () => {
    renderHook(() => usePeer());

    expect(mock.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mock.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mock.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(mock.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
  });

  it('should do nothing atm on close or disconnect', () => {
    renderHook(() => usePeer());

    const asMock = (mock as unknown) as MockedPeer;

    asMock.listeners['close']();
    asMock.listeners['disconnected']();
  });

  it('should set peer client on "open"', () => {
    const { result } = renderHook(() => usePeer());

    const asMock = (mock as unknown) as MockedPeer;

    expect(result.current[0]).toBeNull();

    act(() => {
      asMock.listeners['open']();
    });

    expect(result.current[0]).toEqual(mock);
    expect(PeerMock).toHaveBeenCalledTimes(1);
  });

  it('should set error message on "error"', () => {
    const { result } = renderHook(() => usePeer());

    const asMock = (mock as unknown) as MockedPeer;

    expect(result.current[1]).toBeNull();

    const errorMsg = 'error msg';

    act(() => {
      asMock.listeners['error']({ message: errorMsg });
    });

    expect(result.current[1]).toEqual(errorMsg);
  });

  it('should call destroy as cleanup if client is set', () => {
    const { result, unmount } = renderHook(() => usePeer());

    const asMock = (mock as unknown) as MockedPeer;

    expect(result.current[0]).toBeNull();

    act(() => {
      asMock.listeners['open']();
    });

    if (!result.current[0]) {
      throw new Error('expected peer client to not be null');
    }

    expect(result.current[0].destroy).not.toHaveBeenCalled();

    unmount();

    expect(result.current[0].destroy).toHaveBeenCalled();
  });
});
