import { act, renderHook } from '@testing-library/react-hooks';
import usePeer from './usePeer';
import Peer from 'peerjs';
import xirsysService from '../services/xirsys';

jest.mock('peerjs');
jest.mock('../services/xirsys', () => ({
  getIceServers: jest.fn(),
}));

const getIceServers = xirsysService.getIceServers as jest.Mock;

const mockIceServerResponse = {
  test: true,
  username: 'test username',
  urls: ['test url'],
  credential: 'test credentials',
};

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
    getIceServers.mockClear();

    mock = getPeerMock();

    PeerMock.mockImplementation(() => mock);

    getIceServers.mockResolvedValue(mockIceServerResponse);
  });

  it('should init with peer and error as null', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    expect(result.current).toEqual([null, null]);
  });

  it('should do nothing if token is null', () => {
    const { result } = renderHook(() => usePeer(null));

    expect(result.current).toEqual([null, null]);

    expect(getIceServers).toHaveBeenCalledTimes(0);
  });

  it('should call getIceServers only on first render', async () => {
    const { waitForNextUpdate, rerender } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    expect(getIceServers).toHaveBeenCalledTimes(1);

    rerender();

    expect(getIceServers).toHaveBeenCalledTimes(1);
  });

  it('should set error and not init peer if iceServer fetching fails', async () => {
    getIceServers.mockRejectedValueOnce({ message: 'test error' });

    const { result, waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    expect(getIceServers).toHaveBeenCalledTimes(1);

    expect(result.current[1]).toBe('test error');

    expect(PeerMock).not.toHaveBeenCalled();
  });

  it('should init peer after first render if iceServer are set', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    expect(result.current[0]).toBeNull();

    expect(PeerMock).toHaveBeenCalledTimes(1);
  });

  it('should call peer with correct params', async () => {
    const expectedParams = {
      host: '/',
      port: 443, // in development will be 3333
      debug: expect.any(Number),
      path: '/api/peerjs',
      config: {
        iceServers: [
          {
            username: 'test username',
            urls: ['test url'],
            credential: 'test credentials',
          },
        ],
      },
    };

    const { waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    expect(PeerMock).toHaveBeenCalledWith(expectedParams);
  });

  it('shouldnt init peer if already exists', async () => {
    const { rerender, waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    expect(PeerMock).toHaveBeenCalledTimes(1);

    rerender();

    expect(PeerMock).toHaveBeenCalledTimes(1);
  });

  it('should set event listeners', async () => {
    const { waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    expect(mock.on).toHaveBeenCalledWith('error', expect.any(Function));
    expect(mock.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(mock.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(mock.on).toHaveBeenCalledWith('disconnected', expect.any(Function));
  });

  it('should do nothing atm on close or disconnect', async () => {
    const { waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    const asMock = (mock as unknown) as MockedPeer;

    asMock.listeners['close']();
    asMock.listeners['disconnected']();
  });

  it('should set peer client on "open"', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    const asMock = (mock as unknown) as MockedPeer;

    expect(result.current[0]).toBeNull();

    act(() => {
      asMock.listeners['open']();
    });

    expect(result.current[0]).toEqual(mock);
    expect(PeerMock).toHaveBeenCalledTimes(1);
  });

  it('should set error message on "error"', async () => {
    const { result, waitForNextUpdate } = renderHook(() => usePeer('token'));

    await waitForNextUpdate();

    const asMock = (mock as unknown) as MockedPeer;

    expect(result.current[1]).toBeNull();

    const errorMsg = 'error msg';

    act(() => {
      asMock.listeners['error']({ message: errorMsg });
    });

    expect(result.current[1]).toEqual(errorMsg);
  });

  it('should call destroy as cleanup if client is set', async () => {
    const { result, unmount, waitForNextUpdate } = renderHook(() =>
      usePeer('token')
    );

    await waitForNextUpdate();

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
